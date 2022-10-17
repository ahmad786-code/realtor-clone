import React, { useState, useEffect } from 'react'
import {collection, query, getDocs, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase'

import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Offers = () => {
const [offerListings, setOfferListings] = useState(null)
const [loading, setLoading] = useState(true)
const [lastFetchedListing, setLastFetchedListing] = useState(null)

  useEffect(() => {

    const fetchListings = async() => {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(listingRef, where("offer" , "==", true) , orderBy("timeStamp", "desc"), limit(8))
        const docSnap = await getDocs(q)
        const lastVisible = docSnap.docs[docSnap.docs.length - 1]
        setLastFetchedListing(lastVisible)
        let listings = []
        docSnap.forEach((snap) => {
          return listings.push({
            id: snap.id,
            data: snap.data()
          })
        })

        setOfferListings(listings)
        setLoading(false)

      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }

    fetchListings()
  },[])

  const fetchLoadMoreListings = async() => {
    try {
      const listingRef = collection(db, 'listings')
      const q = query(listingRef, where("offer" , "==", true) , orderBy("timeStamp", "desc"), startAfter(lastFetchedListing), limit(4))
      const docSnap = await getDocs(q)
      const lastVisible = docSnap.docs[docSnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      let listings = []
      docSnap.forEach((snap) => {
        return listings.push({
          id: snap.id,
          data: snap.data()
        })
      })

      setOfferListings((prevState) => [...prevState, ...listings])
      setLoading(false)

    } catch (error) {
      toast.error("Could not fetch listings")
    }
  }


  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>Offers</h1>
      {loading ? (<Spinner/>) : offerListings && offerListings.length > 0 ? (
        <>
        <main>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 '>
             {offerListings.map((listing) => (
              <ListingItem key={listing.id} id={listing.id} listing={listing.data}/>
             ))}
          </ul>
        </main>
        {lastFetchedListing && (
          <div className='flex justify-center items-center '>
            <button onClick={fetchLoadMoreListings}>Load More</button>
          </div>
        )}
        </>
      ) : 
      <p></p> 
      }

    </div>
  )
}

export default Offers