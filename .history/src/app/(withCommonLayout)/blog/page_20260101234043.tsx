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
      <div className="h-screen flex items-center justify-center bg-[#050505] text-sky-400 font-black italic tracking-widest animate-pulse uppercase text-xs">
        Loading Intelligence...
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500">
      {/* 🏎️ Tactical Header: Sky Blue Gradient */}
      <header className="relative py-16 sm:py-28 px-4 text-center overflow-hidden bg-gradient-to-br from-sky-600 via-sky-900 to-black">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-300/40 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-1 transform -skew-x-12 mb-4 sm:mb-6 shadow-2xl">
            <Zap
              size={10}
              className="fill-current animate-pulse sm:size-3"
            />
            <span className="font-black uppercase italic text-[8px] sm:text-[10px] tracking-[0.3em]">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-4 sm:mb-6">
            EXPERT{" "}
            <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              GUIDES.
            </span>
          </h1>
          <p className="max-w-md mx-auto text-[8px] sm:text-xs font-bold uppercase italic text-sky-100/60 tracking-[0.2em] leading-relaxed">
            PRO-LEVEL STRATEGIES & OPERATIONAL UPDATES{" "}
            <br className="hidden sm:block" /> FOR HIGH-PERFORMANCE DRIVERS.
          </p>
        </div>
      </header>

      {/* 🛠️ Compact Filtering Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-30">
        <div className="bg-white dark:bg-[#0f1115] p-1.5 sm:p-2 rounded-xl sm:rounded-full border border-sky-400/20 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-500"
              size={14}
            />
            <input
              type="text"
              placeholder="SEARCH GUIDES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border-0 py-3.5 pl-12 pr-6 rounded-lg sm:rounded-full text-[9px] font-black tracking-widest uppercase focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:min-w-[140px]">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
                size={12}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border-0 py-3.5 pl-9 pr-8 rounded-lg sm:rounded-full text-[9px] font-black tracking-widest uppercase cursor-pointer focus:ring-1 focus:ring-sky-500">
                {categories.map((c) => (
                  <option
                    key={c}
                    value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 sm:min-w-[120px]">
              <SortAsc
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
                size={12}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-black/50 text-gray-900 dark:text-white border-0 py-3.5 pl-9 pr-8 rounded-lg sm:rounded-full text-[9px] font-black tracking-widest uppercase cursor-pointer focus:ring-1 focus:ring-sky-500">
                <option value="newest">NEWEST</option>
                <option value="oldest">OLDEST</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ Modern Tactical Grid with Spacing */}
      <main className="max-w-6xl mx-auto py-12 sm:py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {paginatedBlogs.map((post: any) => (
            <Link
              key={post._id}
              href={`/blog/${post._id}`}
              className="group relative block aspect-[5/6] sm:aspect-[4/5] overflow-hidden rounded-none shadow-xl border border-gray-100 dark:border-white/5 bg-[#0a0a0a]">
              <Image
                src={`${envConfig.base_url}${post.image}`}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              />

              {/* Top Meta: Always Visible */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-sky-600 text-white text-[7px] font-black uppercase italic px-2 py-1 tracking-[0.2em] shadow-lg">
                  {post.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 z-20 size-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-sky-500 transition-colors duration-300">
                <ArrowUpRight
                  size={14}
                  className="text-white"
                />
              </div>

              {/* Hover State: Glassmorphism Text Overlay */}
              <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                <div className="w-full p-6 sm:p-8 bg-black/60 backdrop-blur-xl border-t border-sky-500/30 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-sky-400 text-[8px] font-black uppercase italic mb-2 tracking-widest">
                    <Clock size={10} />{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter leading-tight mb-3">
                    {post.title}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Subtle Dark Gradient (Default) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-80" />
            </Link>
          ))}
        </div>

        {/* 🏁 Minimal Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 sm:mt-16 gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-sky-600/30 text-[9px] font-black uppercase italic tracking-widest hover:bg-sky-600 hover:text-white dark:text-white disabled:opacity-20 transition-all">
              PREV
            </button>
            <div className="flex gap-1.5 items-center">
              <span className="text-[9px] font-black italic text-sky-500">
                {currentPage}
              </span>
              <span className="text-[9px] font-black italic text-gray-500">
                /
              </span>
              <span className="text-[9px] font-black italic text-gray-500">
                {totalPages}
              </span>
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-sky-600/30 text-[9px] font-black uppercase italic tracking-widest hover:bg-sky-600 hover:text-white dark:text-white disabled:opacity-20 transition-all">
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
