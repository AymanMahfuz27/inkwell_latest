// src/components/MultiStepUploadForm.js
import React, { useState, useEffect, useCallback } from "react";
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
import useAuth from "../hooks/useAuth";

const MultiStepUploadForm = ({ navigate, initialData }) => {
  const [step, setStep] = useState(1);
  const { auth, username, firstName } = useAuth();

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

  const [fileUrls, setFileUrls] = useState({
    pdfFile: null,
    coverPicture: null,
    bannerPicture: null,
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  const [isUploadingBook, setIsUploadingBook] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      console.log("MultiStep form - Initial data received:", initialData);
      setFormData({
        title: initialData.title || "",
        genres: Array.isArray(initialData.genres)
          ? initialData.genres.join(", ")
          : initialData.genres || "",
        description: initialData.description || "",
        uploadType: initialData.upload_type || "text",
        text_content: initialData.text_content || "",
      });
      setFileUrls({
        pdfFile: initialData.pdf_file || null,
        coverPicture: initialData.cover_picture || null,
        bannerPicture: initialData.banner_picture || null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files: inputFiles } = e.target;
    if (inputFiles && inputFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: inputFiles[0] }));
      setFileUrls((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(inputFiles[0]),
      }));
    } else {
      if (name === "genres") {
        const cleanedValue = value
          .split(",")
          .map((g) => g.trim())
          .join(",");
        setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, text_content: content }));
  };

  const prepareFormData = () => {
    const bookData = new FormData();
    bookData.append("title", formData.title);

    // Send genres as a single comma-separated string
    const genresArray = formData.genres.split(",").map((genre) => genre.trim());
    genresArray.forEach((genre) => bookData.append("genres", genre));

    bookData.append("description", formData.description);
    bookData.append("upload_type", formData.uploadType);
    bookData.append("text_content", formData.text_content);

    if (files.pdfFile) bookData.append("pdf_file", files.pdfFile);
    if (files.coverPicture)
      bookData.append("cover_picture", files.coverPicture);
    if (files.bannerPicture)
      bookData.append("banner_picture", files.bannerPicture);

    console.log("Form data being sent:", Object.fromEntries(bookData));
    return bookData;
  };

  const handleSaveDraft = async () => {
    if (!validateStep1()) {
      setErrorMessage("Please fill out all required fields in Step 1.");
      return;
    }

    console.log("Saving as a draft");
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const bookData = prepareFormData();

    try {
      let response;
      if (initialData && initialData.id) {
        console.log("Updating existing draft. Draft ID:", initialData.id);
        response = await api.put(
          `/api/books/drafts/${initialData.id}/`,
          bookData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        console.log("Creating new draft");
        response = await api.post("/api/books/drafts/", bookData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      console.log("Draft save/update response:", response.data);
      setSuccessMessage(
        initialData?.id
          ? "Draft updated successfully!"
          : "Draft saved successfully!"
      );
      setTimeout(() => navigate(`/profile/${username}`), 2000);
    } catch (error) {
      console.error(
        "Error saving draft:",
        error.response?.data || error.message
      );
      setErrorMessage("Error saving draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadBook = async () => {
    if (!validateStep1() || !validateStep2()) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    console.log("Uploading as a final book");
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const bookData = prepareFormData();
    if (initialData && initialData.id) {
      console.log("Uploading from draft. Draft ID:", initialData.id);
      bookData.append("draft_id", initialData.id);
    }

    try {
      const response = await api.post("/api/books/books/", bookData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Book upload response:", response.data);
      setSuccessMessage("Book uploaded successfully!");
      setTimeout(() => navigate(`/profile/${username}`), 2000);
    } catch (error) {
      console.error(
        "Error uploading book:",
        error.response?.data || error.message
      );
      setErrorMessage("Error uploading book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const formTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
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
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.genres.trim())
      newErrors.genres = "At least one genre is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateStep2 = () => {
    const newErrors = {};
    if (formData.uploadType === "pdf" && !files.pdfFile) {
      newErrors.pdfFile = "PDF file is required";
    }
    if (formData.uploadType === "text" && !formData.text_content.trim()) {
      newErrors.text_content = "Book content is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNextClick = () => {
    if (validateStep1()) {
      setStep(2);
    }
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
          className={`inkwell-upload-page-input`}
          style={errors.title ? { borderColor: "red" } : {}}
          placeholder="Enter your book title"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
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
          style={errors.title ? { borderColor: "red" } : {}}
          placeholder="e.g. Fantasy, Adventure, Romance"
        />
        {errors.genres && <span className="error-message">{errors.genres}</span>}
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
          className={`inkwell-upload-page-input`}
          style={errors.title ? { borderColor: "red" } : {}}
          placeholder="Describe your book"
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
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
              className={`inkwell-upload-page-file-input ${
                errors.pdfFile ? "error" : ""
              }`}
            />
            {errors.pdfFile && (
              <span className="error-message">{errors.pdfFile}</span>
            )}
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
          {fileUrls.pdfFile && (
            <p>Current file: {fileUrls.pdfFile.split("/").pop()}</p>
          )}
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
        {fileUrls.coverPicture && (
          <>
            <h2 style={{ color: "white" }}>Current cover picture:</h2>
            <img
              src={fileUrls.coverPicture}
              alt="Cover Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          </>
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
        {fileUrls.bannerPicture && (
          <>
            <h2 style={{ color: "white" }}>Current banner picture:</h2>
            <img
              src={fileUrls.bannerPicture}
              alt="Banner Preview"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          </>
        )}
      </div>
    </>
  );

  return (
    <form className="inkwell-upload-page-form">
      <ProgressBar />
      <AnimatePresence initial={false}>
        {step === 1 ? renderStep1() : renderStep2()}
      </AnimatePresence>
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
            onClick={handleNextClick}
            className="inkwell-upload-page-nav-button"
          >
            Next <ChevronRight size={20} />
          </button>
        )}
        {step === 2 && (
          <>
            <button
              type="button"
              className="inkwell-upload-page-save-button"
              disabled={isLoading}
              onClick={handleSaveDraft}
            >
              <Save size={20} />{" "}
              {initialData?.id ? "Update Draft" : "Save Draft"}
            </button>
            <button
              type="button"
              className="inkwell-upload-page-submit-button"
              disabled={isLoading}
              onClick={handleUploadBook}
            >
              {isLoading ? "Uploading..." : "Upload Book"}
            </button>
          </>
        )}
      </div>
      {errorMessage && (
        <p className="inkwell-upload-page-error">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="inkwell-upload-page-success">{successMessage}</p>
      )}
    </form>
  );
};

export default MultiStepUploadForm;
