import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, Calendar, Wrench,
  ChevronRight, ChevronLeft, Loader, Users,
  Shield, ExternalLink, ArrowUpRight
} from 'lucide-react';
import { projectsAPI } from '../services/api';

/* ── progress dots ── */
const Dots = ({ total, current, goTo }) => (
  <div className="flex items-center justify-center gap-2 mt-4">
    {Array.from({ length: total }).map((_, i) => (
      <button key={i} onClick={() => goTo(i)}
        className={`rounded-full transition-all duration-300 ${
          i === current ? 'w-6 h-2 bg-[#1A1A1A]' : 'w-2 h-2 bg-[#CCCCCC] hover:bg-[#999]'
        }`}
      />
    ))}
  </div>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [current, setCurrent]   = useState(0);
  const [isAuto, setIsAuto]     = useState(true);
  const autoRef = useRef(null);

  useEffect(() => {
    projectsAPI.getAll()
      .then(r => {
        const all = r.data || [];
        const found = all.find(
          p => String(p.id) === String(id) || String(p._id) === String(id)
        );
        if (!found) { setNotFound(true); return; }
        setProject(found);
        setRelated(
          all.filter(p =>
            p.category === found.category &&
            String(p.id) !== String(found.id) &&
            String(p._id) !== String(found._id)
          ).slice(0, 3)
        );
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const allImages = useMemo(() => {
    if (!project) return [];
    const imgs = [];
    if (project.image) imgs.push(project.image);
    (project.galleryImages || project.images || []).forEach(g => {
      if (g && !imgs.includes(g)) imgs.push(g);
    });
    return imgs.slice(0, 4);
  }, [project]);

  useEffect(() => {
    if (!isAuto || allImages.length <= 1) return;
    autoRef.current = setInterval(() => setCurrent(c => (c + 1) % allImages.length), 5000);
    return () => clearInterval(autoRef.current);
  }, [isAuto, allImages.length]);

  const goTo = idx => { setIsAuto(false); clearInterval(autoRef.current); setCurrent(idx); };
  const prev = () => goTo((current - 1 + allImages.length) % allImages.length);
  const next = () => goTo((current + 1) % allImages.length);

  /* ── loading ── */
  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#999] font-mono">Loading project</p>
      </div>
    </div>
  );

  /* ── not found ── */
  if (notFound || !project) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[#999] font-mono mb-4">404</p>
        <h2 className="text-5xl font-bold text-[#1A1A1A] mb-6 uppercase">Not Found</h2>
        <Link to="/projects" className="text-sm uppercase tracking-widest font-semibold text-[#0066FF] hover:underline">
          ← Back to Projects
        </Link>
      </div>
    </div>
  );

  const specs    = Array.isArray(project.specs) ? project.specs.filter(Boolean) : [];
  const demoLink = project.demoLink || project.demoUrl || '';

  let userFeatures = [], adminFeatures = [], generalSpecs = [];
  let sec = 'general';
  specs.forEach(s => {
    const sl = s.toLowerCase().trim();
    if (sl === 'user features'  || sl.startsWith('user features'))  { sec = 'user';  return; }
    if (sl === 'admin features' || sl.startsWith('admin features')) { sec = 'admin'; return; }
    if (sec === 'user')          userFeatures.push(s);
    else if (sec === 'admin')    adminFeatures.push(s);
    else                         generalSpecs.push(s);
  });
  const hasSections = userFeatures.length > 0 || adminFeatures.length > 0;

  /* parse tech stack into chips */
  const techChips = project.software
    ? project.software.split(/[,/\n]/).map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white">

      {/* ── TOP HERO BAR ── */}
      <div className="bg-[#F8F8F8] border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-10">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#AAAAAA] hover:text-[#1A1A1A] mb-8 text-xs uppercase tracking-widest font-mono transition-colors group">
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-[#0066FF] text-white text-xs uppercase tracking-widest font-mono px-3 py-1.5 mb-5">
                <Briefcase size={10} /> {project.category}
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-[#1A1A1A] uppercase leading-none tracking-tight mb-4">
                {project.title}
              </h1>
              <p className="text-base text-[#666] max-w-2xl leading-relaxed">{project.description}</p>
            </div>

            {/* right meta */}
            <div className="flex flex-row lg:flex-col gap-3 flex-wrap lg:items-end shrink-0">
              {project.year && (
                <div className="inline-flex items-center gap-2 bg-white border border-[#E0E0E0] px-4 py-2.5">
                  <Calendar size={12} className="text-[#0066FF]" />
                  <span className="text-xs uppercase tracking-widest font-mono text-[#555]">{project.year}</span>
                </div>
              )}
              {demoLink && (
                <a href={demoLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#0066FF] transition-colors group">
                  Live Demo <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* LEFT — 3 cols */}
          <div className="lg:col-span-3 space-y-12">

            {/* ══ IMAGE SLIDER ══ */}
            {allImages.length > 0 && (
              <div>
                {/* Main frame — contain so full screenshot shows */}
                <div className="relative bg-[#F0F0F0] border border-[#E0E0E0] overflow-hidden"
                     style={{ aspectRatio: '16/10' }}>

                  {allImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
                      style={{ objectFit: 'contain', objectPosition: 'center' }}
                    />
                  ))}

                  {/* Prev/Next */}
                  {allImages.length > 1 && (
                    <>
                      <button onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#E0E0E0] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all z-10">
                        <ChevronLeft size={17} />
                      </button>
                      <button onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#E0E0E0] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all z-10">
                        <ChevronRight size={17} />
                      </button>
                    </>
                  )}

                  {/* Badge counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-[#1A1A1A] bg-opacity-80 text-white text-xs px-3 py-1 font-mono tracking-widest z-10">
                      {String(current + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
                    </div>
                  )}
                </div>

                {/* Dots nav */}
                {allImages.length > 1 && <Dots total={allImages.length} current={current} goTo={goTo} />}

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className={`grid gap-2 mt-4`}
                    style={{ gridTemplateColumns: `repeat(${allImages.length}, 1fr)` }}>
                    {allImages.map((img, idx) => (
                      <button key={idx} onClick={() => goTo(idx)}
                        className={`overflow-hidden border-2 transition-all ${
                          idx === current ? 'border-[#1A1A1A]' : 'border-[#E8E8E8] hover:border-[#AAAAAA]'
                        }`}
                        style={{ aspectRatio: '16/10' }}>
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full"
                          style={{ objectFit: 'contain', objectPosition: 'center', background: '#F0F0F0' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ OVERVIEW ══ */}
            <div>
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Overview</span>
                <div className="flex-1 h-px bg-[#EBEBEB]" />
              </div>
              <p className="text-[#555] text-base leading-loose">{project.description}</p>
            </div>

            {/* ══ USER FEATURES ══ */}
            {userFeatures.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 bg-[#0066FF] flex items-center justify-center shrink-0">
                    <Users size={13} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">User Features</span>
                  <div className="flex-1 h-px bg-[#EBEBEB]" />
                  <span className="text-xs font-mono text-[#AAAAAA]">{userFeatures.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {userFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border border-[#EBEBEB] hover:border-[#0066FF] hover:bg-[#F6FAFF] transition-all cursor-default group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-[7px] shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-[#444] text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ ADMIN FEATURES ══ */}
            {adminFeatures.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    <Shield size={13} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">Admin Features</span>
                  <div className="flex-1 h-px bg-[#EBEBEB]" />
                  <span className="text-xs font-mono text-[#AAAAAA]">{adminFeatures.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {adminFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border border-[#EBEBEB] hover:border-[#1A1A1A] hover:bg-[#FAFAFA] transition-all cursor-default group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] mt-[7px] shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-[#444] text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ GENERAL SPECS ══ */}
            {!hasSections && generalSpecs.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Specifications</span>
                  <div className="flex-1 h-px bg-[#EBEBEB]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {generalSpecs.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border border-[#EBEBEB] hover:border-[#0066FF] transition-all group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-[7px] shrink-0" />
                      <span className="text-[#444] text-sm leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR — 2 cols */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-3">

              {/* Demo */}
              {demoLink && (
                <a href={demoLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 bg-[#0066FF] text-white hover:bg-[#0052CC] transition-colors group">
                  <div>
                    <p className="text-xs uppercase tracking-widest font-mono opacity-70 mb-0.5">Live Demo</p>
                    <p className="text-sm font-semibold">View the live project</p>
                  </div>
                  <ExternalLink size={18} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              )}

              {/* Details table */}
              <div className="border border-[#E8E8E8]">
                <div className="px-5 py-3 bg-[#FAFAFA] border-b border-[#E8E8E8]">
                  <p className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Project Info</p>
                </div>
                <div className="divide-y divide-[#F2F2F2]">
                  <div className="flex justify-between items-center px-5 py-3">
                    <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Category</span>
                    <span className="text-xs font-semibold text-[#1A1A1A]">{project.category}</span>
                  </div>
                  {project.year && (
                    <div className="flex justify-between items-center px-5 py-3">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Year</span>
                      <span className="text-xs font-semibold text-[#1A1A1A]">{project.year}</span>
                    </div>
                  )}
                  {specs.length > 0 && (
                    <div className="flex justify-between items-center px-5 py-3">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Features</span>
                      <span className="text-xs font-bold text-[#0066FF]">{specs.length}</span>
                    </div>
                  )}
                  {allImages.length > 0 && (
                    <div className="flex justify-between items-center px-5 py-3">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Screenshots</span>
                      <span className="text-xs font-bold text-[#0066FF]">{allImages.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech stack chips */}
              {techChips.length > 0 && (
                <div className="border border-[#E8E8E8]">
                  <div className="px-5 py-3 bg-[#FAFAFA] border-b border-[#E8E8E8]">
                    <div className="flex items-center gap-2">
                      <Wrench size={11} className="text-[#0066FF]" />
                      <p className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Tech Stack</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 flex flex-wrap gap-1.5">
                    {techChips.map((tech, i) => (
                      <span key={i}
                        className="px-2.5 py-1.5 bg-[#F5F5F5] border border-[#E8E8E8] text-xs font-mono text-[#555] hover:bg-[#EEF4FF] hover:border-[#0066FF] hover:text-[#0066FF] transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back link */}
              <Link to="/projects"
                className="flex items-center justify-between px-5 py-3.5 border border-[#E8E8E8] hover:border-[#1A1A1A] transition-colors group">
                <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA] group-hover:text-[#1A1A1A] transition-colors">All Projects</span>
                <ChevronRight size={13} className="text-[#AAAAAA] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── RELATED PROJECTS ── */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#EBEBEB]">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA]">Related Projects</span>
              <div className="flex-1 h-px bg-[#EBEBEB]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(rel => (
                <Link key={rel.id || rel._id} to={`/projects/${rel.id || rel._id}`}
                  className="group border border-[#E8E8E8] hover:border-[#1A1A1A] transition-all overflow-hidden">
                  <div className="overflow-hidden bg-[#F0F0F0]" style={{ aspectRatio: '4/3' }}>
                    {rel.image
                      ? <img src={rel.image} alt={rel.title} className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                          style={{ objectFit: 'contain', background: '#F0F0F0' }} />
                      : <div className="w-full h-full flex items-center justify-center text-[#CCC]"><Briefcase size={28} /></div>}
                  </div>
                  <div className="p-5 border-t border-[#F0F0F0]">
                    <p className="text-xs uppercase tracking-widest font-mono text-[#AAAAAA] mb-1">{rel.category}</p>
                    <h3 className="text-sm font-bold text-[#1A1A1A] uppercase mb-3 group-hover:text-[#0066FF] transition-colors leading-snug">{rel.title}</h3>
                    <div className="flex items-center gap-1 text-[#0066FF] text-xs font-semibold uppercase tracking-widest">
                      View <ChevronRight size={11} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;