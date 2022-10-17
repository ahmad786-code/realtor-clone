import React from 'react'
import { Link } from 'react-router-dom'
import ReactMoment from 'react-moment'
import { MdLocationOn } from 'react-icons/md'
import {FaTrash} from 'react-icons/fa'
import { MdEdit} from 'react-icons/md'
import {  useParams  } from 'react-router'
const ListingItem = ({ listing, id, onDelete, onEdit }) => {
const params = useParams()

  return (
    <li className='flex flex-col items-center justify-between shadow-md hover:shadow-xl bg-white rounded-md overflow-hidden transition-shadow duration-150 relative m-[10px]'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
        <img className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in' loading='lazy' src={listing.imgUrls} alt="" />
        <ReactMoment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold px-3 py-1 rounded shadow-lg' fromNow>
          {listing.timeStamp?.toDate()}
        </ReactMoment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className='h-4 w-4 text-green-600'/>
            <p className='font-semibold mb-[2px] text-sm text-gray-600 truncate'>{listing.address}</p>
          </div>
          <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
          <p className='text-[#457b9d] mt-2 font-semibold '> 
            $
            {listing.offer
              ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p  className="font-bold text-xs">{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `1 Bed` }</p>
            </div>
            <div  className=" flex items-center space-x-1">
            <p className="font-bold text-xs">{listing.baths > 1 ? `${listing.baths} Baths` : `1 Bath` }</p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash className='absolute bottom-2 right-2 text-red-600 h-[14px] cursor-pointer' onClick={() => onDelete(listing.id)}/>
      )}
      {onEdit && (
        <MdEdit className='absolute bottom-2 right-8 text-black h-4 cursor-pointer' onClick={() => onEdit(listing.id)}/>
      )}
    </li>
  )
}

export default ListingItem