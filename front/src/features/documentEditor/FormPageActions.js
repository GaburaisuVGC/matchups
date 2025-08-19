import React from 'react';

const FormPageActions = ({
    data,
    teamSubmitted,
    isLoading,
    handleTitleChange,
    handleSave,
    handleSaveStored,
    downloadJSON,
    handleFileUpload,
}) => {
    return (
        <div className="homepage-sticky-actions">
            {/* Document Title Section */}
            <div className="form-section-modern">
                <div className="form-group-modern">
                    <label className="form-label-modern">
                        <i className="fas fa-heading me-2"></i>
                        Document Title (Optional)
                    </label>
                    <input
                        type="text"
                        value={data.generalTitle}
                        onChange={handleTitleChange}
                        className="form-control form-control-modern"
                        placeholder="Enter a title for your document..."
                        maxLength={100}
                    />
                    <div className="text-muted-modern mt-2">
                        <small>{data.generalTitle.length}/100 characters</small>
                    </div>
                </div>
            </div>

            {/* Action Buttons Section */}
            <div className="form-section-modern">
                <div className="row g-2">
                    <div className="col-6 d-grid">
                        <button
                            onClick={handleSave}
                            className="btn btn-primary-modern"
                            disabled={!teamSubmitted || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cloud-upload-alt me-2"></i>
                                    <span>Save & Share</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="col-6 d-grid">
                        <button
                            onClick={handleSaveStored}
                            className="btn btn-secondary-modern"
                            disabled={!teamSubmitted}
                        >
                            <i className="fas fa-save me-2"></i>
                            <span>Save Locally</span>
                        </button>
                    </div>
                    <div className="col-6 d-grid">
                        <button
                            onClick={downloadJSON}
                            className="btn btn-secondary-modern"
                            disabled={!teamSubmitted}
                        >
                            <i className="fas fa-download me-2"></i>
                            <span>Download Draft</span>
                        </button>
                    </div>
                    <div className="col-6 d-grid">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="d-none"
                            id="file-upload"
                        />
                        <button
                            className="btn btn-secondary-modern"
                            onClick={() => document.getElementById("file-upload").click()}
                        >
                            <i className="fas fa-upload me-2"></i>
                            <span>Load Draft</span>
                        </button>
                    </div>
                </div>

                {/* Help Text */}
              <div className="mt-4 p-3 rounded border">
                <div className="row text-center">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-cloud-upload-alt text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Save & Share creates a public link
                    </p>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-save text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Save Locally stores in your browser
                    </p>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-download text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Download Draft saves as JSON file
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="help-icon-wrapper">
                      <i className="fas fa-upload text-accent-modern fa-2x"></i>
                    </div>
                    <p className="small text-muted-modern mb-0 help-text-small">
                      Load Draft opens a saved JSON file
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default FormPageActions;
