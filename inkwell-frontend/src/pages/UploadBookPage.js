import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UploadBookPage = () => {
  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [coverPicture, setCoverPicture] = useState(null);
  const [bannerPicture, setBannerPicture] = useState(null);
  const [uploadType, setUploadType] = useState('pdf'); // 'pdf' or 'text'
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const UPLOAD_BOOK_URL = 'api/books/books/';

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    
    if (name === 'pdfFile' && file && file.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file');
      return;
    }
    
    if ((name === 'coverPicture' || name === 'bannerPicture') && file && !file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file');
      return;
    }

    if (name === 'pdfFile') setPdfFile(file);
    else if (name === 'coverPicture') setCoverPicture(file);
    else if (name === 'bannerPicture') setBannerPicture(file);
    
    setErrorMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    genres.split(',').forEach(genre => formData.append('genres', genre.trim()));
    formData.append('description', description);
    if (coverPicture) formData.append('cover_picture', coverPicture);
    if (bannerPicture) formData.append('banner_picture', bannerPicture);

    if (uploadType === 'pdf') {
      if (pdfFile) formData.append('pdf_file', pdfFile);
    } else {
      formData.append('content', textContent);
    }

    try {
      const response = await api.post(UPLOAD_BOOK_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Upload response:', response.data);
      setSuccessMessage('Book uploaded successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error uploading book:', error);
      if (error.response) {
        setErrorMessage(`Error uploading book: ${error.response.data.detail || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setErrorMessage('Error uploading book: No response from server');
      } else {
        setErrorMessage(`Error uploading book: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div>
      <h1>Upload a Book</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Genres (comma-separated):</label>
          <input type="text" value={genres} onChange={(e) => setGenres(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Upload Type:</label>
          <select value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
          </select>
        </div>
        {uploadType === 'pdf' ? (
          <div>
            <label>PDF File:</label>
            <input type="file" name="pdfFile" onChange={handleFileChange} accept=".pdf" required />
          </div>
        ) : (
          <div>
            <label>Book Content:</label>
            <textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} required />
          </div>
        )}
        <div>
          <label>Cover Picture:</label>
          <input type="file" name="coverPicture" onChange={handleFileChange} accept="image/*" required />
        </div>
        <div>
          <label>Banner Picture:</label>
          <input type="file" name="bannerPicture" onChange={handleFileChange} accept="image/*" required />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>
    </div>
  );
};

export default UploadBookPage;



// Next Steps
// Investigate and Ensure Proper Setting of uploaded_by Field:

// Confirm that the uploaded_by field is correctly set with the authenticated user during the book creation process in the serializer and view.
// Check and Resolve Foreign Key Constraints:

// Ensure that all foreign key constraints are correctly set and that the user_id in django_admin_log corresponds to valid entries in the UserProfile table.
// Investigate and fix any inconsistencies in the user data between the django_admin_log and UserProfile tables.
// Potential Debugging Steps
// Print and Log Statements:

// Add additional print and log statements to confirm the values being passed to and from the serializer and view.
// Log the authenticated user being used for the uploaded_by field.
// Database Integrity Checks:

// Verify the integrity of the user-related data in the database.
// Ensure that all foreign key references in the django_admin_log table are valid and correspond to existing users in the UserProfile table.
