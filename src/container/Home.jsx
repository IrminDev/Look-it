import React, {useState, useRef, useEffect} from 'react';
import {HiMenu} from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { userQuery } from '../utils/data'
import { client } from '../client';
import logo  from '../assets/logo.png';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
    {/* State for Sidebar */}
    const [toggleSidebar, settoggleSidebar] = useState(false)
    {/* State for user */}
    const [user, setUser] = useState(null)
    const scrollRef = useRef(null)

    const userInfo = fetchUser();

    useEffect(() => {
        const query = userQuery(userInfo?.googleId);
        client.fetch(query)
        .then((data) => {
            setUser(data[0]);
        })
    }, [])

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0)
    }, [])

    return (
        <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
            {/* SideBar for medium devices */}
            <div className="hidden md:flex h-screen flex-initial">
                {/* We render the sidebar inside these divs */}
                <Sidebar user={user && user} />
            </div>

            {/* SideBar for large devices */}
            <div className="flex md:hidden flex-row">
                <div className="p-2 w-full flex flew-row justify-between items-center shadow-md">
                    <HiMenu fontSize={40} className="cursor-pointer" onClick={() => settoggleSidebar(true)} />
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-28" /> 
                    </Link>
                    <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.image} alt="logo" className="w-14 h-15 rounded-full" /> 
                    </Link>
                </div>
                {toggleSidebar && (
                    <div className="fixed w-3/6 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                        <div className="absolute w-full flex justify-end items-center p-2">
                            <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => settoggleSidebar(false)}/>
                        </div>
                        <Sidebar user={user && user} closeToggle={settoggleSidebar} />
                    </div>
                )}
            </div>
            <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
                <Routes>
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    <Route path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Home
