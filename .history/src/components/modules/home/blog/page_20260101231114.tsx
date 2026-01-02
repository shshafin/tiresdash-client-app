"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBlogs } from "@/src/hooks/blog.hook";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Flame,
  ArrowUpRight,
  BookOpen,
  Clock,
} from "lucide-react";

const BlogSection = () => {
  const { data: blogData, isLoading } = useGetBlogs({});

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-black">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[9px] font-black uppercase italic tracking-[0.2em] text-gray-500">
          Fetching Updates...
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
    <section className="relative px-4 py-12 sm:py-20 overflow-hidden bg-white dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏎️ Marketing Header: Clean & Balanced */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1 transform -skew-x-12 mb-4 border-r-4 border-orange-600">
            <Flame
              size={12}
              className="text-orange-500"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Knowledge Base
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter dark:text-white leading-tight mb-4">
            GUIDELINES <span className="text-orange-600">&</span>{" "}
            <br className="sm:hidden" /> UPDATES
          </h2>

          <p className="text-[9px] sm:text-xs font-bold uppercase italic text-gray-500 tracking-[0.15em] max-w-xl mx-auto leading-relaxed">
            Stay ahead with professional tire maintenance strategies and{" "}
            <br className="hidden sm:block" />
            the latest automotive industry breakthroughs.
          </p>
        </div>

        {/* 🛠️ Blog Grid: Tactical & Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogData?.data?.slice(0, 3).map((post: any, index: number) => (
            <Link
              key={post._id}
              href={`/blog/${post._id}`}
              className="group relative block h-full">
              <div className="relative bg-gray-50 dark:bg-[#0f1115] rounded-tr-[60px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg p-1 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-600/10 border border-gray-100 dark:border-white/5 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 overflow-hidden rounded-tr-[55px] rounded-bl-[25px] rounded-tl-md rounded-br-md shrink-0">
                  <Image
                    src={`${envConfig.base_url}${post.image}`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 bg-orange-600 text-white text-[7px] font-black uppercase italic px-2 py-1 rounded-sm tracking-widest">
                    {post.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[7px] font-black text-gray-400 uppercase italic mb-3 tracking-widest">
                    <Clock
                      size={10}
                      className="text-orange-600"
                    />
                    Updated: {new Date(post.createdAt).toLocaleDateString()}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-[9px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-snug tracking-wider mb-6 line-clamp-2">
                    {truncateText(post.description, 80)}
                  </p>

                  {/* Action Link */}
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <span className="text-[8px] font-black text-orange-600 uppercase italic tracking-widest">
                      Read Guidelines
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 View More Button */}
        {blogData?.data?.length > 3 && (
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-4 group">
              <div className="h-px w-8 sm:w-12 bg-gray-200 dark:bg-white/10 group-hover:bg-orange-600 transition-all" />
              <span className="text-[9px] sm:text-xs font-black uppercase italic tracking-[0.3em] dark:text-white text-gray-900">
                Explore All Resources
              </span>
              <div className="size-8 sm:size-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                <ChevronRight
                  size={14}
                  className="text-gray-400 group-hover:text-white"
                />
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
