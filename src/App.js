import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './screens/HomePage';
import AdminScreen from './screens/AdminScreen';
import UserProfileScreen from './screens/UserProfileScreen';

function App() {
  return (
<>
<Routes>
  <Route path='/' element={ <HomePage/> }/>
  <Route path="/admin" element={<AdminScreen/>} />
  <Route path="/user" element={<UserProfileScreen/>} />
</Routes>
</>
  );
}

export default App;
