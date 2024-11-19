import React, { useEffect, useState } from 'react';
import { Menu, X, Globe, User, LayoutDashboard, Upload, CheckCircle, DollarSign, Clock } from 'lucide-react';
import LoginPage from '../components/LoginPage';
import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fromLanguage, setFromLanguage] = useState('');
  const [toLanguage, setToLanguage] = useState('');
  const [file, setFile] = useState(null);
  const api_URL = process.env.REACT_APP_API_KEY; 
  const [Loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogin = () => {
    setShowLoginForm(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoggedIn) {
        setLoading(true);
        const token = localStorage.getItem('usertoken');
       
        const formData = new FormData();
        formData.append('toLanguage', toLanguage);
        formData.append('fromLanguage', fromLanguage);
        formData.append('file', file);
        formData.append('token', token);

        const fileUpload = await axios.post(`${api_URL}/file/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFromLanguage("")
        setToLanguage("")
        setFile(null)
        setLoading(false);
        alert('File uploaded successfully!');
      } else {
        alert('Please login to upload file');
        setLoading(false);
        setShowLoginForm(true);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      alert('Error uploading file. Please try again later.');
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem('usertoken');
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={Loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
      {showLoginForm ? <LoginPage onClose={() => { setShowLoginForm(false); }} /> : null}

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-200 to-indigo-300">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">TranslateHub</span>
              </div>
              <div className="hidden sm:flex items-center space-x-4">
                <a href="#home" className="text-gray-700 hover:text-indigo-600">Home</a>
                <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-indigo-600">Pricing</a>
                {isLoggedIn ? (
                  <>
                    <button  onClick={()=> navigate('/user')} className="text-gray-700 hover:text-indigo-600">
                      <User className="h-5 w-5" />
                    </button>
                   
                    <button
                      onClick={() => { localStorage.clear(); window.location.reload(); }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
                  >
                    Login
                  </button>
                )}
              </div>
              <div className="sm:hidden flex items-center">
                <button onClick={toggleMenu} className="text-gray-700 hover:text-indigo-600">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
          {isMenuOpen && (
            <div className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="font-semibold block px-3 py-2 text-gray-700 hover:text-indigo-600">Home</a>
                <a href="#features" className="font-semibold block px-3 py-2 text-gray-700 hover:text-indigo-600">Features</a>
                <a href="#pricing" className="font-semibold block px-3 py-2 text-gray-700 hover:text-indigo-600">Pricing</a>
                {isLoggedIn ? (
                  <>
                    <a href="#" className="block px-3 py-2 text-gray-700 font-semibold hover:text-indigo-600">Profile</a>
                    <a href="#" className="block px-3 py-2 text-gray-700 font-semibold hover:text-indigo-600">Dashboard</a>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        <main>
          <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">TranslateHub</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload your file and get expert translations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
              <div className="mb-6">
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 10MB)</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="from-language" className="block text-sm font-medium text-gray-700 mb-2">
                    From Language
                  </label>
                  <select
                    id="from-language"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="to-language" className="block text-sm font-medium text-gray-700 mb-2">
                    To Language
                  </label>
                  <select
                    id="to-language"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                disabled={Loading || !file || !fromLanguage || !toLanguage}
              >
                {Loading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </section>


          <section id="features" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Why Choose TranslateHub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <CheckCircle className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">High-Quality Translations</h3>
                <p className="text-gray-600">Our expert translators ensure accurate and culturally appropriate translations.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <Clock className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Turnaround</h3>
                <p className="text-gray-600">Get your translations quickly with our efficient process and dedicated team.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <DollarSign className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">Affordable rates without compromising on quality or speed.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">Basic</h3>
                <p className="text-4xl font-bold mb-6">$0.08<span className="text-base font-normal">/word</span></p>
                <ul className="mb-8">
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Standard quality translations</span>
                  </li>
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>3-5 day turnaround</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Email support</span>
                  </li>
                </ul>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                  Get Started
                </button>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-2 border-indigo-600">
                <h3 className="text-2xl font-semibold mb-4">Pro</h3>
                <p className="text-4xl font-bold mb-6">$0.12<span className="text-base font-normal">/word</span></p>
                <ul className="mb-8">
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>High-quality translations</span>
                  </li>
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>1-2 day turnaround</span>
                  </li>
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority email & chat support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Glossary management</span>
                  </li>
                </ul>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                  Get Started
                </button>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
                <p className="text-4xl font-bold mb-6">Custom</p>
                <ul className="mb-8">
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Premium quality translations</span>
                  </li>
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Custom turnaround times</span>
                  </li>
                  <li className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>API access & integrations</span>
                  </li>
                </ul>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>


        </main>

        
        <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold">TranslateHub</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400 transition duration-300">Terms</a>
              <a href="#" className="hover:text-indigo-400 transition duration-300">Privacy</a>
              <a href="#" className="hover:text-indigo-400 transition duration-300">Contact</a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            © 2024 TranslateHub. All rights reserved.
          </div>
        </div>
      </footer>
        
      </div>
    </>
  );
}
