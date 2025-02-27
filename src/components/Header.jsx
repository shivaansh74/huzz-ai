import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-rizz-cyan' : 'text-gray-300';
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-background border-b border-gray-800 py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Huzz<span className="text-rizz-cyan">AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link to="/" className={`${isActive('/')} hover:text-rizz-cyan transition-colors`}>
              Home
            </Link>
            <Link to="/text-rizz" className={`${isActive('/text-rizz')} hover:text-rizz-cyan transition-colors`}>
              Text Rizz
            </Link>
            <Link to="/image-rizz" className={`${isActive('/image-rizz')} hover:text-rizz-cyan transition-colors`}>
              Image Rizz
            </Link>
            <Link to="/pickup-lines" className={`${isActive('/pickup-lines')} hover:text-rizz-cyan transition-colors`}>
              Pickup Lines
            </Link>
            <Link to="/ai-chat" className={`${isActive('/ai-chat')} hover:text-rizz-cyan transition-colors`}>
              AI Chat
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col gap-4 animate-fadeIn">
            <Link
              to="/"
              className={`${isActive('/')} hover:text-rizz-cyan transition-colors py-2`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/text-rizz"
              className={`${isActive('/text-rizz')} hover:text-rizz-cyan transition-colors py-2`}
              onClick={() => setMenuOpen(false)}
            >
              Text Rizz
            </Link>
            <Link
              to="/image-rizz"
              className={`${isActive('/image-rizz')} hover:text-rizz-cyan transition-colors py-2`}
              onClick={() => setMenuOpen(false)}
            >
              Image Rizz
            </Link>
            <Link
              to="/pickup-lines"
              className={`${isActive('/pickup-lines')} hover:text-rizz-cyan transition-colors py-2`}
              onClick={() => setMenuOpen(false)}
            >
              Pickup Lines
            </Link>
            <Link
              to="/ai-chat"
              className={`${isActive('/ai-chat')} hover:text-rizz-cyan transition-colors py-2`}
              onClick={() => setMenuOpen(false)}
            >
              AI Chat
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
