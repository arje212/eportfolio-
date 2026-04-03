import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Loader } from 'lucide-react';
import { projectsAPI } from '../services/api';

const Projects = () => {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [filter, setFilter]       = useState('All');

  useEffect(() => {
    projectsAPI.getAll()
      .then(r => setProjects(r.data || []))
      .catch(() => setError('Failed to load projects. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.category === filter);

  if (loading) return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
      <Loader className="animate-spin text-[#0066FF]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono">PORTFOLIO</p>
          <h1 className="text-6xl lg:text-7xl font-bold text-[#1A1A1A] uppercase mb-6">All Projects</h1>
          <p className="text-xl text-[#666] max-w-3xl">
            Collection of SolidWorks designs, engineering projects, and technical developments
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 text-red-700 text-sm font-mono">
            {error}
          </div>
        )}

        {/* Filter buttons */}
        {projects.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 text-sm uppercase tracking-wider font-semibold transition-colors ${
                  filter === cat
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-white text-[#1A1A1A] border-2 border-[#E0E0E0] hover:border-[#0066FF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && !error && (
          <div className="text-center py-24 text-[#999]">
            <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold uppercase tracking-wider mb-2">No projects yet</p>
            <p className="text-sm">Login to the admin panel and add your projects.</p>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(project => (
            <Link
              key={project.id || project._id}
              to={`/projects/${project.id || project._id}`}
              className="bg-white border-2 border-[#E0E0E0] overflow-hidden hover:border-[#0066FF] transition-all hover:-translate-y-2 group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
                {project.image
                  ? <img src={project.image} alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  : <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                      <Briefcase size={40} />
                    </div>
                }
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="text-[#0066FF]" size={18} />
                  <span className="text-xs uppercase tracking-widest text-[#666] font-mono">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 uppercase">{project.title}</h3>
                <p className="text-[#666] text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                {project.software && (
                  <p className="text-xs text-[#999] font-mono mb-4">{project.software}</p>
                )}
                <div className="flex items-center gap-2 text-[#0066FF] text-sm font-semibold uppercase">
                  View Details <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;