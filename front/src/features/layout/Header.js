import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ isDarkMode, toggleDarkMode }) => {
    const navigate = useNavigate();
    const [isStoredData, setIsStoredData] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem("storedData");
        setIsStoredData(!!storedData);
    }, []);

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    const handleNav = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <>
            {/* Desktop Header */}
            <header className="header-modern d-none d-lg-block">
                <div className="container-modern">
                    <div className="d-flex justify-content-between align-items-center">
                        <div onClick={() => navigate("/")} className="logo-modern">
                            <span className="text-accent-modern">Matchups</span>.net
                        </div>
                        <div className="btn-group-modern">
                            <button
                                onClick={() => navigate("/stored")}
                                className="btn btn-secondary-modern"
                                disabled={!isStoredData}
                            >
                                <i className="fas fa-folder-open me-2"></i>
                                View Local Doc
                            </button>
                            <button
                                onClick={toggleDarkMode}
                                className="btn btn-secondary-modern"
                                aria-label={
                                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                                }
                            >
                                {isDarkMode ? (
                                    <i className="fas fa-sun"></i>
                                ) : (
                                    <i className="fas fa-moon"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className="header-mobile d-lg-none">
                <div className="container-modern h-100">
                    <div className="d-flex justify-content-between align-items-center h-100">
                        <button
                            onClick={toggleMenu}
                            className="mobile-header-btn"
                            aria-label="Open menu"
                        >
                            <i className="fas fa-bars"></i>
                        </button>

                        <div onClick={() => handleNav("/")} className="logo-mobile">
                            <span className="text-accent-modern">Matchups</span>.net
                        </div>

                        <button
                            onClick={toggleDarkMode}
                            className="mobile-header-btn"
                            aria-label={
                                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                            }
                        >
                            {isDarkMode ? (
                                <i className="fas fa-sun"></i>
                            ) : (
                                <i className="fas fa-moon"></i>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Burger Menu Dropdown */}
            {isMenuOpen && (
                <div className="burger-menu-dropdown d-lg-none">
                    <button onClick={() => handleNav("/")} className="burger-menu-item">
                        <i className="fas fa-home me-2"></i>Home
                    </button>
                    <button
                        onClick={() => handleNav("/stored")}
                        className="burger-menu-item"
                        disabled={!isStoredData}
                    >
                        <i className="fas fa-folder-open me-2"></i>View Local Doc
                    </button>
                    <button
                        onClick={() => handleNav("/how-to-use")}
                        className="burger-menu-item"
                    >
                        <i className="fas fa-question-circle me-2"></i>Guide
                    </button>
                </div>
            )}
        </>
    );
};

export default Header;
