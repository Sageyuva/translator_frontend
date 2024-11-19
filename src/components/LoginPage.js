import { useEffect, useState } from 'react'
import axios from 'axios'
import { Backdrop, CircularProgress } from '@mui/material'
import { X, Eye, EyeOff } from 'lucide-react'
import OTPVerification from './OTPVerification'

export default function LoginPage({ onClose }) {
  const [Loading, setLoading] = useState(false)
  const [OTPform, setOTPform] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const api_Key = process.env.REACT_APP_API_KEY


  const handleLogin = async () => {
    try {
      setLoading(true)
      const User = await axios.post(`${api_Key}/user/login`, { email, password })
      const userToken = User.data.token;
      localStorage.setItem("usertoken", userToken)
      setLoading(false)
      window.location.reload()
    } catch (error) {
      setLoading(false)
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          alert('User not found')
        } else if (status === 403) {
          alert('Account not verified')
        } else if (status === 400) {
          alert('Invalid credentials')
        } else if (status === 500) {
          alert('Internal server issue')
        } else {
          alert("SERVER FAILED TRY AGAIN LATER")
        }
      } else {
        alert("SERVER FAILED TRY AGAIN LATER")
      }
    }
  }

  const handleRegister = async () => {
    try {
      setLoading(true)
      const number = phoneNumber
      const newUser = await axios.post(`${api_Key}/user/register`, { name, email, password, number })
      if (newUser.status === 200) {
        localStorage.setItem('user', newUser.data.userId)
        alert('OTP SENT CHECK YOUR MAIL')
        setLoading(false)
        setOTPform(true)
      }
    } catch (error) {
      setLoading(false)
      alert("Error during registration, please try again.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isLogin ? handleLogin() : handleRegister())
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    const userToken = localStorage.getItem('usertoken')
    if (userToken) {
      alert("User already logged in")
      onClose()
      window.location.reload()
    }
  }, [onClose])

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={Loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? 'Login' : 'Register'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-sky-600 hover:text-sky-500 transition-colors"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        </div>
        {OTPform ? <OTPVerification onClose={() => { setOTPform(false) }} /> : null}
      </div>
    </>
  )
}
