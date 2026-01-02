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
  Calendar,
} from "lucide-react";

const BlogSection = () => {
  const { data: blogData, isLoading } = useGetBlogs({});

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-black">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-black uppercase italic tracking-[0.3em] text-gray-500">
          Processing Intel...
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
      {/* 🏁 Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 🏎️ Tactical Header */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-1 transform -skew-x-12 mb-6">
            <Flame
              size={12}
              className="animate-pulse"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.4em]">
              Intelligence Hub
            </span>
          </div>

          <h2 className="text-5xl sm:text-8xl font-black uppercase italic tracking-tighter dark:text-white leading-[0.85] mb-8">
            PIT STOP <br />{" "}
            <span className="text-orange-600 drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">
              INSIGHTS.
            </span>
          </h2>
        </div>

        {/* 🛠️ Blog Grid: Tactical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogData?.data?.slice(0, 3).map((post: any, index: number) => (
            <Link
              key={post._id}
              href={`/blog/${post._id}`}
              className="group relative block">
              {/* 🏎️ Card Body with Slanted Cut */}
              <div className="relative bg-gray-50 dark:bg-[#0f1115] rounded-tr-[80px] rounded-bl-[40px] rounded-tl-xl rounded-br-xl p-1 transition-all duration-500 group-hover:shadow-[0_20px_60px_-15px_rgba(234,88,12,0.3)] border border-gray-100 dark:border-white/5">
                {/* Image Container with Clip Path */}
                <div className="relative h-56 sm:h-64 overflow-hidden rounded-tr-[75px] rounded-bl-[35px] rounded-tl-lg rounded-br-lg">
                  <Image
                    src={`${envConfig.base_url}${post.image}`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-black/20 to-transparent" />

                  {/* Category Badge - Neon Style */}
                  <div className="absolute bottom-4 left-6 bg-orange-600 text-white text-[8px] font-black uppercase italic px-3 py-1 rounded-sm shadow-xl tracking-widest">
                    {post.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-[8px] font-black text-orange-600 uppercase italic mb-4 tracking-widest">
                    <Calendar size={10} />{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-[1.1] mb-4 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase leading-relaxed tracking-wider mb-8 line-clamp-2">
                    {truncateText(post.description, 90)}
                  </p>

                  {/* Tactical Action Button */}
                  <div className="flex justify-between items-center">
                    <div className="h-0.5 w-12 bg-gray-200 dark:bg-white/10 group-hover:w-20 group-hover:bg-orange-600 transition-all duration-500" />
                    <div className="size-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                      <ArrowUpRight
                        size={18}
                        className="text-gray-400 group-hover:text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Decorative Serial Tag */}
                <div className="absolute top-6 right-16 text-[7px] font-black text-white/20 uppercase italic tracking-[0.4em] rotate-90 origin-right">
                  INTEL_LOG_{index + 1}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 High-End View More Button */}
        {blogData?.data?.length > 3 && (
          <div className="mt-20 text-center">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-6">
              <span className="text-xs font-black uppercase italic tracking-[0.4em] dark:text-white text-gray-900 group-hover:text-orange-600 transition-colors">
                Access Full Archive
              </span>
              <div className="size-14 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center group-hover:bg-orange-600 transition-all duration-500 shadow-2xl">
                <ChevronRight
                  size={24}
                  className="text-white dark:text-black group-hover:text-white group-hover:translate-x-1"
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
