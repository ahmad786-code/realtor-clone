import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import OAuth from '../components/OAuth'

const ForgotPassword = () => {

  const [email, setEmail] = useState('')

  const onSubmit = async(e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
    await sendPasswordResetEmail(auth, email)
    toast.success("Email was sent")
    } catch (error) {
      toast.error("Could not send to reset password")
    }
  }

  return (
    <section>
      <h1 className='text-center font-bold mt-6 text-3xl'>Forgot Password</h1>
      <div className='flex justify-center flex-wrap items-center px-6 max-w-6xl mx-auto py-12 '>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" className='w-full rounded-2xl' alt="key" />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition-all ease-out' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' />
        
            <div className='mb-6 flex justify-between items-center whitespace-nowrap text-sm sm:text-lg'>
              <p>Don't have an account? <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1' to="/sign-up">Register</Link></p>
              <p> <Link className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out ml-1' to="/sign-in">Sign In Instead</Link> </p>
            </div>
            <button type='submit' className='w-full bg-blue-500 text-white py-3 px-7 text-sm font-medium
          uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Send Reset password</button>
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

export default ForgotPassword