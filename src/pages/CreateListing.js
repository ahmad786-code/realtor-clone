import React, { useState } from 'react'
import {getStorage, ref, getDownloadURL , uploadBytesResumable} from 'firebase/storage'
import {getAuth} from 'firebase/auth'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import { v4 as uuidv4} from 'uuid'
import { addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase'
import { useNavigate  } from 'react-router'


const CreateListing = () => {
    const navigate = useNavigate()

    const auth = getAuth()

    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        type: 'sale',
        name: '',
        bedrooms: 1,
        baths: 2,
        parking: false,
        furnished: true,
        address: '',
        description: '',
        offer: true,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,   
        images: {}

    })

    const { type, name, bedrooms, baths, furnished, parking, address, description, offer, regularPrice, discountedPrice, images, latitude, longitude } = formData

    const onChange =  (e) => {
        let boolean = null
        if(e.target.value === 'true') {
            boolean = true
        }
        if(e.target.value === 'false') {
            boolean = false
        }

        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(+discountedPrice >= +regularPrice) {
            setLoading(false)
            toast.error("Discounted Price needs to be less then regular price")
            return 
        }

        if(images.length > 6) {
            setLoading(false)
            toast.error("Maximum 6 images allowed")
            return 
        }

        async function storeImage(image) {
            return new Promise((resolve, reject) => {
              const storage = getStorage();
              const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
              const storageRef = ref(storage, filename);
              const uploadTask = uploadBytesResumable(storageRef, image);
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                    case "paused":
                      console.log("Upload is paused");
                      break;
                    case "running":
                      console.log("Upload is running");
                      break;
                  }
                },
                (error) => {
                  // Handle unsuccessful uploads
                  reject(error);
                },
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                  });
                }
              );
            });
          }

          const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
          ).catch((error) => {
            setLoading(false);
            toast.error("Images not uploaded");
            return;
          });

        const formDataCopy = {
            ...formData,
            imgUrls,
            timeStamp: serverTimestamp(),
            userRef: auth.currentUser.uid
        }
        delete formDataCopy.images
        delete formDataCopy.longitude
        delete formDataCopy.latitude
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = await addDoc(collection(db, "listings"), formDataCopy)
        setLoading(false)
        toast.success("Listing created")
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    if(loading) {
        return <Spinner/>
    }
    return (
        <main className='max-w-md mx-auto px-2'>
            <h1 className="text-3xl text-center mt-6 font-bold">Create Listing</h1>
            <form onSubmit={handleSubmit}>
                <p className='text-lg mt-6 font-semibold '>Sell / Rent</p>
                <div className="flex ">
                    <button
                        type='button'
                        id='type'
                        value='sale'
                        onClick={onChange}
                        className={
                            `
                    mr-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${type === 'rent' ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        sale
                    </button>
                    <button
                        type='button'
                        id='type'
                        value='rent'
                        onClick={onChange}
                        className={
                            `
                    ml-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${type === 'sale' ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        Rent
                    </button>
                </div>
                <p className='text-lg mt-6 font-semibold '>Name</p>
                <input type="text" id="name" value={name} onChange={onChange} placeholder="* Name"
                    maxLength="32" min='10' required
                    className='w-full px-4 py-2 rounded text-xl text-gray-600 bg-white border-gray-300 transition duration-150 ease-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                />
                <div className='flex space-x-6 mb-6'>
                    <div>
                        <p className='text-lg mt-6 font-semibold '>Beds</p>
                        <input type="number" id="bedrooms" value={bedrooms} onChange={onChange} min="1" max='50' required
                            className='w-full px-4 py-2 text-xl text-gray-700 border border-gray-700 transition duration-150 ease-out  focus:text-gray-700 focus:bg-white  focus:border-slate-600 text-center'
                        />
                    </div>
                    <div>
                        <p className='text-lg mt-6 font-semibold '>Baths</p>
                        <input type="number" id="baths" value={baths} onChange={onChange} min="1" max='50' required
                            className='w-full px-4 py-2 text-xl text-gray-700 border border-gray-300 transition duration-150 ease-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                        />
                    </div>
                </div>

                <p className='text-lg mt-6 font-semibold '>Parking Spot</p>
                <div className="flex ">
                    <button
                        type='button'
                        id='parking'
                        value={true}
                        onClick={onChange}
                        className={
                            `
                    mr-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${!parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        Yes
                    </button>
                    <button
                        type='button'
                        id='parking'
                        value={false}
                        onClick={onChange}
                        className={
                            `
                    ml-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${parking ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        No
                    </button>
                </div>

                <p className='text-lg mt-6 font-semibold '>Furnished</p>
                <div className="flex ">
                    <button
                        type='button'
                        id='furnished'
                        value={true}
                        onClick={onChange}
                        className={
                            `
                    mr-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${!furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        Yes
                    </button>
                    <button
                        type='button'
                        id='furnished'
                        value={false}
                        onClick={onChange}
                        className={
                            `
                    ml-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${furnished ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        No
                    </button>
                </div>

                <p className='text-lg mt-6 font-semibold '>Address</p>
                <textarea type="text" id="address" value={address} onChange={onChange} placeholder="* Address"
                    required
                    className='w-full px-4 py-2 rounded text-xl text-gray-600 bg-white border-gray-300 transition duration-150 ease-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                />

                {!geoLocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div className="">
                            <p className='text-lg  font-semibold '>Latitude</p>
                            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" id='latitude' value={latitude} onChange={onChange} min="-90" max="90"/>
                        </div>
                        <div className="">
                            <p className='text-lg  font-semibold '>Longitude</p>
                            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center' type="number" id='longitude' value={longitude} onChange={onChange} min="-180" max="180"/>
                        </div>
                    </div>
                )}

                <p className='text-lg mt-6 font-semibold '>Description</p>
                <textarea type="text" id="description" value={description} onChange={onChange} placeholder="* Description"
                    required
                    className='w-full px-4 py-2 rounded text-xl text-gray-600 bg-white border-gray-300 transition duration-150 ease-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6'
                />

                <p className='text-lg  font-semibold '>Offers</p>
                <div className="flex mb-6">
                    <button
                        type='button'
                        id='offer'
                        value={true}
                        onClick={onChange}
                        className={
                            `
                    mr-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${!offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        Yes
                    </button>
                    <button
                        type='button'
                        id='offer'
                        value={false}
                        onClick={onChange}
                        className={
                            `
                    ml-3
                    px-7 py-3 w-full rounded font-medium shadow-md text-sm uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-out
                    ${offer ? 'bg-white text-black' : 'bg-slate-600 text-white'}
                    `
                        }
                    >
                        No
                    </button>
                </div>

                <p className='text-lg  font-semibold '>Regular Price</p>
                <div className="flex items-center mb-6">

                    <div className="flex w-full justify-center items-center space-x-6">
                        <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} min="50" max="400000" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded  transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                        {
                            type === 'rent' && (
                                <div>
                                    <p className='text-md w-full whitespace-nowrap'>$ / Month</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                {offer && (
                    <>
                             <p className='text-lg  font-semibold '>Discounted Price</p>
                             <div className="flex items-center mb-6">
                                <div className="flex  justify-center items-center space-x-6">
                                    <input type="number"  id="discountedPrice" value={discountedPrice} onChange={onChange} min="50" max="400000" required={offer} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded  transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'  />
                                </div>
                             </div>
                       </>
                )}

                <div className="mb-6">
                    <p className='text-lg  font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be the cover (max 6) </p>
                    <input type="file" id="images" onChange={onChange} accept=".png, .jpeg, .jpg" required multiple className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600'/>
                </div>
                <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700
                focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Create Listing</button>
            </form>
        </main>
    )
}

export default CreateListing