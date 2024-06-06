import React from 'react'; // Import the React library
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route for routing
import Navbar from './components/Navbar'; // Import the Navbar component
import Footer from './components/Footer'; // Import the Footer component
import HomePage from './pages/HomePage'; // Import the HomePage component
import SignUpSignInPage from './pages/SignUpSignInPage'; // Import the SignUpSignInPage component
import UploadBookPage from './pages/UploadBookPage'; // Import the UploadBookPage component
import ProfilePage from './pages/ProfilePage'; // Import the ProfilePage component
import AboutPage from './pages/AboutPage'; // Import the AboutPage component
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component for protected routes

// Define the App component
function App() {
  return (
    <div>
      <Navbar /> {/* Include the Navbar component on every page */}
      <Routes> {/* Define the routing structure */}
        <Route path="/" element={<HomePage />} /> {/* Define the route for the home page */}
        <Route path="/login" element={<SignUpSignInPage />} /> {/* Define the route for the login/signup page */}
        <Route path="/upload" element={<PrivateRoute><UploadBookPage /></PrivateRoute>} /> {/* Define the route for the upload book page, protected by PrivateRoute */}
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> {/* Define the route for the profile page, protected by PrivateRoute */}
        <Route path="/about" element={<AboutPage />} /> {/* Define the route for the about page */}
      </Routes>
      <Footer /> {/* Include the Footer component on every page */}
    </div>
  );
}

export default App; // Export the App component
