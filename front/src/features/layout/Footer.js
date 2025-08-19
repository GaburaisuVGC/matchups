import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="container-modern">
                {/* Desktop Footer */}
                <div className="d-none d-md-block">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="mb-0">
                                <a
                                    href="https://matthieu-barbe.dev/"
                                    className="text-decoration-none me-3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fas fa-user me-1"></i>
                                    Project by Matthieu Barbe
                                </a>
                                <a href="/how-to-use" className="text-decoration-none me-3">
                                    <i className="fas fa-question-circle me-1"></i>
                                    How to use it?
                                </a>
                                <a href="/privacy-policy" className="text-decoration-none">
                                    <i className="fas fa-shield-alt me-1"></i>
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <p className="mb-0 text-muted-modern">
                                <a
                                    href="https://github.com/GaburaisuVGC/matchups"
                                    className="text-decoration-none"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i className="fab fa-github me-1"></i>
                                    v2.0.6
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Footer */}
                <div className="d-block d-md-none text-center">
                    <div className="mb-3">
                        <a
                            href="https://matthieu-barbe.dev/"
                            className="text-decoration-none d-block mb-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fas fa-user me-2"></i>
                            Project by Matthieu Barbe
                        </a>
                        <div className="d-flex justify-content-center gap-3">
                            <a href="/how-to-use" className="text-decoration-none">
                                <i className="fas fa-question-circle me-1"></i>
                                Guide
                            </a>
                            <a href="/privacy-policy" className="text-decoration-none">
                                <i className="fas fa-shield-alt me-1"></i>
                                Privacy
                            </a>
                            <a
                                href="https://github.com/GaburaisuVGC/matchups"
                                className="text-decoration-none"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fab fa-github me-1"></i>
                                v2.0.6
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
