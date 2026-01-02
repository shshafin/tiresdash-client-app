"use client";

import { DataError } from "@/src/app/(withCommonLayout)/(admin)/admin/_components/DataFetchingStates";
import { envConfig } from "@/src/config/envConfig";
import { useGetSingleBlog } from "@/src/hooks/blog.hook";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  Share2,
  Zap,
  TrendingUp,
  X,
  Facebook,
  Linkedin,
  Copy,
  Calendar,
} from "lucide-react";

export default function BlogDetailPage({ params }: any) {
  const unwrappedParams = use(params as any);
  const id = (unwrappedParams as any).id;
  const router = useRouter();
  const { data: blog, isLoading, isError } = useGetSingleBlog(id);

  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.data?.title || "TyresDash Guide";
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link Copied!");
    } else {
      const shareUrls: any = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      };
      window.open(shareUrls[platform], "_blank");
    }
    setShowShareMenu(false);
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-sky-500 font-black italic animate-pulse">
        SYNCING DATA...
      </div>
    );
  if (isError) return <DataError />;
  if (!blog?.data)
    return (
      <div className="p-20 text-center font-black italic text-gray-500 uppercase">
        Guide Not Found
      </div>
    );

  const post = blog.data;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 pb-20">
      {/* 🏎️ Top Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-gray-100 dark:bg-white/5">
        <div
          className="h-full bg-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.6)] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 🏁 Header: Minimal Padding */}
      <header className="relative pt-8 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-[9px] font-black uppercase italic tracking-widest text-gray-400 hover:text-sky-500 transition-colors mb-6">
            <ArrowLeft
              size={12}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Archive
          </button>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-3 py-1 transform -skew-x-12 mb-4">
              <Zap
                size={10}
                className="fill-current"
              />
              <span className="font-black uppercase italic text-[8px] tracking-widest">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter dark:text-white leading-[0.95] mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-[9px] font-bold text-gray-500 uppercase italic tracking-widest">
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={12}
                  className="text-sky-500"
                />{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock
                  size={12}
                  className="text-sky-500"
                />{" "}
                5 Min Read
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* 🖼️ Contained Feature Image with Increased Height */}
            <div className="relative w-full h-[350px] sm:h-[550px] overflow-hidden bg-gray-900 border border-gray-100 dark:border-white/5">
              <Image
                src={`${envConfig.base_url}${post.image}`}
                alt={post.title}
                fill
                priority
                className="object-cover transition-transform duration-[3s] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-medium prose-p:leading-relaxed">
              <div className="whitespace-pre-line text-lg sm:text-xl font-medium leading-relaxed">
                {post.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-gray-50 dark:bg-[#0f1115] p-6 sm:p-8 border-l-4 border-sky-500 shadow-xl sticky top-24">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                <TrendingUp
                  size={18}
                  className="text-sky-500"
                />{" "}
                Quick Info
              </h3>

              <div className="space-y-4 mb-8">
                {[
                  { label: "Category", val: post.category },
                  {
                    label: "Updated",
                    val: new Date(post.createdAt).toLocaleDateString(),
                  },
                  { label: "Trust", val: "Verified" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Share Sector */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full bg-sky-600 hover:bg-black text-white py-4 rounded-xl font-black uppercase italic tracking-widest text-[9px] flex items-center justify-center gap-3 transition-all duration-500">
                  <Share2 size={14} /> Share Guide
                </button>

                {showShareMenu && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1a1c21] p-3 rounded-2xl shadow-2xl border border-sky-500/20 z-50">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "twitter", icon: X, label: "Twitter" },
                        { id: "facebook", icon: Facebook, label: "Facebook" },
                        { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
                        { id: "copy", icon: Copy, label: "Copy" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleShare(p.id)}
                          className="flex items-center gap-2 p-2.5 hover:bg-sky-500/10 rounded-xl text-[8px] font-black uppercase tracking-tighter text-gray-500 dark:text-gray-300">
                          <p.icon
                            size={12}
                            className="text-sky-500"
                          />{" "}
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
