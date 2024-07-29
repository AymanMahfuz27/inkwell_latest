import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Book, FileText, Image } from 'lucide-react';
import api from '../services/api';
import WatercolorBackground from '../components/WatercolorBackground';
import '../css/UploadBookPage.css';
import Editor from '../components/Editor';  // Import the new QuillEditor component
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles


const UploadBookPage = () => {
  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [coverPicture, setCoverPicture] = useState(null);
  const [bannerPicture, setBannerPicture] = useState(null);
  const [uploadType, setUploadType] = useState('pdf');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const [richTextContent, setRichTextContent] = useState('');
  const [bookContent, setBookContent] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  const handleContentChange = (content) => {
    setBookContent(content);
  };

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
      formData.append('content', richTextContent); // Use rich text content instead of plain text
    }

    try {
      await api.post('/api/books/books/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setSuccessMessage('Book uploaded successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error uploading book:', error);
      setErrorMessage('Error uploading book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="inkwell-upload-page-container">
      <WatercolorBackground />
      <div className="inkwell-upload-page-content">
        <h1 className="inkwell-upload-page-title">Upload Your Book</h1>
        <form onSubmit={handleSubmit} className="inkwell-upload-page-form">
          <div className="inkwell-upload-page-input-group full-width">
            <label htmlFor="inkwell-upload-page-title-input" className="inkwell-upload-page-label">
              <Book size={20} />
              Title
            </label>
            <input
              id="inkwell-upload-page-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="inkwell-upload-page-input"
              placeholder="Enter your book title"
            />
          </div>
          <div className="inkwell-upload-page-input-group full-width">
            <label htmlFor="inkwell-upload-page-genres-input" className="inkwell-upload-page-label">
              <FileText size={20} />
              Genres (comma-separated)
            </label>
            <input
              id="inkwell-upload-page-genres-input"
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              required
              className="inkwell-upload-page-input"
              placeholder="e.g. Fantasy, Adventure, Romance"
            />
          </div>
          <div className="inkwell-upload-page-input-group full-width">
            <label htmlFor="inkwell-upload-page-description-input" className="inkwell-upload-page-label">
              <FileText size={20} />
              Description
            </label>
            <textarea
              id="inkwell-upload-page-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="inkwell-upload-page-textarea"
              placeholder="Describe your book"
            />
          </div>
          <div className="inkwell-upload-page-input-group full-width">
            <label className="inkwell-upload-page-label">
              <Upload size={20} />
              Upload Type
            </label>
            <div className="inkwell-upload-page-radio-group">
              <label className="inkwell-upload-page-radio-label">
                <input
                  type="radio"
                  value="pdf"
                  checked={uploadType === 'pdf'}
                  onChange={() => setUploadType('pdf')}
                  className="inkwell-upload-page-radio"
                />
                PDF
              </label>
              <label className="inkwell-upload-page-radio-label">
                <input
                  type="radio"
                  value="text"
                  checked={uploadType === 'text'}
                  onChange={() => setUploadType('text')}
                  className="inkwell-upload-page-radio"
                />
                Text
              </label>
            </div>
          </div>
          {uploadType === 'pdf' ? (
            <div className="inkwell-upload-page-input-group full-width">
              <label htmlFor="inkwell-upload-page-pdf-input" className="inkwell-upload-page-label">
                <Upload size={20} />
                PDF File
              </label>
              <input
                id="inkwell-upload-page-pdf-input"
                type="file"
                name="pdfFile"
                onChange={handleFileChange}
                accept=".pdf"
                required
                className="inkwell-upload-page-file-input"
              />
            </div>
          ) : (
            <div className="inkwell-upload-page-input-group full-width">
              <label htmlFor="inkwell-upload-page-text-input" className="inkwell-upload-page-label">
                <FileText size={20} />
                Book Content
              </label>
              {/* <ReactQuill
                value={richTextContent}
                onChange={setRichTextContent}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
                formats={[
                  'header',
                  'bold', 'italic', 'underline', 'strike',
                  'list', 'bullet',
                  'link', 'image'
                ]}
                className="inkwell-upload-page-rich-editor"
              /> */}
            <Editor            
              className="inkwell-upload-page-rich-editor"
              placeholder="Write your book content here..."
              onChange={handleContentChange}
            />

            </div>
          )}
          <div className="inkwell-upload-page-input-group">
            <label htmlFor="inkwell-upload-page-cover-input" className="inkwell-upload-page-label">
              <Image size={20} />
              Cover Picture
            </label>
            <input
              id="inkwell-upload-page-cover-input"
              type="file"
              name="coverPicture"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="inkwell-upload-page-file-input"
            />
          </div>
          <div className="inkwell-upload-page-input-group">
            <label htmlFor="inkwell-upload-page-banner-input" className="inkwell-upload-page-label">
              <Image size={20} />
              Banner Picture
            </label>
            <input
              id="inkwell-upload-page-banner-input"
              type="file"
              name="bannerPicture"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="inkwell-upload-page-file-input"
            />
          </div>
          {errorMessage && <p className="inkwell-upload-page-error">{errorMessage}</p>}
          {successMessage && <p className="inkwell-upload-page-success">{successMessage}</p>}
          <button type="submit" className="inkwell-upload-page-submit-button" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Book'}
          </button>
        </form>
      </div>
    </div>
  );
  

};

export default UploadBookPage;