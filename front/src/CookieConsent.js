import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

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
      <div className="cookie-consent-popup">
        <div className="cookie-consent-content">
          <p style={{ color: 'black' }}>
            We use cookies to improve your experience and to make you be able to store your document locally. By using our site, you consent to cookies.
          </p>
          <div className="cookie-consent-actions">
            <button onClick={acceptCookies} className="btn btn-primary me-2">Accept</button>
            <a href="/privacy-policy" className="btn btn-link">Privacy Policy</a>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieConsent;
