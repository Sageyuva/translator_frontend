'use client'

import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, FileText, Download, Mail, ArrowLeft } from 'lucide-react'

export default function UserProfileScreen() {
  const [files, setFiles] = useState([])
  const [token, setToken] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const api_URL = process.env.REACT_APP_API_KEY

  const handleDownload = async (filePath) => {
    try {
      const response = await axios.get(`${api_URL}/${filePath}`, {
        responseType: 'blob',
      })

      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] })
      const link = document.createElement('a')
      const fileName = filePath.split('/').pop()

      link.href = URL.createObjectURL(fileBlob)
      link.target = '_blank'
      link.download = fileName

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const fetchUserFiles = async () => {
    if (!token) {
      console.error("Token is missing!")
      return
    }

    try {
      const response = await axios.post(
        `${api_URL}/file/usePosts`, 
        { token }
      )

      if (response.status === 200) {
        setFiles(response.data.files)
        if (response.data.files.length > 0) {
          setUserName(response.data.files[0].clientname)
          setEmail(response.data.files[0].clientemail) 
        }
      } else {
        console.error("Failed to fetch files", response)
      }
    } catch (error) {
      console.error("Error fetching files:", error.response ? error.response.data : error)
    }
  }

  useEffect(() => {
    const userToken = localStorage.getItem('usertoken')

    if (!userToken) {
      alert('Please Login')
      navigate("/")
    } else {
      setToken(userToken)
    }
  }, [navigate])

  useEffect(() => {
    if (token) {
      fetchUserFiles()
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sm:p-10 relative">
            <button
              onClick={() => navigate("/")}
              className="absolute top-4 left-4 bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition duration-300"
              aria-label="Back to Home"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="bg-white p-3 rounded-full">
                  <User className="h-12 w-12 text-blue-500" />
                </div>
                <div className="ml-4 text-white">
                  <h1 className="text-2xl font-bold">{userName}</h1>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    <p>{email}</p>
                  </div>
                </div>
              </div>
              <button
  onClick={() => {
    localStorage.clear();
    navigate("/");
  }}
  className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
>
  Logout
</button>

            </div>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your Files</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.length > 0 ? (
                    files.map((file) => (
                      <tr key={file._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{file.originalFilePath.split('/').pop()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            file.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.fromLanguage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.toLanguage || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDownload(file.originalFilePath)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Original <Download className="inline-block h-4 w-4" />
                          </button>
                          {file.translatedFilePath && (
                            <button
                              onClick={() => handleDownload(file.translatedFilePath)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Translated <Download className="inline-block h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No files available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}