

import { collection , query, getDocs, where, orderBy, limit} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import Slider from '../components/Slider'
import { db } from '../firebase'


const Home = () => {  
const [offerListings, setOfferListings] = useState(null)
const [rentListings, setRentListings] = useState(null)
const [saleListings, setSaleListings] = useState(null)

useEffect(() => {
  const fetchListings = async() => {
    const listingsRef = collection(db, 'listings')
    const q = query(listingsRef, where("offer", "==" , true), orderBy('timeStamp', 'desc'), limit(4))

    const querySnap = await getDocs(q)

    let listings = []
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data()
      })
    })
    setOfferListings(listings)
  }

  fetchListings()

},[])



useEffect(() => {
  const fetchListings = async() => {
    const listingsRef = collection(db, 'listings')
    const q = query(listingsRef, where("type", "==", "rent"), orderBy('timeStamp', 'desc'), limit(4))

    const querySnap = await getDocs(q)

    let listings = []
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data()
      })
    })
    setRentListings(listings)
  }

  fetchListings()

},[])

useEffect(() => {
  const fetchListings = async() => {
    const listingsRef = collection(db, 'listings')
    const q = query(listingsRef, where("type", "==" , "sale"), orderBy('timeStamp', 'desc'), limit(4))

    const querySnap = await getDocs(q)

    let listings = []
    querySnap.forEach((doc) => {
      return listings.push({
        id: doc.id,
        data: doc.data()
      })
    })
    setSaleListings(listings)
  }

  fetchListings()

},[])


  return (
    <div>
      <Slider/>
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings && offerListings.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Recent offers</h2>
            <Link to='/offers'>
          <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">   See more  offers </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {
                offerListings.map((listing) => (
                  <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
                ))
              }
            </ul>
          </div>
        )}

{rentListings && rentListings.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for rent</h2>
            <Link to='/category/rent'>
          <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">   See more  offers </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {
                rentListings.map((listing) => (
                  <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
                ))
              }
            </ul>
          </div>
        )}

{saleListings && saleListings.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Places for sale</h2>
            <Link to='/category/sale'>
          <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">   See more  offers </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {
                saleListings.map((listing) => (
                  <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
                ))
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home