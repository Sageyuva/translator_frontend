'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Backdrop, CircularProgress } from '@mui/material'

export default function KeyVerification({ onClose }) {
  const [adminKey, setAdminKey] = useState('')
  const [message, setMessage] = useState('')
  const api_URL = process.env.REACT_APP_API_KEY;
  const [Loading, setLoading] = useState(false)

  const handleKeyChange = (e) => {
    setAdminKey(e.target.value)
  }

  const verifyKey = async () => {
    try {
      setLoading(true)
      const verify = await axios.post(`${api_URL}/admin`, { adminKey })

      if (verify.status === 200) {
        onClose()
        setLoading(false)
      } else {
        console.error("Admin key verification failed:", verify.status)
        alert("Admin key verification failed. Please check your key and try again.")
        setLoading(false)
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response)
        alert("Error: " + error.response.data || "An unexpected error occurred.")
        setLoading(false)
      } else if (error.request) {
        console.error("No response received:", error.request)
        alert("Error: No response from server. Please check your network connection.")
        setLoading(false)
      } else {
        console.error("Error setting up request:", error.message)
        alert("Error: " + error.message)
        setLoading(false)
      }
    }
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={Loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-96 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Key Verification</h2>
          <input
            type="password"
            placeholder="Enter admin key"
            value={adminKey}
            onChange={handleKeyChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          />
          {message && (
            <div className={`p-3 mb-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
          <button
            onClick={verifyKey}
            className="w-full p-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
          >
            Verify Key
          </button>
        </div>
      </div>
    </>
  )
}
