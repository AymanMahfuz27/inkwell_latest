// src/pages/UploadBookPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WatercolorBackground from '../components/WatercolorBackground';
import MultiStepUploadForm from '../components/MultiStepUploadForm';
import api from '../services/api';
import '../css/UploadBookPage.css';

const UploadBookPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [draftData, setDraftData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraftData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const draftId = searchParams.get('draftId');
      console.log('Upload book page - draftId:', draftId);
      
      if (draftId) {
        try {
          const response = await api.get(`/api/books/drafts/${draftId}/`);
          setDraftData(response.data);
          console.log('Upload book page - draftData:', response.data);

        } catch (err) {
          console.error('Error fetching draft:', err);
          setError('Failed to load draft. Please try again.');
        }
      }
      setIsLoading(false);
    };

    fetchDraftData();
    console.log('Upload book page - draftData:', draftData);

  }, [location]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="inkwell-upload-page-container">
      <WatercolorBackground />
      <div className="inkwell-upload-page-content">
        <h1 className="inkwell-upload-page-title">
          {draftData ? 'Edit Your Book' : 'Upload Your Book'}
        </h1>
        <MultiStepUploadForm navigate={navigate} initialData={draftData} />
        </div>
    </div>
  );
};

export default UploadBookPage;