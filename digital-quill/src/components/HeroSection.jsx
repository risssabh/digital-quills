import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
    >
      <div className="max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-5xl md:text-6xl brand">Digital Quill</h1>
          <img
            src="/quill-logo.png"
            alt="Quill Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
        </div>

        <p className="text-lg md:text-xl small-muted mb-8">
          Craft timeless stories — let ink meet imagination
          <br />
          where every story feels like a memory rediscovered.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/explore" className="btn btn-secondary">
            Explore Blogs
          </Link>
          <Link to="/create" className="btn btn-primary">
            Start Writing
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
