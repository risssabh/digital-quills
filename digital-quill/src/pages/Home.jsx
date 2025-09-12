// src\pages\Home.jsx
import HeroSection from "../components/HeroSection";
import BlogCard from "../components/BlogCard";
import { useEffect, useState } from "react";
import { getTrending, getNewest, getMostLiked } from "../utils/api";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [newest, setNewest] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingNewest, setLoadingNewest] = useState(true);
  const [loadingMostLiked, setLoadingMostLiked] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchTrending() {
      try {
        const { data } = await getTrending();
        if (mounted) setTrending(data || []);
      } catch (err) {
        console.error("Failed to fetch trending", err);
      } finally {
        if (mounted) setLoadingTrending(false);
      }
    }

    async function fetchNewest() {
      try {
        const { data } = await getNewest();
        if (mounted) setNewest(data || []);
      } catch (err) {
        console.error("Failed to fetch newest", err);
      } finally {
        if (mounted) setLoadingNewest(false);
      }
    }

    async function fetchMostLiked() {
      try {
        const { data } = await getMostLiked();
        if (mounted) setMostLiked(data || []);
      } catch (err) {
        console.error("Failed to fetch most liked", err);
      } finally {
        if (mounted) setLoadingMostLiked(false);
      }
    }

    fetchTrending();
    fetchNewest();
    fetchMostLiked();

    return () => (mounted = false);
  }, []);

  const renderSection = (title, blogs, loading, emptyText) => (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl mb-6">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="small-muted">Loading {title.toLowerCase()}...</p>
        ) : blogs.length === 0 ? (
          <p className="small-muted">{emptyText}</p>
        ) : (
          blogs.slice(0, 3).map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        )}
      </div>
    </section>
  );

  return (
    <div>
      <HeroSection />
      {renderSection("Trending", trending, loadingTrending, "No trending blogs yet.")}
      {renderSection("New Blogs", newest, loadingNewest, "No new blogs yet.")}
      {renderSection("Most Liked", mostLiked, loadingMostLiked, "No blogs yet.")}
    </div>
  );
}
