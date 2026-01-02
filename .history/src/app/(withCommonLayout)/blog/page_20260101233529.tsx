"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBlogs } from "@/src/hooks/blog.hook";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Flame,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
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
          switch (sortBy) {
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "oldest":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "alphabetical":
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });
        return filtered;
      })()
    : [];

  const totalPages = Math.ceil(filteredAndSortedBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredAndSortedBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const categories = [
    "All",
    ...Array.from(
      new Set(blogData?.data?.map((post: BlogPost) => post.category) || [])
    ),
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  if (isLoading)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#050505] z-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase italic tracking-[0.3em] text-gray-500">
          Syncing Intelligence...
        </p>
      </div>
    );

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <section className="relative min-h-screen bg-white dark:bg-[#050505] py-16 sm:py-24 px-4 overflow-hidden">
      {/* 🏎️ Racing Background Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 🏎️ Tactical Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-1.5 transform -skew-x-12 mb-6 shadow-2xl">
            <TrendingUp
              size={14}
              className="animate-pulse"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.4em]">
              Resource Archive
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter dark:text-white leading-none mb-8">
            PIT STOP <span className="text-orange-600">INTEL.</span>
          </h1>

          <p className="text-[10px] sm:text-xs font-bold uppercase italic text-gray-500 tracking-[0.2em] max-w-xl mx-auto leading-relaxed">
            Advanced maintenance protocols, performance engineering guides,{" "}
            <br className="hidden sm:block" />
            and high-velocity automotive updates.
          </p>
        </div>

        {/* 🛠️ Tactical Control Panel (Search & Filters) */}
        <div className="mb-12 sticky top-20 z-40">
          <div className="bg-gray-900 dark:bg-[#0f1115] border border-white/5 p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Search Field */}
              <div className="relative w-full sm:flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="SEARCH PROTOCOLS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 text-white border-0 focus:ring-1 focus:ring-orange-600 py-3 sm:py-4 pl-12 pr-6 rounded-xl sm:rounded-full text-[10px] font-black tracking-widest uppercase placeholder:text-gray-600"
                />
              </div>

              {/* Category Filter */}
              <div className="flex w-full sm:w-auto gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-black/50 text-white border-0 px-6 py-3 sm:py-4 pr-12 rounded-xl sm:rounded-full text-[10px] font-black tracking-widest uppercase cursor-pointer focus:ring-1 focus:ring-orange-600">
                    {categories.map((c: any) => (
                      <option
                        key={c}
                        value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Filter
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={14}
                  />
                </div>

                {/* Sort Filter */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-black/50 text-white border-0 px-6 py-3 sm:py-4 pr-12 rounded-xl sm:rounded-full text-[10px] font-black tracking-widest uppercase cursor-pointer focus:ring-1 focus:ring-orange-600">
                    <option value="newest">NEWEST</option>
                    <option value="oldest">OLDEST</option>
                    <option value="alphabetical">A-Z</option>
                  </select>
                  <LayoutGrid
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={14}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🛠️ Dynamic Intelligence Grid */}
        {paginatedBlogs.length === 0 ? (
          <div className="py-32 text-center">
            <div className="inline-flex size-20 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 mb-6">
              <Search
                size={32}
                className="text-gray-400"
              />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
              No Intel Found
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
              Modify your search parameters and try again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedBlogs.map((post: BlogPost, index: number) => (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                className="group relative block h-full">
                {/* 🏃 Dynamic Tactical Card */}
                <div className="relative bg-gray-50 dark:bg-[#0f1115] rounded-tr-[50px] rounded-bl-[25px] rounded-tl-lg rounded-br-lg p-[1.5px] transition-all duration-500 hover:shadow-[0_0_40px_rgba(234,88,12,0.2)] animate-pulse-slow h-full flex flex-col overflow-hidden">
                  {/* Neon Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative bg-white dark:bg-[#0f1115] rounded-tr-[49px] rounded-bl-[24px] rounded-tl-md rounded-br-md p-4 sm:p-5 h-full flex flex-col z-10">
                    {/* Image Hub */}
                    <div className="relative h-44 sm:h-52 overflow-hidden rounded-tr-[40px] rounded-bl-[18px] rounded-tl-md rounded-br-md shrink-0 border border-gray-100 dark:border-white/5">
                      <Image
                        src={`${envConfig.base_url}${post.image}`}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      {/* Floating Badge */}
                      <div className="absolute bottom-3 left-4 bg-orange-600 text-white text-[7px] font-black uppercase italic px-2.5 py-1 shadow-2xl tracking-widest z-20">
                        {post.category}
                      </div>
                    </div>

                    {/* Meta & Title */}
                    <div className="pt-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-[7px] font-black text-gray-400 uppercase italic mb-3 tracking-widest">
                        <Clock
                          size={10}
                          className="text-orange-600"
                        />{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                        <span className="ml-auto text-white/20">
                          LOG_{index + 1}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-[9px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-relaxed tracking-wider mb-6 line-clamp-2">
                        {truncateText(post.description, 85)}
                      </p>

                      {/* Read Link */}
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center group/btn">
                        <span className="text-[8px] font-black text-orange-600 uppercase italic tracking-widest">
                          Deploy Guide
                        </span>
                        <div className="size-8 rounded-full border border-orange-600/20 flex items-center justify-center group-hover/btn:bg-orange-600 group-hover/btn:text-white transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 🏁 Tactical Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-20 gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="size-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl disabled:opacity-20 hover:border-orange-600 transition-all">
              <ArrowLeft size={18} />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`size-12 rounded-2xl text-[10px] font-black italic tracking-tighter transition-all ${
                      currentPage === page
                        ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20 rotate-12 scale-110"
                        : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}>
                    {String(page).padStart(2, "0")}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="size-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl disabled:opacity-20 hover:border-orange-600 transition-all">
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.998);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BlogSection;
