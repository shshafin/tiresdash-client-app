"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBlogs } from "@/src/hooks/blog.hook";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpRight,
  Clock,
  Zap,
  ChevronRight,
  Filter,
  SortAsc,
} from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  createdAt: string;
}

const BlogSection = () => {
  const { data: blogData, isLoading } = useGetBlogs({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredAndSortedBlogs = blogData?.data
    ? (() => {
        const filtered = blogData.data.filter((post: BlogPost) => {
          const matchesSearch = post.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesCategory =
            selectedCategory === "All" || post.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });

        filtered.sort((a: BlogPost, b: BlogPost) => {
          if (sortBy === "newest")
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          if (sortBy === "oldest")
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          return a.title.localeCompare(b.title);
        });
        return filtered;
      })()
    : [];

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const categories = [
    "All",
    ...Array.from(
      new Set(blogData?.data?.map((post: BlogPost) => post.category) || [])
    ),
  ];

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-blue-500 font-black italic tracking-widest animate-pulse">
        SYNCING DATA...
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      {/* 🏎️ Tactical Header: Deep Blue Gradient (Like FAQ) */}
      <header className="relative py-20 sm:py-32 px-4 text-center overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e1b4b] to-black">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-400/30 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl">
            <Zap
              size={12}
              className="fill-current animate-pulse"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            EXPERT{" "}
            <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]">
              GUIDES.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-[9px] sm:text-xs font-bold uppercase italic text-blue-100/70 tracking-[0.2em] leading-relaxed">
            PRO-LEVEL MAINTENANCE STRATEGIES &{" "}
            <br className="hidden sm:block" /> OPERATIONAL UPDATES FOR ELITE
            DRIVERS.
          </p>
        </div>
      </header>

      {/* 🛠️ High-Velocity Filtering Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white dark:bg-[#0f1115] p-2 rounded-2xl sm:rounded-full border border-blue-600/20 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500"
              size={16}
            />
            <input
              type="text"
              placeholder="SEARCH GUIDES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border-0 py-4 pl-12 pr-6 rounded-xl sm:rounded-full text-[10px] font-black tracking-widest uppercase focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={14}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border-0 py-4 pl-10 pr-10 rounded-xl sm:rounded-full text-[10px] font-black tracking-widest uppercase cursor-pointer focus:ring-2 focus:ring-blue-600">
                {categories.map((c) => (
                  <option
                    key={c}
                    value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <SortAsc
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                size={14}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border-0 py-4 pl-10 pr-10 rounded-xl sm:rounded-full text-[10px] font-black tracking-widest uppercase cursor-pointer focus:ring-2 focus:ring-blue-600">
                <option value="newest">NEWEST</option>
                <option value="oldest">OLDEST</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ Modern Tactical Grid */}
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
          {paginatedBlogs.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post._id}`}
              className="group relative block aspect-[4/5] overflow-hidden border-[0.5px] border-gray-100 dark:border-white/5">
              {/* Main Image - 0 Border Radius */}
              <Image
                src={`${envConfig.base_url}${post.image}`}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Default State: Category & Arrow */}
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-blue-600 text-white text-[8px] font-black uppercase italic px-3 py-1 tracking-widest shadow-xl">
                  {post.category}
                </span>
              </div>
              <div className="absolute bottom-6 right-6 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 group-hover:bg-blue-600 transition-colors">
                <ArrowUpRight
                  size={18}
                  className="text-white"
                />
              </div>

              {/* Hover State: Glassmorphism Text Overlay */}
              <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                <div className="w-full p-8 bg-black/40 backdrop-blur-xl border-t border-white/20 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-blue-400 text-[8px] font-black uppercase italic mb-3">
                    <Clock size={12} />{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter leading-tight mb-4">
                    {post.title}
                  </h3>
                  <p className="text-[10px] text-gray-300 font-medium uppercase tracking-widest line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Subtle Dark Gradient (Default) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            </Link>
          ))}
        </div>

        {/* 🏁 Minimal Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-16 gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 border border-blue-600/30 text-[10px] font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all">
              PREV
            </button>
            <span className="text-[10px] font-black italic text-gray-500">
              PAGE {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 border border-blue-600/30 text-[10px] font-black uppercase italic tracking-widest hover:bg-blue-600 hover:text-white disabled:opacity-20 transition-all">
              NEXT
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BlogSection;
