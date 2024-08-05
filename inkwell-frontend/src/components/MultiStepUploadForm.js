// src/components/MultiStepUploadForm.js
import React, { useState, useEffect } from "react";
import {
  Book,
  FileText,
  Image,
  Upload,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import Editor from "./Editor";
import "../css/MultiStepUploadForm.css";

const MultiStepUploadForm = ({ navigate, initialData }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    genres: "",
    description: "",
    uploadType: "text",
    text_content: "",
  });

  const [files, setFiles] = useState({
    pdfFile: null,
    coverPicture: null,
    bannerPicture: null,
  });

  const [fileNames, setFileNames] = useState({
    pdfFile: "",
    coverPicture: "",
    bannerPicture: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  
  

    // Effect to initialize form data with initial data (if provided)
    useEffect(() => {
      if (initialData) {
        console.log("MultiStep form - Initial data received:", initialData);
        setFormData({
          title: initialData.title || "",
          genres: initialData.genres || "",
          description: initialData.description || "",
          uploadType: initialData.upload_type || "text",
          text_content: initialData.text_content || "",
        });
        setFileNames({
          pdfFile: initialData.pdf_file ? initialData.pdf_file.split("/").pop() : "",
          coverPicture: initialData.cover_picture ? initialData.cover_picture.split("/").pop() : "",
          bannerPicture: initialData.banner_picture ? initialData.banner_picture.split("/").pop() : "",
        });
      }
    }, [initialData]);
  
    const handleChange = (e) => {
      const { name, value, files: inputFiles } = e.target;
      if (inputFiles && inputFiles[0]) {
        console.log(`File selected for ${name}:`, inputFiles[0]);
        setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
        setFileNames(prev => ({ ...prev, [name]: inputFiles[0].name }));
        
        // Create a preview URL for the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, [`${name}_preview`]: reader.result }));
        };
        reader.readAsDataURL(inputFiles[0]);
      } else if (name === "uploadType") {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          text_content: value === "pdf" ? "" : prev.text_content,
        }));
        if (value === "pdf") {
          setFileNames(prev => ({ ...prev, pdfFile: "" }));
          setFiles(prev => ({ ...prev, pdfFile: null }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };
  
    const handleContentChange = (content) => {
      setFormData(prev => ({ ...prev, text_content: content }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(true);
    
      const draftData = new FormData();
    
      // Append text fields
      draftData.append("title", formData.title);  // Access the state formData, not the FormData object
      draftData.append("genres", formData.genres);
      draftData.append("description", formData.description);
      draftData.append("upload_type", formData.uploadType);
      draftData.append("text_content", formData.text_content);

    
      // Append file fields only if they exist
      if (files.pdfFile) draftData.append("pdf_file", files.pdfFile);
      if (files.coverPicture) draftData.append("cover_picture", files.coverPicture);
      if (files.bannerPicture) draftData.append("banner_picture", files.bannerPicture);
      console.log("Multistep upload form - Draft data:", Object.fromEntries(draftData));
      console.log("Multistep upload form - Initial data:", initialData);
      console.log("Multistep upload form - Initial data ID:", initialData.id);
    
      try {
        let response;
        if (initialData && initialData.id) {
          console.log("Multistep upload form - Updating existing draft:", initialData.id);
          response = await api.put(`/api/books/drafts/${initialData.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          setSuccessMessage('Draft updated successfully!');
        } else {
          console.log("Multistep upload form - Creating new draft because initialData looks like this:", initialData);
          response = await api.post('/api/books/drafts/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          setSuccessMessage('Draft saved successfully!');
        }
        console.log("API Response:", response.data);
        setTimeout(() => navigate('/profile'), 2000);
      } catch (error) {
        console.error('Error saving draft:', error.response?.data || error.message);
        setErrorMessage('Error saving draft. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    
  

  

  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    in: {
      opacity: 1,
      x: 0,
    },
    out: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
    }),
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const ProgressBar = () => {
    return (
      <div className="inkwell-upload-page-progress-bar">
        <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
        <div className={`divider ${step >= 2 ? "active" : ""}`}></div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
      </div>
    );
  };

  const renderStep = () => {
    return (
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
        >
          {step === 1 ? renderStep1() : renderStep2()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderStep1 = () => (
    <>
      <div className="inkwell-upload-page-input-group full-width">
        <label
          htmlFor="inkwell-upload-page-title-input"
          className="inkwell-upload-page-label"
        >
          <Book size={20} />
          Title
        </label>
        <input
          id="inkwell-upload-page-title-input"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="inkwell-upload-page-input"
          placeholder="Enter your book title"
        />
      </div>
      <div className="inkwell-upload-page-input-group full-width">
        <label
          htmlFor="inkwell-upload-page-genres-input"
          className="inkwell-upload-page-label"
        >
          <FileText size={20} />
          Genres (comma-separated)
        </label>
        <input
          id="inkwell-upload-page-genres-input"
          type="text"
          name="genres"
          value={formData.genres}
          onChange={handleChange}
          required
          className="inkwell-upload-page-input"
          placeholder="e.g. Fantasy, Adventure, Romance"
        />
      </div>
      <div className="inkwell-upload-page-input-group full-width">
        <label
          htmlFor="inkwell-upload-page-description-input"
          className="inkwell-upload-page-label"
        >
          <FileText size={20} />
          Description
        </label>
        <textarea
          id="inkwell-upload-page-description-input"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="inkwell-upload-page-textarea"
          placeholder="Describe your book"
        />
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="inkwell-upload-page-input-group full-width">
        <label className="inkwell-upload-page-label">
          <Upload size={20} />
          Upload Type
        </label>
        <div className="inkwell-upload-page-radio-group">
          <label className="inkwell-upload-page-radio-label">
            <input
              type="radio"
              name="uploadType"
              value="pdf"
              checked={formData.uploadType === "pdf"}
              onChange={handleChange}
              className="inkwell-upload-page-radio"
            />
            PDF
          </label>
          <label className="inkwell-upload-page-radio-label">
            <input
              type="radio"
              name="uploadType"
              value="text"
              checked={formData.uploadType === "text"}
              onChange={handleChange}
              className="inkwell-upload-page-radio"
            />
            Text
          </label>
        </div>
      </div>
      {formData.uploadType === "pdf" ? (
        <div className="inkwell-upload-page-input-group full-width">
          <label
            htmlFor="inkwell-upload-page-pdf-input"
            className="inkwell-upload-page-label"
          >
            <Upload size={20} />
            PDF File
          </label>
          <input
            id="inkwell-upload-page-pdf-input"
            type="file"
            name="pdfFile"
            onChange={handleChange}
            accept=".pdf"
            className="inkwell-upload-page-file-input"
          />
          {fileNames.pdfFile && <p>Current file: {fileNames.pdfFile}</p>}
        </div>
      ) : (
        <div className="inkwell-upload-page-input-group full-width">
          <label
            htmlFor="inkwell-upload-page-text-input"
            className="inkwell-upload-page-label"
          >
            <FileText size={20} />
            Book Content
          </label>
          <Editor
            html={formData.text_content}
            onChange={handleContentChange}
            placeholder="Write your book content here..."
          />
        </div>
      )}
      <div className="inkwell-upload-page-input-group">
  <label
    htmlFor="inkwell-upload-page-cover-input"
    className="inkwell-upload-page-label"
  >
    <Image size={20} />
    Cover Picture
  </label>
  <input
    id="inkwell-upload-page-cover-input"
    type="file"
    name="coverPicture"
    onChange={handleChange}
    accept="image/*"
    className="inkwell-upload-page-file-input"
  />
  {(fileNames.coverPicture || formData.cover_picture_preview) && (
    <div>
      <p>Current file: {fileNames.coverPicture}</p>
      <img src={formData.cover_picture_preview || formData.cover_picture} alt="Cover Preview" style={{maxWidth: '200px'}} />
    </div>
  )}
</div>
      <div className="inkwell-upload-page-input-group">
        <label
          htmlFor="inkwell-upload-page-banner-input"
          className="inkwell-upload-page-label"
        >
          <Image size={20} />
          Banner Picture
        </label>
        <input
          id="inkwell-upload-page-banner-input"
          type="file"
          name="bannerPicture"
          onChange={handleChange}
          accept="image/*"
          className="inkwell-upload-page-file-input"
        />
        {fileNames.bannerPicture && <p>Current file: {fileNames.bannerPicture}</p>}
      </div>
    </>
  );


  return (
    <form onSubmit={handleSubmit} className="inkwell-upload-page-form">
      <ProgressBar />
      {step === 1 ? renderStep1() : renderStep2()}
      {errorMessage && (
        <p className="inkwell-upload-page-error">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="inkwell-upload-page-success">{successMessage}</p>
      )}
      <div className="inkwell-upload-page-button-group">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inkwell-upload-page-nav-button"
          >
            <ChevronLeft size={20} /> Back
          </button>
        )}
        {step < 2 && (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="inkwell-upload-page-nav-button"
          >
            Next <ChevronRight size={20} />
          </button>
        )}
        {step === 2 && (
          <>
            <button
              type="submit"
              className="inkwell-upload-page-save-button"
              disabled={isLoading}
            >
              <Save size={20} /> {initialData?.id ? 'Update Draft' : 'Save Draft'}
            </button>
            <button
              type="submit"
              className="inkwell-upload-page-submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Book"}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default MultiStepUploadForm;
