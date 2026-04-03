import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Certificates from "./pages/Certificates";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginOrAdmin = location.pathname === '/login' || location.pathname === '/admin';

  return (
    <>
      {!isLoginOrAdmin && <Header />}
      <main className={!isLoginOrAdmin ? "pt-20" : ""}>
        {children}
      </main>
      {!isLoginOrAdmin && <Footer />}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
