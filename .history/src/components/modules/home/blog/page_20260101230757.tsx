"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBlogs } from "@/src/hooks/blog.hook";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Flame, ArrowRight, BookOpen } from "lucide-react";

const BlogSection = () => {
  const { data: blogData, isLoading } = useGetBlogs({});

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-black">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
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
    <section className="relative px-4 py-16 sm:py-24 overflow-hidden bg-white dark:bg-[#050505]">
      {/* 🏁 Racing Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 🏎️ Marketing Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 transform -skew-x-12 mb-6 border-r-4 border-orange-600 shadow-xl">
            <Flame
              size={14}
              className="text-orange-500 animate-pulse"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Pro Insights
            </span>
          </div>

          <h2 className="text-4xl sm:text-7xl font-black uppercase italic tracking-tighter dark:text-white leading-none mb-6">
            DRIVE <span className="text-orange-600">SMARTER.</span>
          </h2>

          <p className="text-[10px] sm:text-sm font-bold uppercase italic text-gray-500 tracking-[0.2em] max-w-2xl mx-auto">
            Expert maintenance tips, performance guides, and the latest{" "}
            <br className="hidden sm:block" />
            automotive trends—curated by the TyresDash pit crew.
          </p>
        </div>

        {/* 🛠️ Blog Grid: Magazine Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogData?.data?.slice(0, 3).map((post: any, index: number) => (
            <div
              key={post._id}
              className="group relative bg-gray-50 dark:bg-[#0f1115] rounded-[32px] overflow-hidden border border-transparent hover:border-orange-600/30 transition-all duration-500 shadow-xl">
              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-30">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase italic tracking-widest rounded-sm border-l-2 border-orange-600">
                  {post.category}
                </span>
              </div>

              {/* Image Box */}
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <Image
                  src={`${envConfig.base_url}${post.image}`}
                  alt={post.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-80" />
              </div>

              {/* Content Box */}
              <div className="p-6 sm:p-8 relative">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase leading-relaxed tracking-wider mb-6 line-clamp-2">
                  {truncateText(post.description, 100)}
                </p>

                <Link
                  href={`/blog/${post._id}`}
                  className="inline-flex items-center gap-2 text-orange-600 font-black uppercase italic text-[10px] tracking-widest group/link">
                  Read Intelligence{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover/link:translate-x-2 transition-transform"
                  />
                </Link>
              </div>

              {/* Hover Bottom Shimmer */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-600 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        {/* 🚀 View More / Guidelines Button */}
        {blogData?.data?.length > 3 && (
          <div className="mt-16 text-center">
            <Link
              href="/blog"
              className="group relative inline-block">
              <div className="absolute inset-0 bg-orange-600 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity" />
              <button className="relative flex items-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-xs transition-all duration-500 hover:bg-orange-600 hover:text-white">
                <BookOpen size={16} />
                <span>View All Performance Guides</span>
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </Link>
            <p className="mt-6 text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
              New Intel Uploaded Weekly • Expert Verified Content
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
