import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateBlog from "./pages/CreateBlog";
import Explore from "./pages/Explore";
import BlogDetails from "./pages/BlogDetails";
import EditBlog from "./pages/EditBlog";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { Fragment } from "react";

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-grow nav-fixed-space">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<CreateBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/blog/:id/edit" element={<EditBlog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
