// src\pages\Contact.jsx

export default function Contact() {
  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl brand mb-6">Contact Me</h1>

      <p className="mb-6 text-lg leading-relaxed">
        I’d love to connect with you! Whether you’re a fellow writer, a reader,
        or someone curious about <span className="brand">Digital Quill</span>,
        your thoughts and feedback mean the world to me. This platform is built
        not just for sharing stories, but for building a community around them
        and you’re a part of that journey 👇
      </p>

      <ul className="space-y-4 text-lg">
        <li>
          <a
            href="https://yourportfolio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#6a4e2c] hover:underline"
          >
            <img src="/portfolio.svg" alt="Portfolio" className="w-5 h-5" />
            Personal Portfolio
          </a>
        </li>
        <li>
          <a
            href="https://github.com/risssabh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#6a4e2c] hover:underline"
          >
            <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/rishabhkumarsingh361/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#6a4e2c] hover:underline"
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/ris.sabh/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#6a4e2c] hover:underline"
          >
            <img src="/instagram.svg" alt="Instagram" className="w-5 h-5" />
            Instagram
          </a>
        </li>
        <li>
          <a
            href="https://x.com/itsrissabh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#6a4e2c] hover:underline"
          >
            <img src="/twitter.svg" alt="Twitter" className="w-5 h-5" />
            Twitter
          </a>
        </li>
      </ul>

      <p className="mt-8 mb-4 text-lg leading-relaxed">
        If you have ideas for collaboration, suggestions for improving{" "}
        <span className="brand">Digital Quill</span>, or simply want to share
        your blogging journey with me — I’d be more than happy to hear from you.
        This project grows stronger with every story, every idea, and every
        voice that joins in.
      </p>

      <p className="italic">
        I’m always open to collaboration, freelance work, or just a friendly
        chat ✍️ <br />
        Let’s keep the art of storytelling alive together!
      </p>
    </div>
  );
}
