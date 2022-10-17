import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {  toast } from 'react-toastify';
import {db} from '../firebase'
import { useNavigate } from 'react-router';


const OAuth = () => {

  const navigate = useNavigate()


  const googleOAth = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      if(!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp()
        })
      }
      navigate('/')

    } catch (error) {
      toast.error("Could not authorized with Google")
     

    }
  }

  return (
   <button type='button' onClick={googleOAth} className='flex items-center justify-center w-full bg-red-500 text-white py-3 px-7 text-sm font-medium
   uppercase rounded shadow-md hover:bg-red-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-800'> <FcGoogle className='text-2xl bg-white rounded-full mr-2' /> CONTINUE WITH GOOGLE</button>
  )
}

export default OAuth