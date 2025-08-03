import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const isPrivacyPolicyPage = location.pathname === '/privacy-policy';
    const isHowToUsePage = location.pathname === '/how-to-use';
    if (!consent && !isPrivacyPolicyPage && !isHowToUsePage) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [location]);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowPopup(false);
  };

  return (
    showPopup && (
      <div className="cookie-consent-overlay">
        <div className="cookie-consent-popup">
          <div className={`cookie-consent-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="cookie-consent-header">
              <i className="fas fa-cookie-bite text-accent me-2"></i>
              <h5 className="mb-0">Cookie Notice</h5>
            </div>
            <p className="cookie-consent-text">
              We use cookies to enhance your experience and enable local document storage. 
              By using our site, you agree to our cookie usage.
            </p>
            <div className="cookie-consent-actions">
              <button 
                onClick={acceptCookies} 
                className="btn btn-primary-modern"
              >
                <i className="fas fa-check me-2"></i>
                Accept Cookies
              </button>
              <a 
                href="/privacy-policy" 
                className="btn btn-secondary-modern"
              >
                <i className="fas fa-info-circle me-2"></i>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieConsent;