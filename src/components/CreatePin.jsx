import React, {useState} from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { Categories } from '../utils/data'; 

const CreatePin = ({ user }) => {
    // All the use state that we're gonna need to upload a new pin
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(null);
    const [category, setCategory] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [wrongTypeImage, setWrongTypeImage] = useState(false)

    const navigate = useNavigate();

    const uploadImage = (e) => {
        const { type, name } = e.target.files[0];
        if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff'){
            setWrongTypeImage(false);
            setLoading(true);

            client.assets
            .upload('image', e.target.files[0], { contentType: type, filename: name})
            .then((document) => {
                setImageAsset(document);
                setLoading(false);
            }) 
            .catch((error) => {
                console.log('Image error on upload', error)
            })
        }else{
            setWrongTypeImage(true);
        }
    }

    const savePin = () => {
        if(title && about && imageAsset?._id && category){
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id
                    }
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
            }
            client.create(doc)
            .then(() => {
                navigate('/');
            })
        }
        else{
            setFields(true);

            setTimeout(() => {
                setFields(false);
            }, 5000);
        }
    }


    return (
        <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
           {fields && (
                <p className="text-red-400 mb-5 text-xl transition-all duration-150 ease-in">
                    Please fill all the fields that are necesary.
                </p>
           )}
           <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-9/1o w-full">
                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
                    <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
                        {loading && <Spinner />}
                        {wrongTypeImage && <p>Wrong image type</p>}
                        {!imageAsset ? (
                            <label className="cursor-pointer">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="flex flex-col items-center justify-center ">
                                        <p className="font-bold text-2xl">
                                            <AiOutlineCloudUpload />
                                        </p>
                                        <p className="text-lg">Click to upload</p>
                                    </div>
                                    <p className="mt-32 text-gray-400 ">Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20 mb.</p>
                                </div>
                                <input 
                                    type="file"
                                    name="upload-image"
                                    onChange={uploadImage}
                                    className="w-0 h-0"
                                />
                            </label>
                        ) : (
                            <div className="relative h-full">
                                <img 
                                    src={imageAsset?.url}
                                    alt="uploaded-pic"
                                    className="w-full h-full"
                                />
                                <button
                                    type="button"
                                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                                    onClick={() => setImageAsset(null)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add the image tittle here"
                        className="outline-none text-md sm:text-lg font-bold border-b-2 border-gray-200 p-2"
                    />
                    {user && (
                        <div className="flex gap-2 items-center bg-white rounded-lg">
                            <img 
                                src={user.image}
                                className="w-10 h-10 rounded-full"
                                alt="user-profile"
                            />
                            <p className="font-bold">{user.userName}</p>
                        </div>
                    )}
                    <input 
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Add a description of your image"
                        className="outline-none text-base sm:text-md border-b-2 border-gray-200 p-2"
                    />
                    <input 
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Add a destination URL"
                        className="outline-none text-base sm:text-md border-b-2 border-gray-200 p-2"
                    />
                    <div className="flex flex-col ">
                        <div>
                            <p className="mb-2 font-semibold text-md sm:text-lg">Choose image category</p>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                className="outline-none w-3/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                            >
                                <option value="other" className="bg-white">Select category</option>
                                {Categories.map((category) => (
                                    <option key={category.name} className="text-base border-0 outline-none capitalize bg-white text-black">{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end items-end mt-5 ">
                            <button
                                type="button"
                                onClick={savePin} 
                                className="bg-red-500 text-white p-2 font-bold rounded-full w-28 outline-none"

                            >
                                Save pin
                            </button>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    )
}

export default CreatePin
