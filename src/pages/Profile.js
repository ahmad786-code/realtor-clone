import React, {useEffect, useState} from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import {db} from '../firebase'
import {FcHome} from 'react-icons/fc'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

const Profile = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [changeDetail, setChangeDetail] = useState(false)
  const [formData, setFormData] = useState({name: auth.currentUser.displayName, email: auth.currentUser.email })

  const {name, email} = formData

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
 
    }))
  }

  const onLogOut = () => {
    auth.signOut()
    navigate('/')
  }

  const submitDetail = async () => {
    try {
      if(auth.currentUser.displayName !== name ) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        const docRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(docRef, {
          name: name
        })
      }
      toast.success("Profile details update success")
    } catch (error) {
      toast.error("Could not update the profile details")
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

const onDelete = async(listingId) => {
  if(window.confirm("Are you satisfied to delete?")) {
    await deleteDoc(doc(db, 'listings', listingId))
    const updateListing = listings.filter((listing) => listing.id !== listingId)
    setListings(updateListing)
    toast.success("Successfully deleted listings")
  } 
}

const onEdit = (listingId) => {
  navigate(`/edit-listing/${listingId}`)
}
console.log(listings);
  return (
    <>
    <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
      <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          <input type="text" name='name' id='name' value={name} disabled = {!changeDetail} onChange={handleChange}
          className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-grey-300 rounded transition ease-in ${changeDetail && 'bg-red-200 focus:bg-red-200'}`}
          />
          <input type="email" name='email' id='email' value={email} disabled = {!changeDetail} onChange={handleChange} 
           className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-grey-300 rounded transition ease-in ${changeDetail && 'bg-red-200 focus:bg-red-200'}`} />

             <div className='flex justify-between  whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p className='flex items-center '>Do you want to change your name? 
              <span onClick={() => { changeDetail && submitDetail(); setChangeDetail(!changeDetail) }} className='text-red-600 hover:text-red-700 transition duration-200 ease-in  cursor-pointer pl-1 '>{changeDetail ? 'Apply Change' : 'Edit'} </span></p>
              <p className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in cursor-pointer' onClick={onLogOut}>Sign Out</p>
             </div>
        </form>
        <button className='w-full bg-blue-600 uppercase cursor-pointer rounded shadow-md px-7 py-3 text-white text-sm font-medium hover:bg-blue-700 transition duration-150  ease-out  hover:shadow-lg active:bg-blue-800' 
        type="submit">
          <Link to="/create-listing" className='flex items-center justify-center'>
        <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>  sell or rent your home
          </Link>
        </button>
      </div>
    </section>
    <div className="max-w-6xl px-3 mt-6 mx-auto">
      {!loading  && listings.length > 0 && (
        <>
        <h2 className='text-2xl font-semibold text-center mb-6'>My Listings</h2>
        <ul  className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {listings.map((listing) => {
            return <ListingItem key={listing.id} id={listing.id} listing={listing.data} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit (listing.id)}/>
          })}
        </ul>
        </>
      )}
    </div>
    </>
  )
}

export default Profile