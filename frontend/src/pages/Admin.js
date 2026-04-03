import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Upload, Trash2, Plus, Loader, CheckCircle, XCircle, RefreshCw, X } from 'lucide-react';
import {
  profileAPI, skillsAPI, educationAPI,
  certificatesAPI, projectsAPI, uploadAPI, seedAPI
} from '../services/api';

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle : XCircle;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 ${bg} text-white px-5 py-3 shadow-lg`}>
      <Icon size={18} /> <span className="text-sm font-semibold">{msg}</span>
    </div>
  );
};

const Spin = () => (
  <div className="flex items-center justify-center py-16">
    <Loader className="animate-spin text-[#0066FF]" size={32} />
  </div>
);

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const [seeding, setSeeding] = useState(false);
  const handleSeed = async () => {
    if (!window.confirm('Seed database with sample data?')) return;
    setSeeding(true);
    try {
      await seedAPI.seed();
      showToast('Database seeded successfully!');
    } catch { showToast('Seed failed', 'error'); }
    finally { setSeeding(false); }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-20 px-6">
      <Toast msg={toast.msg} type={toast.type} />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-2 border-[#E0E0E0] p-6 mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] uppercase mb-1">Admin Panel</h1>
            <p className="text-[#666] text-sm">Manage your portfolio content</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-2 border-2 border-[#0066FF] text-[#0066FF] px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:bg-[#0066FF] hover:text-white transition-colors disabled:opacity-50">
              {seeding ? <Loader size={15} className="animate-spin" /> : <RefreshCw size={15} />} Seed DB
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <div className="bg-white border-2 border-[#E0E0E0] mb-8">
          <div className="flex flex-wrap gap-2 p-2">
            {['profile', 'skills', 'education', 'certificates', 'projects'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 uppercase text-xs tracking-wider font-semibold transition-colors ${
                  activeTab === tab ? 'bg-[#0066FF] text-white' : 'bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#E0E0E0]'
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-[#E0E0E0] p-8">
          {activeTab === 'profile'      && <ProfileTab      showToast={showToast} />}
          {activeTab === 'skills'       && <SkillsTab       showToast={showToast} />}
          {activeTab === 'education'    && <EducationTab    showToast={showToast} />}
          {activeTab === 'certificates' && <CertificatesTab showToast={showToast} />}
          {activeTab === 'projects'     && <ProjectsTab     showToast={showToast} />}
        </div>
      </div>
    </div>
  );
};

/* ── PROFILE ── */
const ProfileTab = ({ showToast }) => {
  const [form, setForm]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    profileAPI.get()
      .then(r => setForm(r.data))
      .catch(() => showToast('Failed to load profile', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try { await profileAPI.update(form); showToast('Profile saved!'); }
    catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const r = await uploadAPI.uploadImage(file);
      set('profileImage', `${process.env.REACT_APP_BACKEND_URL}${r.url}`);
      showToast('Image uploaded!');
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  if (loading) return <Spin />;

  return (
    <div className="space-y-6">
      <SectionHeader title="Profile Information" onSave={handleSave} saving={saving} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name"  value={form.name}  onChange={v => set('name', v)} />
        <Field label="Title" value={form.title} onChange={v => set('title', v)} />
      </div>
      <Field label="Tagline" value={form.tagline} onChange={v => set('tagline', v)} />
      <Field label="Bio" value={form.bio} onChange={v => set('bio', v)} textarea rows={4} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Field label="Email"    value={form.email}    onChange={v => set('email', v)} type="email" />
        <Field label="Phone"    value={form.phone}    onChange={v => set('phone', v)} type="tel" />
        <Field label="Location" value={form.location} onChange={v => set('location', v)} />
      </div>
      <Field label="Resume URL" value={form.resumeUrl || ''} onChange={v => set('resumeUrl', v)} />
      <div>
        <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Profile Image</label>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-28 h-28 border-2 border-[#E0E0E0] overflow-hidden bg-[#F5F5F5]">
            {form.profileImage
              ? <img src={form.profileImage} alt="Profile" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-[#999] text-xs">No image</div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button onClick={() => fileRef.current.click()} disabled={uploading}
            className="flex items-center gap-2 bg-[#F5F5F5] border-2 border-[#E0E0E0] text-[#1A1A1A] px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:border-[#0066FF] transition-colors disabled:opacity-50">
            {uploading ? <Loader size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── SKILLS ── */
const SkillsTab = ({ showToast }) => {
  const [skills, setSkills]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(null);

  useEffect(() => {
    skillsAPI.getAll().then(r => setSkills(r.data))
      .catch(() => showToast('Failed to load skills', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const updateLocal = (id, patch) => setSkills(s => s.map(x => x.id === id ? { ...x, ...patch } : x));
  const updateItem  = (catId, idx, val) => setSkills(s => s.map(x => {
    if (x.id !== catId) return x;
    const items = [...x.items]; items[idx] = val; return { ...x, items };
  }));
  const addItem    = (catId) => setSkills(s => s.map(x => x.id === catId ? { ...x, items: [...x.items, ''] } : x));
  const removeItem = (catId, idx) => setSkills(s => s.map(x => {
    if (x.id !== catId) return x;
    return { ...x, items: x.items.filter((_, i) => i !== idx) };
  }));

  const saveCategory = async (cat) => {
    setSaving(cat.id);
    try { await skillsAPI.update(cat.id, { category: cat.category, items: cat.items, order: cat.order }); showToast(`"${cat.category}" saved!`); }
    catch { showToast('Save failed', 'error'); }
    finally { setSaving(null); }
  };

  const deleteCategory = async (cat) => {
    if (!window.confirm(`Delete "${cat.category}"?`)) return;
    try { await skillsAPI.delete(cat.id); setSkills(s => s.filter(x => x.id !== cat.id)); showToast('Deleted'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const addCategory = async () => {
    const name = window.prompt('Category name:'); if (!name) return;
    try { const r = await skillsAPI.create({ category: name, items: [], order: skills.length + 1 }); setSkills(s => [...s, r.data]); showToast('Added!'); }
    catch { showToast('Add failed', 'error'); }
  };

  if (loading) return <Spin />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SectionTitle title="Skills Management" />
        <button onClick={addCategory} className="flex items-center gap-2 bg-[#0066FF] text-white px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:bg-[#0052CC] transition-colors">
          <Plus size={15} /> Add Category
        </button>
      </div>
      {skills.length === 0 && <EmptyState label="No skills yet. Use 'Seed DB' or 'Add Category'." />}
      {skills.map(cat => (
        <div key={cat.id} className="border-2 border-[#E0E0E0] p-6">
          <div className="flex justify-between items-start mb-4 gap-3 flex-wrap">
            <input value={cat.category} onChange={e => updateLocal(cat.id, { category: e.target.value })}
              className="text-lg font-bold text-[#1A1A1A] uppercase border-2 border-transparent hover:border-[#E0E0E0] focus:border-[#0066FF] px-2 py-1 focus:outline-none transition-colors flex-1 min-w-0" />
            <div className="flex gap-2">
              <SaveBtn onClick={() => saveCategory(cat)} loading={saving === cat.id} />
              <button onClick={() => deleteCategory(cat)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
            </div>
          </div>
          <div className="space-y-2">
            {cat.items.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={skill} onChange={e => updateItem(cat.id, idx, e.target.value)}
                  className="flex-1 border-2 border-[#E0E0E0] px-4 py-2 focus:border-[#0066FF] focus:outline-none transition-colors text-sm" />
                <button onClick={() => removeItem(cat.id, idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={() => addItem(cat.id)} className="text-[#0066FF] text-xs font-semibold uppercase mt-2 hover:underline">+ Add Skill</button>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── EDUCATION ── */
const EducationTab = ({ showToast }) => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(null);

  useEffect(() => {
    educationAPI.getAll().then(r => setItems(r.data))
      .catch(() => showToast('Failed to load education', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const update = (id, patch) => setItems(s => s.map(x => x.id === id ? { ...x, ...patch } : x));

  const save = async (edu) => {
    setSaving(edu.id);
    try { await educationAPI.update(edu.id, { degree: edu.degree, institution: edu.institution, year: edu.year, description: edu.description, order: edu.order }); showToast('Saved!'); }
    catch { showToast('Save failed', 'error'); }
    finally { setSaving(null); }
  };

  const del = async (edu) => {
    if (!window.confirm(`Delete "${edu.degree}"?`)) return;
    try { await educationAPI.delete(edu.id); setItems(s => s.filter(x => x.id !== edu.id)); showToast('Deleted!'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const add = async () => {
    try { const r = await educationAPI.create({ degree: 'New Degree', institution: 'Institution', year: '2024', description: '', order: items.length + 1 }); setItems(s => [...s, r.data]); showToast('Added!'); }
    catch { showToast('Add failed', 'error'); }
  };

  if (loading) return <Spin />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SectionTitle title="Education & Studies" />
        <button onClick={add} className="flex items-center gap-2 bg-[#0066FF] text-white px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:bg-[#0052CC] transition-colors">
          <Plus size={15} /> Add Education
        </button>
      </div>
      {items.length === 0 && <EmptyState label="No education entries yet." />}
      {items.map(edu => (
        <div key={edu.id} className="border-2 border-[#E0E0E0] p-6">
          <div className="flex justify-end gap-2 mb-4">
            <SaveBtn onClick={() => save(edu)} loading={saving === edu.id} />
            <button onClick={() => del(edu)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
          </div>
          <div className="space-y-4">
            <Field label="Degree" value={edu.degree} onChange={v => update(edu.id, { degree: v })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Institution" value={edu.institution} onChange={v => update(edu.id, { institution: v })} />
              <Field label="Year" value={edu.year} onChange={v => update(edu.id, { year: v })} />
            </div>
            <Field label="Description" value={edu.description} onChange={v => update(edu.id, { description: v })} textarea rows={3} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── CERTIFICATES ── */
const CertificatesTab = ({ showToast }) => {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null);
  const [uploading, setUploading] = useState(null);
  const fileRefs = useRef({});

  useEffect(() => {
    certificatesAPI.getAll().then(r => setItems(r.data))
      .catch(() => showToast('Failed to load certificates', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const update = (id, patch) => setItems(s => s.map(x => x.id === id ? { ...x, ...patch } : x));

  const save = async (cert) => {
    setSaving(cert.id);
    try { await certificatesAPI.update(cert.id, { title: cert.title, issuer: cert.issuer, date: cert.date, image: cert.image, order: cert.order }); showToast('Saved!'); }
    catch { showToast('Save failed', 'error'); }
    finally { setSaving(null); }
  };

  const del = async (cert) => {
    if (!window.confirm(`Delete "${cert.title}"?`)) return;
    try { await certificatesAPI.delete(cert.id); setItems(s => s.filter(x => x.id !== cert.id)); showToast('Deleted!'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const add = async () => {
    try { const r = await certificatesAPI.create({ title: 'New Certificate', issuer: 'Issuer', date: '2024', image: '', order: items.length + 1 }); setItems(s => [...s, r.data]); showToast('Added!'); }
    catch { showToast('Add failed', 'error'); }
  };

  const handleImgUpload = async (cert, e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(cert.id);
    try { const r = await uploadAPI.uploadImage(file); update(cert.id, { image: `${process.env.REACT_APP_BACKEND_URL}${r.url}` }); showToast('Uploaded!'); }
    catch { showToast('Upload failed', 'error'); }
    finally { setUploading(null); }
  };

  if (loading) return <Spin />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SectionTitle title="Certificates" />
        <button onClick={add} className="flex items-center gap-2 bg-[#0066FF] text-white px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:bg-[#0052CC] transition-colors">
          <Plus size={15} /> Add Certificate
        </button>
      </div>
      {items.length === 0 && <EmptyState label="No certificates yet." />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(cert => (
          <div key={cert.id} className="border-2 border-[#E0E0E0] overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-[#F5F5F5] relative group cursor-pointer" onClick={() => fileRefs.current[cert.id]?.click()}>
              {cert.image ? <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[#999] text-xs">No image</div>}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading === cert.id ? <Loader className="text-white animate-spin" size={28} /> : <Upload className="text-white" size={28} />}
              </div>
              <input ref={el => fileRefs.current[cert.id] = el} type="file" accept="image/*" className="hidden" onChange={e => handleImgUpload(cert, e)} />
            </div>
            <div className="p-4 space-y-2">
              <input value={cert.title} onChange={e => update(cert.id, { title: e.target.value })} className="w-full font-bold text-[#1A1A1A] border-2 border-transparent hover:border-[#E0E0E0] focus:border-[#0066FF] px-2 py-1 focus:outline-none transition-colors text-sm" />
              <input value={cert.issuer} onChange={e => update(cert.id, { issuer: e.target.value })} className="w-full text-sm text-[#666] border-2 border-transparent hover:border-[#E0E0E0] focus:border-[#0066FF] px-2 py-1 focus:outline-none transition-colors" />
              <input value={cert.date} onChange={e => update(cert.id, { date: e.target.value })} className="w-full text-sm text-[#999] border-2 border-transparent hover:border-[#E0E0E0] focus:border-[#0066FF] px-2 py-1 focus:outline-none transition-colors" />
              <div className="flex gap-2 pt-1">
                <SaveBtn onClick={() => save(cert)} loading={saving === cert.id} full />
                <button onClick={() => del(cert)} className="flex-1 text-red-600 text-xs font-semibold uppercase py-2 border-2 border-red-600 hover:bg-red-50 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── PROJECTS ── */
const ProjectsTab = ({ showToast }) => {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null);
  const [uploading, setUploading] = useState(null);
  const mainImgRefs = useRef({});
  const galleryRefs = useRef({});

  useEffect(() => {
    projectsAPI.getAll()
      .then(r => setItems(r.data.map(p => ({
        ...p,
        galleryImages: p.galleryImages || p.images || [],
        demoLink: p.demoLink || p.demoUrl || ''
      }))))
      .catch(() => showToast('Failed to load projects', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const update = (id, patch) => setItems(s => s.map(x => x.id === id ? { ...x, ...patch } : x));

  const save = async (proj) => {
    setSaving(proj.id);
    try {
      await projectsAPI.update(proj.id, {
        title: proj.title, category: proj.category,
        description: proj.description, software: proj.software || '',
        year: proj.year || '', image: proj.image || '',
        galleryImages: proj.galleryImages || [],
        demoLink: proj.demoLink || '',
        specs: (proj.specs || []).filter(s => s.trim()),
        order: proj.order || 0
      });
      showToast('Project saved!');
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(null); }
  };

  const del = async (proj) => {
    if (!window.confirm(`Delete "${proj.title}"?`)) return;
    try { await projectsAPI.delete(proj.id); setItems(s => s.filter(x => x.id !== proj.id)); showToast('Deleted!'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const add = async () => {
    try {
      const r = await projectsAPI.create({
        title: 'New Project', category: 'General', description: '',
        software: '', year: new Date().getFullYear().toString(),
        image: '', galleryImages: [], demoLink: '', specs: [], order: items.length + 1
      });
      setItems(s => [...s, { ...r.data, galleryImages: [], demoLink: '' }]);
      showToast('Project added!');
    } catch { showToast('Add failed', 'error'); }
  };

  const handleMainImg = async (proj, e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(`main-${proj.id}`);
    try { const r = await uploadAPI.uploadImage(file); update(proj.id, { image: `${process.env.REACT_APP_BACKEND_URL}${r.url}` }); showToast('Main image uploaded!'); }
    catch { showToast('Upload failed', 'error'); }
    finally { setUploading(null); }
  };

  const handleGalleryImg = async (proj, e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    const gallery = proj.galleryImages || [];
    const slots = 3 - gallery.length;
    if (slots <= 0) { showToast('Max 3 gallery images', 'error'); return; }
    setUploading(`gallery-${proj.id}`);
    try {
      const results = await Promise.all(files.slice(0, slots).map(f => uploadAPI.uploadImage(f)));
      const urls = results.map(r => `${process.env.REACT_APP_BACKEND_URL}${r.url}`);
      update(proj.id, { galleryImages: [...gallery, ...urls] });
      showToast(`${urls.length} image(s) uploaded!`);
    } catch { showToast('Upload failed', 'error'); }
    finally { setUploading(null); }
  };

  const removeGalleryImg = (proj, idx) => {
    update(proj.id, { galleryImages: (proj.galleryImages || []).filter((_, i) => i !== idx) });
  };

  if (loading) return <Spin />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <SectionTitle title="Projects Management" />
        <button onClick={add} className="flex items-center gap-2 bg-[#0066FF] text-white px-5 py-2.5 uppercase text-xs tracking-wider font-semibold hover:bg-[#0052CC] transition-colors">
          <Plus size={15} /> Add Project
        </button>
      </div>
      {items.length === 0 && <EmptyState label="No projects yet. Click 'Add Project'." />}

      {items.map(proj => {
        const gallery = proj.galleryImages || [];
        const canAdd  = gallery.length < 3;
        return (
          <div key={proj.id} className="border-2 border-[#E0E0E0] p-6">
            <div className="flex justify-end gap-2 mb-4">
              <SaveBtn onClick={() => save(proj)} loading={saving === proj.id} />
              <button onClick={() => del(proj)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
            </div>

            <div className="space-y-5">
              {/* Basic fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title"    value={proj.title}    onChange={v => update(proj.id, { title: v })} />
                <Field label="Category" value={proj.category} onChange={v => update(proj.id, { category: v })} />
              </div>
              <Field label="Description" value={proj.description} onChange={v => update(proj.id, { description: v })} textarea rows={3} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Software / Tech" value={proj.software || ''} onChange={v => update(proj.id, { software: v })} />
                <Field label="Year"            value={proj.year || ''}     onChange={v => update(proj.id, { year: v })} />
              </div>
              <Field label="Demo / Live Website URL" value={proj.demoLink || ''} onChange={v => update(proj.id, { demoLink: v })} placeholder="https://example.com" />

              {/* Main image */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Main Image</label>
                <div className="w-48 aspect-[4/3] overflow-hidden bg-[#F5F5F5] relative group cursor-pointer border-2 border-[#E0E0E0]"
                  onClick={() => mainImgRefs.current[proj.id]?.click()}>
                  {proj.image
                    ? <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex flex-col items-center justify-center text-[#999] text-xs gap-1"><Upload size={20} /><span>Click to upload</span></div>}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading === `main-${proj.id}` ? <Loader className="text-white animate-spin" size={24} /> : <Upload className="text-white" size={24} />}
                  </div>
                  <input ref={el => mainImgRefs.current[proj.id] = el} type="file" accept="image/*" className="hidden" onChange={e => handleMainImg(proj, e)} />
                </div>
              </div>

              {/* Gallery images */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">
                  Gallery Images (Max 3) — <span className="normal-case text-[#999]">Slide show on detail page</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="aspect-[4/3] relative border-2 border-[#E0E0E0] overflow-hidden group bg-[#F5F5F5]">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button onClick={() => removeGalleryImg(proj, idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={13} />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5">{idx + 1}</div>
                    </div>
                  ))}
                  {canAdd && (
                    <div className="aspect-[4/3] border-2 border-dashed border-[#E0E0E0] bg-[#F9F9F9] cursor-pointer hover:border-[#0066FF] transition-colors flex flex-col items-center justify-center text-[#999] gap-1"
                      onClick={() => galleryRefs.current[proj.id]?.click()}>
                      {uploading === `gallery-${proj.id}`
                        ? <Loader className="text-[#0066FF] animate-spin" size={22} />
                        : <><Plus size={22} className="hover:text-[#0066FF]" /><span className="text-xs">Add ({3 - gallery.length} left)</span></>}
                    </div>
                  )}
                </div>
                <input ref={el => galleryRefs.current[proj.id] = el} type="file" accept="image/*" multiple className="hidden" onChange={e => handleGalleryImg(proj, e)} />
                <p className="text-xs text-[#999] mt-1">Main image + gallery images = sliding gallery on the detail page (max 4 total)</p>
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">
                  Features / Specs <span className="normal-case text-[#999]">(one per line)</span>
                </label>
                <textarea rows={8} value={(proj.specs || []).join('\n')}
                  onChange={e => update(proj.id, { specs: e.target.value.split('\n') })}
                  placeholder={"User Features\nReal-time booking calendar\nInstant reservation with conflict detection\n\nAdmin Features\nAdmin dashboard with stats\nApprove or reject bookings"}
                  className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors resize-none text-sm font-mono" />
                <div className="text-xs text-[#999] mt-1 space-y-0.5">
                  <p>• Each line = one feature bullet point</p>
                  <p>• Write "User Features" on its own line to create a User Features section</p>
                  <p>• Write "Admin Features" on its own line to create an Admin Features section</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── SHARED ── */
const Field = ({ label, value, onChange, type = 'text', textarea = false, rows = 3, placeholder = '' }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">{label}</label>
    {textarea
      ? <textarea rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors resize-none text-sm" />
      : <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors text-sm" />}
  </div>
);
const SaveBtn = ({ onClick, loading, full = false }) => (
  <button onClick={onClick} disabled={loading}
    className={`flex items-center gap-2 bg-[#0066FF] text-white px-4 py-2 uppercase text-xs tracking-wider font-semibold hover:bg-[#0052CC] transition-colors disabled:opacity-50 ${full ? 'flex-1 justify-center' : ''}`}>
    {loading ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
    {loading ? 'Saving...' : 'Save'}
  </button>
);
const SectionTitle = ({ title }) => (
  <h2 className="text-2xl font-bold text-[#1A1A1A] uppercase border-b-4 border-[#0066FF] pb-2 inline-block">{title}</h2>
);
const SectionHeader = ({ title, onSave, saving }) => (
  <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
    <SectionTitle title={title} />
    <SaveBtn onClick={onSave} loading={saving} />
  </div>
);
const EmptyState = ({ label }) => (
  <div className="text-center py-12 text-[#999] border-2 border-dashed border-[#E0E0E0]">
    <p className="text-sm">{label}</p>
  </div>
);

export default Admin;