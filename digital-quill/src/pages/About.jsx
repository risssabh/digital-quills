// src/pages/About.jsx
export default function About() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl brand mb-6">About Us</h1>

      <p className="mb-4 text-lg leading-relaxed">
        Hi, I’m <span className="font-semibold">Rishabh Kumar Singh</span>, a developer passionate about creating 
        modern, functional, and visually appealing web applications. 
        I love building projects that combine creativity with technology.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        <span className="brand">Digital Quill</span> is my blogging platform project. 
        It’s built with React, Redux, TailwindCSS, and Vite, styled with a retro 
        “book & quill” inspired theme. The goal is to create a stylish and minimal 
        platform where Gen Z meets Millennial and share their stories.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        This platform is designed for writers, thinkers, and everyday people who want 
        to express themselves. Whether it’s sharing personal stories, posting insightful 
        blogs, or documenting creative journeys, <span className="brand">Digital Quill </span> 
        provides a space to connect with the world through words.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        Writing has always been a timeless way to connect across cultures and generations. 
        With <span className="brand">Digital Quill</span>, I wanted to recreate that feeling — 
        a modern “digital diary” where voices from different walks of life can come together. 
        Every blog is a story, every post is a chapter, and every writer adds to the library 
        of human experiences.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        Readers can explore blogs across different topics — from technology to lifestyle, 
        personal growth, travel, and beyond. Writers, on the other hand, can easily create, 
        edit, and publish their work without the distractions of cluttered platforms. 
        The platform also supports features like notifications, user profiles, and interactive 
        engagement to make the blogging experience more personal and dynamic.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        At its core, <span className="brand">Digital Quill</span> isn’t just about writing blogs — 
        it’s about sharing a piece of yourself with the world. It’s a space to inspire, 
        to connect, and to remind ourselves that stories matter, no matter how big or small.
      </p>

      <p className="mb-6 text-lg leading-relaxed">
        You can check out the source code of this project on my GitHub repository:  
        <a
          href="https://github.com/yourusername/digital-quill"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6a4e2c] hover:underline ml-2"
        >
          View Project Repo →
        </a>
      </p>

      <p className="italic">Thanks for visiting and being part of this journey — happy reading & writing! ✨</p>
    </div>
  );
}
