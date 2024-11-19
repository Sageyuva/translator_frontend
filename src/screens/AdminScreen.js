import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {  Users, FileText, UploadCloud } from 'lucide-react';
import { Backdrop, CircularProgress, IconButton, Tooltip } from '@mui/material';
import KeyVerification from '../components/KeyVerification';
import { useNavigate } from 'react-router-dom';

export default function AdminScreen() {
  const [admin, setAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('files');
  const api_Key = process.env.REACT_APP_API_KEY;
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${api_Key}/user/allusers`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${api_Key}/file/getall`);
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const adminUpload = async (fileId) => {
    if (!file) {
      alert('Please select a file before uploading.');
      return;
    }

    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileId', fileId);

      await axios.post(`${api_Key}/file/adminUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('File uploaded successfully.');
      fetchFiles(); 
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    } finally {
      setUploadLoading(false);
    }
  };

  const sendMail = async (clientemail, fromLanguage, toLanguage, filePath) => {
    try {
      setLoading(true);// Show loading indicator
      const response = await axios.post(`${api_Key}/user/sendfile`, { clientemail, fromLanguage, toLanguage, filePath });

      if (response.status === 200) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    setLoading(true);
    navigate('/admin');
    Promise.all([fetchUsers(), fetchFiles()]).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (filePath) => {
    try {
      const response = await axios.get(`${api_Key}/${filePath}`, {
        responseType: 'blob',
      });
  
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      const fileName = filePath.split('/').pop();

      link.href = URL.createObjectURL(fileBlob);
      link.target = '_blank';
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <>
      {admin ? null : <KeyVerification onClose={() => { setAdmin(true); }} />}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading || uploadLoading}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        <div className="flex justify-center mb-6">
          <button
            className={`flex items-center px-6 py-2 mr-4 rounded-lg ${activeTab === 'files' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('files')}
          >
            <FileText className="mr-2" />
            All Files
          </button>
          <button
            className={`flex items-center px-6 py-2 rounded-lg ${activeTab === 'users' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-2" />
            All Users
          </button>
        </div>

        {activeTab === 'files' && (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Username</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Original File</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">From Language</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">To Language</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Translated File</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(files) && files.length > 0 ? (
                  files.map((file) => (
                    <tr key={file._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{file.clientname}</td>
                      <td className="px-4 py-2 text-blue-500 cursor-pointer" onClick={() => handleDownload(file.originalFilePath)}>
                        {file.originalFilePath.split('/').pop()}
                      </td>
                      <td className="px-4 py-2">{file.status}</td>
                      <td className="px-4 py-2">{file.fromLanguage}</td>
                      <td className="px-4 py-2">{file.toLanguage || 'Not Available'}</td>
                      <td className="px-4 py-2">
                        {file.translatedFilePath ? (
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 cursor-pointer" onClick={() => handleDownload(file.translatedFilePath)}>
                              {file.translatedFilePath.split('/').pop()}
                            </span>
                            <Tooltip title="Send Mail Alert">
                              <IconButton
                                className="bg-blue-500 text-white"
                                onClick={() => sendMail(file.clientemail, file.fromLanguage, file.toLanguage, file.translatedFilePath)}
                              >
                                <UploadCloud />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ) : (
                          <>
                            <input type="file" onChange={handleFileChange} className="border p-1 rounded" />
                            <button
                              className="bg-blue-500 text-white px-4 py-1 rounded ml-2"
                              onClick={() => adminUpload(file._id)}
                              disabled={uploadLoading}
                            >
                              {uploadLoading ? 'Uploading...' : 'Upload File'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No files available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className={`text-sm ${user.verified ? 'text-green-500' : 'text-red-500'}`}>
                  {user.verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
