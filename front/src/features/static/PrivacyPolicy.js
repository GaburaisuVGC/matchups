
import React, { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">
          <i className="fas fa-shield-alt text-accent-modern me-3"></i>
          Privacy Policy
        </h1>
        <p className="lead text-muted-modern">
          Your privacy and data protection information
        </p>
      </div>

      {/* Policy Content */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          {/* Data Storage Section */}
          <div className="content-card-modern mb-4">
            <div className="d-flex align-items-start mb-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <i className="fas fa-database"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-server me-2 text-accent-modern"></i>
                  Data Storage Policy
                </h3>
                <div className="alert alert-info d-flex align-items-start" role="alert">
                  <i className="fas fa-info-circle me-2 mt-1"></i>
                  <div>
                    <p className="mb-2">
                      <strong>No personal data collection:</strong> We do not store any user data in our database, 
                      only the entire content of documents submitted via the "Save" button.
                    </p>
                    <p className="mb-0">
                      If you include personal data or that of others within your document, 
                      it will be stored as part of the document content itself.
                    </p>
                  </div>
                </div>
                
                <div className="row g-3 mt-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h6 className="text-success mb-2">
                        <i className="fas fa-check-circle me-2"></i>
                        What we DON'T store
                      </h6>
                      <ul className="small mb-0">
                        <li>Personal information</li>
                        <li>User accounts or profiles</li>
                        <li>Browsing behavior</li>
                        <li>Locally stored documents</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h6 className="text-primary mb-2">
                        <i className="fas fa-eye me-2"></i>
                        What we DO store
                      </h6>
                      <ul className="small mb-0">
                        <li>Encrypted document content (when saved online)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Access Section */}
          <div className="content-card-modern mb-4">
            <div className="d-flex align-items-start mb-3">
              <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-key me-2 text-accent-modern"></i>
                  Administrator Access
                </h3>
                <div className="alert alert-warning d-flex align-items-start" role="alert">
                  <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
                  <div>
                    <p className="mb-2">
                      <strong>Transparency notice:</strong> The administrator (Gabu) has access to the database, 
                      which is necessary for the initialization and maintenance of the application.
                    </p>
                    <p className="mb-0">
                      We understand that this might be a concern, which is why we provide the option to store documents locally.
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mt-3 p-3 border rounded">
                  <i className="fas fa-lightbulb text-warning me-2"></i>
                  <div>
                    <strong>Alternative solution:</strong> Use local storage for sensitive documents. 
                    <a href="/how-to-use" className="text-decoration-none ms-1">
                      Learn how to save and share locally →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies Section */}
          <div className="content-card-modern mb-4">
            <div className="d-flex align-items-start mb-3">
              <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                <i className="fas fa-cookie-bite"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="h4 mb-3">
                  <i className="fas fa-cookie me-2 text-accent-modern"></i>
                  Cookie Usage
                </h3>
                <p className="mb-3">
                  We use cookies only for essential functionality to enhance your experience:
                </p>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="mb-2">
                        <i className="fas fa-moon me-2 text-primary"></i>
                        Theme Preference
                      </h6>
                      <p className="small mb-0">
                        Stores your dark/light mode preference for a consistent experience across visits.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <h6 className="mb-2">
                        <i className="fas fa-save me-2 text-success"></i>
                        Local Storage
                      </h6>
                      <p className="small mb-0">
                        Enables saving documents locally in your browser for offline access and privacy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="content-card-modern mt-4">
            <div className="text-center">
              <h4 className="mb-3">
                <i className="fas fa-envelope me-2 text-accent-modern"></i>
                Questions About Privacy?
              </h4>
              <p className="text-muted-modern mb-4">
                If you have any concerns about our privacy practices, feel free to reach out.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a 
                  href="https://github.com/GaburaisuVGC/matchups" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary-modern"
                >
                  <i className="fab fa-github me-2"></i>
                  GitHub Repository
                </a>
                <a 
                  href="/how-to-use" 
                  className="btn btn-primary-modern"
                >
                  <i className="fas fa-question-circle me-2"></i>
                  Learn More
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;