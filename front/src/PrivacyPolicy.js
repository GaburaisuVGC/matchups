import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Privacy Policy</h1>
      <div className="list-group list-group-flush" style={{ borderRadius: "0.5rem", border: "1px solid #dee2e6" }}>
        <div className="list-group-item">
          <p>No user data is stored in our database, only the entire content of the document submitted via the "Save" button. <br />If you include personal data or that of others within the document, it will be stored as part of the document itself.</p>
        </div>
        <div className="list-group-item">
          <p>The admin, Gabu, has access to the database, which is necessary for the initialization and maintenance of the application. <br />We understand that this might be a concern, which is why we provide the option to store documents locally. (See <a href="/how-to-use">/how-to-use</a> for more information, including how to share a locally stored document with someone else.)</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
