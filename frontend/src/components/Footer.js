import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-mono text-2xl font-bold uppercase tracking-wider mb-4">CE.PORTFOLIO</h3>
            <p className="text-[#999] leading-relaxed">
              Computer Engineering portfolio showcasing projects, certificates, and technical expertise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#666] mb-4 font-mono">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/" className="block text-[#999] hover:text-[#0066FF] transition-colors">Home</Link>
              <Link to="/projects" className="block text-[#999] hover:text-[#0066FF] transition-colors">Projects</Link>
              <Link to="/certificates" className="block text-[#999] hover:text-[#0066FF] transition-colors">Certificates</Link>
              <a href="#contact" className="block text-[#999] hover:text-[#0066FF] transition-colors">Contact</a>
            </nav>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#666] mb-4 font-mono">Connect</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 border-2 border-[#333] flex items-center justify-center hover:border-[#0066FF] hover:text-[#0066FF] transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="w-10 h-10 border-2 border-[#333] flex items-center justify-center hover:border-[#0066FF] hover:text-[#0066FF] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 border-2 border-[#333] flex items-center justify-center hover:border-[#0066FF] hover:text-[#0066FF] transition-colors">
                <Mail size={20} />
              </a>
            </div>
            <p className="text-[#999] text-sm">Open to collaboration and opportunities</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#666] text-sm font-mono">
            © {currentYear} Computer Engineer Portfolio. All rights reserved.
          </p>
          <p className="text-[#666] text-sm">
            Designed & Built with precision
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;