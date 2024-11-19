import axios from 'axios'
import { useState } from 'react'
import { Backdrop, CircularProgress } from '@mui/material'

export default function OTPVerification({ onClose }) {
  const [Loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const api_Key = process.env.REACT_APP_API_KEY

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const userId = localStorage.getItem('user')
      const verify = await axios.post(`${api_Key}/user/verify-otp`, { userId, otp }) 
      alert("Verification Complete")
      localStorage.clear()
      window.location.reload()
        } catch (error) {
          if (error && error.status) {
            switch (error.status) {
                case 404:
                    alert('User not found.');
                    break;
                case 400:
                    alert('Invalid OTP.');
                    break;
                case 500:
                    alert('Server issue. Please try again later.');
                    break;
                default:
                    alert('Internal server error. Please contact support.');
            }
        } else {
            alert('An unknown error occurred. Please try again.');
        }
    } finally {
      setLoading(false) 
    }
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={Loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
          <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your phone</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.toString())}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify OTP
            </button>
          </form>
          
        </div>
      </div>
    </>
  )
}
