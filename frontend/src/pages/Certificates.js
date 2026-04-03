import React, { useState, useEffect } from 'react';
import { Award, Loader, ExternalLink } from 'lucide-react';
import { certificatesAPI } from '../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [lightbox, setLightbox]         = useState(null); // cert object or null

  useEffect(() => {
    certificatesAPI.getAll()
      .then(r => setCertificates(r.data || []))
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }, []);

  /* close lightbox on Escape */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO BAR ── */}
      <div className="bg-[#F8F8F8] border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-xs uppercase tracking-widest text-[#AAAAAA] mb-4 font-mono">Achievements</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-[#1A1A1A] uppercase leading-none tracking-tight mb-4">
                Certificates
              </h1>
              <p className="text-base text-[#666] max-w-2xl leading-relaxed">
                Professional certifications and completed training programs demonstrating
                continuous learning and skill development.
              </p>
            </div>
            {!loading && certificates.length > 0 && (
              <div className="flex items-center gap-3 bg-white border border-[#E0E0E0] px-5 py-3 shrink-0">
                <Award size={16} className="text-[#0066FF]" />
                <span className="text-xs uppercase tracking-widest font-mono text-[#555]">
                  {certificates.length} Certification{certificates.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#AAAAAA] font-mono">Loading certificates</p>
          </div>
        )}

        {/* Empty */}
        {!loading && certificates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-[#E0E0E0] flex items-center justify-center">
              <Award size={24} className="text-[#CCCCCC]" />
            </div>
            <p className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">No certificates yet</p>
            <p className="text-sm text-[#999]">Login to the admin panel to add your certificates.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && certificates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certificates.map((cert, idx) => (
              <div
                key={cert.id || cert._id}
                className="group border border-[#E8E8E8] hover:border-[#1A1A1A] transition-all overflow-hidden cursor-pointer"
                onClick={() => setLightbox(cert)}
              >
                {/* Image */}
                <div className="overflow-hidden bg-[#F0F0F0]" style={{ aspectRatio: '4/3' }}>
                  {cert.image
                    ? <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    : <div className="w-full h-full flex items-center justify-center">
                        <Award size={36} className="text-[#CCCCCC]" />
                      </div>
                  }
                </div>

                {/* Card body */}
                <div className="p-5 border-t border-[#F0F0F0]">
                  {/* index badge + title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-6 h-6 bg-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold font-mono">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] text-base leading-snug group-hover:text-[#0066FF] transition-colors">
                      {cert.title}
                    </h3>
                  </div>

                  {/* meta rows */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-2 border-t border-[#F0F0F0]">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Issuer</span>
                      <span className="text-xs font-semibold text-[#1A1A1A] text-right max-w-[60%]">{cert.issuer}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-[#F0F0F0]">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Date</span>
                      <span className="text-xs font-semibold text-[#1A1A1A]">{cert.date}</span>
                    </div>
                  </div>

                  {/* view hint */}
                  <div className="mt-4 flex items-center gap-1.5 text-[#0066FF] text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={11} /> View Certificate
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white max-w-3xl w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* lightbox image */}
            <div className="bg-[#F0F0F0]" style={{ aspectRatio: '4/3' }}>
              {lightbox.image
                ? <img src={lightbox.image} alt={lightbox.title} className="w-full h-full object-contain" />
                : <div className="w-full h-full flex items-center justify-center"><Award size={48} className="text-[#CCCCCC]" /></div>}
            </div>

            {/* lightbox info */}
            <div className="p-6 border-t border-[#EBEBEB]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#0066FF] text-white text-xs uppercase tracking-widest font-mono px-3 py-1 mb-3">
                    <Award size={10} /> Certificate
                  </div>
                  <h2 className="text-xl font-bold text-[#1A1A1A] uppercase leading-tight mb-2">{lightbox.title}</h2>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#AAAAAA] uppercase tracking-widest">
                    <span>{lightbox.issuer}</span>
                    <span className="w-1 h-1 bg-[#CCCCCC] rounded-full"></span>
                    <span>{lightbox.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  className="w-8 h-8 border border-[#E0E0E0] flex items-center justify-center text-[#999] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all shrink-0 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          {/* press Escape hint */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest font-mono text-white opacity-40">
            Press Esc to close
          </p>
        </div>
      )}
    </div>
  );
};

export default Certificates;