import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage'; 
import SignUpSignInPage from './pages/SignUpSignInPage'; 
import UploadBookPage from './pages/UploadBookPage'; 
import ProfilePage from './pages/ProfilePage'; 
import AboutPage from './pages/AboutPage'; 
import PrivateRoute from './components/PrivateRoute'; 
import BookReader from './components/BookReader'; 
import AllBooksPage from './pages/AllBooksPage';  
import SearchPage from './pages/SearchPage'; 
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import NotFoundPage from './pages/NotFoundPage';
import GenrePage from './pages/GenrePage';
import AllGenresPage from './pages/AllGenresPage';
import WatercolorBackground from './components/WatercolorBackground';



// Define the App component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <ScrollToTop />
      <WatercolorBackground />
      <Navbar /> 
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<SignUpSignInPage />} /> 
        <Route path="/upload" element={<PrivateRoute><UploadBookPage /></PrivateRoute>} /> 
        <Route path="/profile/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> 
        <Route path="/book/:bookId" element={<BookReader />} /> 
        <Route path="/about" element={<AboutPage />} /> 
        <Route path="/all-books" element={<AllBooksPage />} /> 
        <Route path="/search" element={<SearchPage />} />
        <Route path="/loading-page" element={<LoadingScreen />} />
        <Route path="/genres/:genreName" element={<GenrePage />} />
        <Route path="/genres" element={<AllGenresPage />} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
      <Footer />
    </div>
  );

}

export default App;
