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
  Target,
  Zap,
  ChevronRight,
  TrendingUp,
  X,
  Facebook,
  Linkedin,
  Copy,
} from "lucide-react";

// 🏎️ Tactical Skeleton for High-Speed Loading
const BlogDetailSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-[#050505] animate-pulse">
    <div className="h-1 bg-gray-200 dark:bg-white/5 w-full" />
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded-full mb-8" />
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="h-20 w-3/4 bg-gray-200 dark:bg-white/5 rounded-2xl" />
          <div className="h-[400px] w-full bg-gray-200 dark:bg-white/5 rounded-[40px]" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function BlogDetailPage({ params }: any) {
  const unwrappedParams = use(params as any);
  const id = (unwrappedParams as any).id;
  const router = useRouter();
  const { data: blog, isLoading, isError } = useGetSingleBlog(id);

  const [readingProgress, setReadingProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
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

  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blog?.data?.title || "TyresDash Elite Guide";
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link Secured to Clipboard!");
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

  if (isLoading) return <BlogDetailSkeleton />;
  if (isError) return <DataError />;
  if (!blog?.data)
    return (
      <div className="p-20 text-center font-black italic text-gray-500 uppercase">
        Mission Data Not Found
      </div>
    );

  const post = blog.data;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 pb-20">
      {/* 🏎️ Live Reading Tracker (Sky Blue) */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-[100] bg-gray-100 dark:bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-200"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 🏁 Hero Header Section */}
      <header className="relative pt-12 pb-12 px-4 overflow-hidden bg-gradient-to-b from-sky-50 dark:from-sky-950/20 to-transparent">
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-[10px] font-black uppercase italic tracking-[0.2em] text-gray-500 hover:text-sky-500 transition-colors mb-8">
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Archive
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-sky-600 text-white px-3 py-1 transform -skew-x-12 mb-6">
                <Zap
                  size={12}
                  className="fill-current"
                />
                <span className="font-black uppercase italic text-[9px] tracking-widest">
                  {post.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter dark:text-white leading-[0.9]">
                {post.title}
              </h1>
            </div>

            {/* Rapid Stats Dashboard */}
            <div className="flex items-center gap-6 border-l-4 border-sky-500 pl-6 h-fit">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Reading Sync
                </span>
                <span className="text-xl font-black dark:text-white italic tracking-tighter">
                  {formatElapsedTime(elapsedTime)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Security Level
                </span>
                <span className="text-xl font-black text-emerald-500 italic tracking-tighter uppercase leading-none">
                  Elite
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🛠️ Tactical Content Grid */}
      <main className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Main Content (Glassmorphism Style) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Feature Image - 0 Border Radius Style */}
            <div className="relative aspect-[16/10] sm:aspect-[1/10] overflow-hidden group shadow-2xl border border-white/5">
              <Image
                src={`${envConfig.base_url}${post.image}`}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Tactical Article Body */}
            <div className="relative p-6 sm:p-10 bg-gray-50 dark:bg-[#0f1115] border border-gray-100 dark:border-white/5 rounded-none sm:rounded-tr-[80px] sm:rounded-bl-[40px]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Target size={200} />
              </div>

              <article className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter">
                <div className="whitespace-pre-line text-lg sm:text-xl font-medium">
                  {post.description}
                </div>
              </article>
            </div>
          </div>

          {/* Right: Intelligence Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Mission Intel Card */}
            <div className="bg-gray-900 dark:bg-[#0f1115] p-8 rounded-none sm:rounded-tr-[40px] sm:rounded-bl-[40px] border border-sky-500/20 shadow-2xl">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                <TrendingUp
                  size={20}
                  className="text-sky-500"
                />{" "}
                Quick Info
              </h3>

              <div className="space-y-6">
                {[
                  { label: "Protocol", val: post.category },
                  {
                    label: "Deployment",
                    val: new Date(post.createdAt).toLocaleDateString(),
                  },
                  { label: "Data Integrity", val: "Verified" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span className="text-xs font-black text-white uppercase italic tracking-tighter">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Share Sector */}
              <div className="mt-10 relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full bg-sky-600 hover:bg-white hover:text-black text-white py-4 rounded-xl font-black uppercase italic tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all duration-500">
                  <Share2 size={16} /> Share Guide
                </button>

                {showShareMenu && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1a1c21] p-2 rounded-2xl shadow-2xl border border-sky-500/20 z-50">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "twitter", icon: X, label: "X" },
                        { id: "facebook", icon: Facebook, label: "FB" },
                        { id: "linkedin", icon: Linkedin, label: "IN" },
                        { id: "copy", icon: Copy, label: "Link" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleShare(p.id)}
                          className="flex items-center gap-2 p-3 hover:bg-sky-500/10 rounded-xl text-[9px] font-black uppercase tracking-tighter text-gray-500 dark:text-gray-300">
                          <p.icon
                            size={14}
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

            {/* Progress Visualizer */}
            <div className="bg-sky-500/5 border border-sky-500/20 p-8 rounded-none sm:rounded-tr-[40px] sm:rounded-bl-[40px]">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase italic text-gray-500">
                  Sync Progress
                </span>
                <span className="text-xs font-black text-sky-500">
                  {Math.round(readingProgress)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              <p className="mt-4 text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-tight">
                Complete the guide to finalize your tactical data sync.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
