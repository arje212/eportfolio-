import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { profileAPI, skillsAPI, certificatesAPI, projectsAPI } from '../services/api';
import { ChevronRight, Award, Briefcase, Mail, Download, Loader } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const AnimatedSection = ({ children, className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes, certsRes, projectsRes] = await Promise.all([
        profileAPI.get(),
        skillsAPI.getAll(),
        certificatesAPI.getAll(),
        projectsAPI.getAll()
      ]);
      setProfileData(profileRes.data);
      setSkills(skillsRes.data);
      setCertificates(certsRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Loader className="text-[#0066FF]" size={48} />
        </motion.div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">

      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center px-6 py-20"
        style={{ opacity, scale }}
      >
        <div className="max-w-7xl w-full">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={slideInLeft}>
              <motion.div className="mb-8">
                <motion.p
                  className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono"
                  variants={fadeInUp}
                >
                  COMPUTER ENGINEER
                </motion.p>
                <motion.h1
                  className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] uppercase leading-tight mb-6"
                  variants={fadeInUp}
                >
                  {profileData.name}
                </motion.h1>
                <motion.p
                  className="text-lg text-[#333] leading-relaxed"
                  variants={fadeInUp}
                >
                  {profileData.tagline}
                </motion.p>
              </motion.div>
              <motion.div className="flex gap-4 flex-wrap" variants={fadeInUp}>
                <Link
                  to="/projects"
                  className="bg-[#0066FF] text-white px-8 py-4 uppercase text-sm tracking-wider font-semibold hover:bg-[#0052CC] transition-all inline-flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                >
                  View Projects <ChevronRight size={18} />
                </Link>
                
                  href="#contact"
                  className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-4 uppercase text-sm tracking-wider font-semibold hover:bg-[#1A1A1A] hover:text-white transition-all hover:scale-105"
                >
                  Get In Touch
                </a>
              </motion.div>
            </motion.div>

            <motion.div className="relative" variants={slideInRight}>
              <motion.div
                className="aspect-square bg-white border-4 border-[#1A1A1A] overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={profileData.profileImage}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -right-6 w-full h-full border-4 border-[#0066FF] -z-10"
                initial={{ x: 0, y: 0 }}
                animate={{ x: 24, y: 24 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <AnimatedSection>
        <motion.section className="py-20 px-6 bg-white" variants={fadeInUp}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="mb-12" variants={fadeInUp}>
              <p className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono">WHO I AM</p>
              <h2 className="text-4xl font-bold text-[#1A1A1A] uppercase">About</h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-12" variants={staggerContainer}>
              <motion.div className="lg:col-span-2" variants={fadeInUp}>
                <p className="text-lg text-[#333] leading-relaxed mb-6">{profileData.bio}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {[
                    { value: `${certificates.length}+`, label: 'Certificates' },
                    { value: `${projects.length}+`, label: 'Projects' },
                    { value: `${skills.reduce((acc, cat) => acc + cat.items.length, 0)}+`, label: 'Skills' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      className="border-l-4 border-[#0066FF] pl-6"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <p className="text-3xl font-bold text-[#1A1A1A] mb-2">{stat.value}</p>
                      <p className="text-sm uppercase tracking-wider text-[#666] font-mono">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div className="space-y-4" variants={fadeInUp}>
                {[
                  { label: 'Email', value: profileData.email },
                  { label: 'Phone', value: profileData.phone },
                  { label: 'Location', value: profileData.location }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-[#F5F5F5] p-6 border-l-4 border-[#0066FF]"
                    whileHover={{ x: 5, boxShadow: '0 4px 12px rgba(0,102,255,0.1)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">{item.label}</p>
                    <p className="text-[#1A1A1A] font-semibold">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </AnimatedSection>

      {/* Skills Section */}
      <AnimatedSection>
        <motion.section className="py-20 px-6 bg-[#F5F5F5]" variants={fadeInUp}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="mb-12" variants={fadeInUp}>
              <p className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono">WHAT I DO</p>
              <h2 className="text-4xl font-bold text-[#1A1A1A] uppercase">Skills & Expertise</h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
              {skills.map((skillCategory, idx) => (
                <motion.div
                  key={skillCategory.id}
                  className="bg-white p-8 border-2 border-[#E0E0E0] hover:border-[#0066FF] transition-all"
                  variants={scaleIn}
                  whileHover={{ y: -8, boxShadow: '0 8px 24px rgba(0,102,255,0.15)' }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-6 uppercase">{skillCategory.category}</h3>
                  <ul className="space-y-3">
                    {skillCategory.items.map((skill, skillIdx) => (
                      <motion.li
                        key={skillIdx}
                        className="text-[#333] flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: skillIdx * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-[#0066FF] flex-shrink-0" />
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </AnimatedSection>

      {/* Certificates Section */}
      <AnimatedSection>
        <motion.section className="py-20 px-6 bg-white" variants={fadeInUp}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="flex justify-between items-end mb-12" variants={fadeInUp}>
              <div>
                <p className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono">ACHIEVEMENTS</p>
                <h2 className="text-4xl font-bold text-[#1A1A1A] uppercase">Certificates</h2>
              </div>
              <Link
                to="/certificates"
                className="text-[#0066FF] font-semibold uppercase text-sm tracking-wider hover:underline flex items-center gap-2 hover:gap-4 transition-all"
              >
                View All <ChevronRight size={18} />
              </Link>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
              {certificates.slice(0, 6).map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  className="bg-[#F5F5F5] border-2 border-[#E0E0E0] overflow-hidden hover:border-[#0066FF] transition-all"
                  variants={scaleIn}
                  whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <motion.img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Award className="text-[#0066FF] flex-shrink-0 mt-1" size={20} />
                      <h3 className="font-bold text-[#1A1A1A] text-base leading-tight">{cert.title}</h3>
                    </div>
                    <p className="text-sm text-[#666] uppercase tracking-wider font-mono">{cert.issuer}</p>
                    <p className="text-sm text-[#999] mt-2">{cert.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </AnimatedSection>

      {/* Projects Section */}
      <AnimatedSection>
        <motion.section className="py-20 px-6 bg-[#F5F5F5]" variants={fadeInUp}>
          <div className="max-w-7xl mx-auto">
            <motion.div className="flex justify-between items-end mb-12" variants={fadeInUp}>
              <div>
                <p className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono">PORTFOLIO</p>
                <h2 className="text-4xl font-bold text-[#1A1A1A] uppercase">Featured Projects</h2>
              </div>
              <Link
                to="/projects"
                className="text-[#0066FF] font-semibold uppercase text-sm tracking-wider hover:underline flex items-center gap-2 hover:gap-4 transition-all"
              >
                View All <ChevronRight size={18} />
              </Link>
            </motion.div>
            <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-8" variants={staggerContainer}>
              {projects.slice(0, 4).map((project, idx) => (
                <motion.div
                  key={project.id}
                  variants={scaleIn}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="block bg-white border-2 border-[#E0E0E0] overflow-hidden hover:border-[#0066FF] transition-all group"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#F5F5F5]">
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <motion.div className="p-8" whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                      <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="text-[#0066FF]" size={20} />
                        <span className="text-xs uppercase tracking-widest text-[#666] font-mono">{project.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 uppercase">{project.title}</h3>
                      <p className="text-[#666] leading-relaxed mb-4 text-sm">{project.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#999] font-mono">{project.software}</span>
                        <span className="text-[#999]">•</span>
                        <span className="text-[#999] font-mono">{project.year}</span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection>
        <motion.section id="contact" className="py-20 px-6 bg-white" variants={fadeInUp}>
          <div className="max-w-4xl mx-auto">
            <motion.div className="mb-12 text-center" variants={fadeInUp}>
              <p className="text-sm uppercase tracking-widest text-[#666] mb-4 font-mono">GET IN TOUCH</p>
              <h2 className="text-4xl font-bold text-[#1A1A1A] uppercase mb-4">Contact</h2>
              <p className="text-[#666] text-lg">Let's discuss your next project or opportunity</p>
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" variants={staggerContainer}>
              <motion.div
                className="bg-[#F5F5F5] p-8 border-l-4 border-[#0066FF]"
                variants={scaleIn}
                whileHover={{ x: 5, boxShadow: '0 8px 16px rgba(0,102,255,0.1)' }}
              >
                <Mail className="text-[#0066FF] mb-4" size={32} />
                <h3 className="text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Email</h3>
                <p className="text-[#1A1A1A] text-lg font-semibold">{profileData.email}</p>
              </motion.div>
              <motion.div
                className="bg-[#F5F5F5] p-8 border-l-4 border-[#0066FF]"
                variants={scaleIn}
                whileHover={{ x: 5, boxShadow: '0 8px 16px rgba(0,102,255,0.1)' }}
              >
                <Download className="text-[#0066FF] mb-4" size={32} />
                <h3 className="text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Resume</h3>
                <button className="text-[#0066FF] text-lg font-semibold hover:underline">Download CV</button>
              </motion.div>
            </motion.div>
            <motion.form
              className="space-y-6"
              variants={staggerContainer}
              onSubmit={async (e) => { e.preventDefault(); }}
            >
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={fadeInUp}>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Name</label>
                  <input
                    type="text"
                    className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Email</label>
                  <input
                    type="email"
                    className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Subject</label>
                <input
                  type="text"
                  className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors"
                  placeholder="Project inquiry"
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <label className="block text-xs uppercase tracking-widest text-[#666] mb-2 font-mono">Message</label>
                <textarea
                  rows={6}
                  className="w-full border-2 border-[#E0E0E0] px-4 py-3 focus:border-[#0066FF] focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </motion.div>
              <motion.button
                type="submit"
                className="w-full md:w-auto bg-[#0066FF] text-white px-12 py-4 uppercase text-sm tracking-wider font-semibold hover:bg-[#0052CC] transition-all"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(0,102,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </motion.section>
      </AnimatedSection>

    </div>
  );
};

export default Home;