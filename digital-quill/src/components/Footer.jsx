// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 py-6 text-center text-sm border-t border-[#d6c6a5] bg-white/80">
      <div className="mb-3">
        <Link to="/about" className="mx-3 small-muted hover:underline">About</Link>
        <Link to="/explore" className="mx-3 small-muted hover:underline">Explore</Link>
        <Link to="/contact" className="mx-3 small-muted hover:underline">Contact</Link>
      </div>
      <p className="small-muted">
        Handcrafted By Risssabh © {new Date().getFullYear()} <span className="brand">Digital Quill</span>. All rights reserved.
      </p>
    </footer>
  );
}
