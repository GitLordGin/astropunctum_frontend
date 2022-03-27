import './App.css';
import React from "react";
import MainPage from './MainPage/MainPage';
import AdminPage from './AdminPage/AdminPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage/>} />
        <Route path='/AdminPage' element={<AdminPage/>} />
      </Routes>
    </>
  );
}

export default App;
