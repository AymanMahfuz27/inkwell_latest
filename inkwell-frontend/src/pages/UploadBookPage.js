// UploadBookPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadBookPage = () => {
  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [coverPicture, setCoverPicture] = useState(null);
  const [bannerPicture, setBannerPicture] = useState(null);
  const [uploadType, setUploadType] = useState('pdf'); // 'pdf' or 'text'
  const navigate = useNavigate();
  const UPLOAD_BOOK_URL = 'http://localhost:8000/api/books/books/';

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'pdfFile') {
      setPdfFile(files[0]);
    } else if (name === 'coverPicture') {
      setCoverPicture(files[0]);
    } else if (name === 'bannerPicture') {
      setBannerPicture(files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    genres.split(',').forEach(genre => formData.append('genres', genre.trim())); // Append genres individually
    // const genresData = genres.split(',').map(genre => ({ name: genre.trim() }));
    // formData.append('genres', JSON.stringify(genresData));
    formData.append('description', description);
    formData.append('cover_picture', coverPicture);
    formData.append('banner_picture', bannerPicture);

    if (uploadType === 'pdf') {
      formData.append('pdf_file', pdfFile);
    } else {
      formData.append('content', textContent);
    }

    // Log formData entries
   
      try {
      const response = await axios.post(UPLOAD_BOOK_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      navigate('/');
    } catch (error) {
      console.error('Error uploading book:', error);
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
            <input type="file" name="pdfFile" onChange={handleFileChange} required />
          </div>
        ) : (
          <div>
            <label>Book Content:</label>
            <textarea value={textContent} onChange={(e) => setTextContent(e.target.value)} required />
          </div>
        )}
        <div>
          <label>Cover Picture:</label>
          <input type="file" name="coverPicture" onChange={handleFileChange} required />
        </div>
        <div>
          <label>Banner Picture:</label>
          <input type="file" name="bannerPicture" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload Book</button>
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
