import React, {useState} from 'react'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import OAuth from '../components/OAuth'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {db} from '../firebase'
import { useNavigate } from 'react-router-dom'
import {  toast } from 'react-toastify';


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({name: '', email: '', password: '' })

  const navigate = useNavigate()

  const {name, email, password} = formData
 
  const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword(auth, email, password) 
        updateProfile(auth.currentUser, {
            displayName: name
        })
        const user = userCredential.user;
        const formDataCopy = { ...formData };
        delete formDataCopy.password;
        formDataCopy.timestamp = serverTimestamp();
  
        await setDoc(doc(db, "users", user.uid), formDataCopy);
        toast.success("Sign up was successful");
        navigate('/')

    } catch (error) {
      toast.error("Something went wrong!!")
    }

  }

  return (
    <section>
      <h1 className='text-center font-bold mt-6 text-3xl'>Sign UP</h1>
      <div className='flex justify-center flex-wrap items-center px-6 max-w-6xl mx-auto py-12 '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" className='w-full rounded-2xl' alt="key" />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition-all ease-out' type="text" id="name" value={formData.name} onChange={onChange} placeholder='Full Name' />
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition-all ease-out' type="email" id="email" value={formData.email} onChange={onChange} placeholder='Email Address' />
            <div className='relative mb-6'>
              <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition-all ease-out' type={showPassword ? "text" : 'password'} id="password" value={formData.password} onChange={onChange} placeholder='Password' />
              {showPassword ? <AiFillEyeInvisible onClick={() => setShowPassword(false)} className='absolute right-3 top-3 text-xl cursor-pointer' /> : <AiFillEye onClick={() => setShowPassword(true)} className='absolute right-3 top-3 text-xl cursor-pointer' />}
            </div>

            <div className='mb-6 flex justify-between items-center whitespace-nowrap text-sm sm:text-lg'>
              <p>Already have an account? <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1' to="/sign-in">Sign In</Link></p>
              <p> <Link className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1' to="/forgot-password">Forgot Password</Link> </p>
            </div>
            <button type='submit' className='w-full bg-blue-500 text-white py-3 px-7 text-sm font-medium
          uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Sign UP</button>
            <div className='flex items-center my-4 before:flex-1 before:border-gray-300  after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
              <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignUp