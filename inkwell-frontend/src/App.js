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
import BookReader from './components/BookReader'; // Import the BookReader component
import AllBooksPage from './pages/AllBooksPage';  // Import the new component


// Define the App component
function App() {
  return (
    <div>
      <Navbar /> {/* Include Navbar on every page */}
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<SignUpSignInPage />} /> {/* Sign Up / Sign In page */}
        <Route path="/upload" element={<PrivateRoute><UploadBookPage /></PrivateRoute>} /> {/* Upload Book page, protected route */}
        <Route path="/profile/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> {/* Profile page, protected route*/}
        <Route path="/book/:bookId" element={<BookReader />} /> {/* Book Reader page */}
        <Route path="/about" element={<AboutPage />} /> {/* About page */}
        <Route path="/all-books" element={<AllBooksPage />} /> {/* All Books page */}
      </Routes>
      {/*<Footer />  Include Footer on every page */}
    </div>
  );

}

export default App;
