"use client";

import { envConfig } from "@/src/config/envConfig";
import { useGetBlogs } from "@/src/hooks/blog.hook";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Flame, ArrowUpRight, Clock } from "lucide-react";

const BlogSection = () => {
  const { data: blogData, isLoading } = useGetBlogs({});

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-black">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-[9px] font-black uppercase italic tracking-[0.2em] text-gray-500">
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
    <section className="relative px-4 py-12 sm:py-20 overflow-hidden bg-white dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🏎️ Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1 transform -skew-x-12 mb-4 border-r-4 border-orange-600">
            <Flame
              size={12}
              className="text-orange-500 animate-pulse"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Knowledge Base
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter dark:text-white leading-tight mb-4">
            GUIDELINES <span className="text-orange-600">&</span>{" "}
            <br className="sm:hidden" /> UPDATES
          </h2>
        </div>

        {/* 🛠️ Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogData?.data?.slice(0, 3).map((post: any, index: number) => (
            <Link
              key={post._id}
              href={`/blog/${post._id}`}
              className="group relative block h-full">
              {/* 🏃 Default Breathing Animation & Hover Glow */}
              <div className="relative bg-gray-50 dark:bg-[#0f1115] rounded-tr-[60px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg p-[1.5px] transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)] animate-pulse-slow h-full flex flex-col">
                {/* 🌈 Dynamic Border Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-transparent to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[60px] rounded-bl-[30px] rounded-tl-lg rounded-br-lg" />

                <div className="relative bg-gray-50 dark:bg-[#0f1115] rounded-tr-[59px] rounded-bl-[29px] rounded-tl-md rounded-br-md p-4 sm:p-6 h-full flex flex-col z-10">
                  {/* Image Container */}
                  <div className="relative h-44 sm:h-52 overflow-hidden rounded-tr-[50px] rounded-bl-[20px] rounded-tl-md rounded-br-md shrink-0">
                    <Image
                      src={`${envConfig.base_url}${post.image}`}
                      alt={post.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 left-4 bg-orange-600 text-white text-[7px] font-black uppercase italic px-2 py-1 rounded-sm tracking-widest z-20">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-[7px] font-black text-gray-400 uppercase italic mb-2 tracking-widest">
                      <Clock
                        size={10}
                        className="text-orange-600"
                      />{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-[9px] sm:text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-snug tracking-wider mb-4 line-clamp-2">
                      {truncateText(post.description, 80)}
                    </p>

                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
                      <span className="text-[8px] font-black text-orange-600 uppercase italic tracking-widest">
                        Read More
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 View More */}
        {blogData?.data?.length > 3 && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 group">
              <span className="text-[9px] font-black uppercase italic tracking-[0.3em] dark:text-white text-gray-900">
                Explore Archives
              </span>
              <div className="size-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                <ChevronRight
                  size={12}
                  className="text-gray-400 group-hover:text-white"
                />
              </div>
            </Link>
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
            transform: scale(0.995);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BlogSection;
