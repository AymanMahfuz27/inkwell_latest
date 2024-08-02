import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { login } from '../services/authService';
import ProgressBar from './ProgressBar';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2AccountDetails from './Step2AccountDetails';
import Step3OptionalInfo from './Step3OptionalInfo';
import '../css/MultiStepSignupForm.css';
import ParticleBackground from './ParticleBackground';

const MultiStepSignupForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    bio: '',
    profilePicture: null
  });
  const [error, setError] = useState('');
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');


  const nextStep = () => {
    setDirection(1);
    setStep(step + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handleChange = (input) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [input]: value });
    if (input === 'password') {
      validatePassword(value);
    }
  };


  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const ProgressBar = ({ step }) => {
    return (
      <div className="progress-bar">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="divider"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className="divider"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>
    );
  };
  const validatePassword = (password) => {
    if (password.length < 10) {
      setPasswordError('Password must be at least 10 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      return;
    }

    try {
      const submitData = new FormData();
      for (const key in formData) {
        if (key !== 'confirmPassword') {
          submitData.append(key, formData[key]);
        }
      }

      const response = await api.post("/api/users/register/", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      await login(formData.username, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.response && error.response.data.email) {
        setError("This email is already registered. Please use a different email.");
      } else {
        setError("Registration failed. Please check your information and try again.");
      }
    }
  };


  const pageVariants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100
    }),
    in: {
      opacity: 1,
      x: 0
    },
    out: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100
    })
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
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
          {(() => {
            switch(step) {
              case 1:
                return (
                  <Step1PersonalInfo
                    formData={formData}
                    handleChange={handleChange}
                    nextStep={nextStep}
                  />
                );
              case 2:
                return (
                  <Step2AccountDetails
                    formData={formData}
                    handleChange={handleChange}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                );
              case 3:
                return (
                  <Step3OptionalInfo
                    formData={formData}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    prevStep={prevStep}
                  />
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="multi-step-signup-container">
      <ParticleBackground />
      <ProgressBar step={step} />
      {renderStep()}
      {error && <p className="error-message">{error}</p>}
      {passwordError && <p className="error-message">{passwordError}</p>}
    </div>
  );
};



export default MultiStepSignupForm;