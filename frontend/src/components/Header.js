import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/certificates', label: 'Certificates' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b-2 border-[#E0E0E0] z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-mono text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
            CE.PORTFOLIO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-[#0066FF] border-b-2 border-[#0066FF] pb-1'
                    : 'text-[#1A1A1A] hover:text-[#0066FF]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="flex items-center gap-2 bg-[#0066FF] text-white px-6 py-2 uppercase text-sm tracking-wider font-semibold hover:bg-[#0052CC] transition-colors"
            >
              <User size={16} /> Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#1A1A1A] hover:text-[#0066FF] transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm uppercase tracking-wider font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-[#0066FF]'
                    : 'text-[#1A1A1A] hover:text-[#0066FF]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex items-center gap-2 bg-[#0066FF] text-white px-6 py-2 uppercase text-sm tracking-wider font-semibold hover:bg-[#0052CC] transition-colors"
            >
              <User size={16} /> Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;