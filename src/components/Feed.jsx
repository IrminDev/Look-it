import { ClientError } from '@sanity/client';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {client} from '../client'
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';


const Feed = () => {
    // Use states that will help us to render the information in the feed
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null);

    // Category id that will check what category we choose from the URL
    const { categoryId } = useParams();

    // Method that we will use to search by category or if the category is empty we will show the feed
    useEffect(() => {
        setLoading(true);

        if(categoryId){
            const query = searchQuery(categoryId);
            client.fetch(query)
            .then((data) => {
                setPins(data);
                setLoading(false);
            })
        }
        else{
            client.fetch(feedQuery)
            .then((data) => {
                setPins(data);
                setLoading(false);
            });
        }
    }, [categoryId])

    // If the content is loading, a spinner will print in the page with the message
    if(loading) {
        return <Spinner message="We are loading all the ideas to your feed!" />
    }

    if(!pins?.length){
        return <h2>No pins available</h2>
    }

    return (
        <div>
           {pins && <MasonryLayout pins = {pins} />}
        </div>
    )
}

export default Feed
