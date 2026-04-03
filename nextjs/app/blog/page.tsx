'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';

/* ── Data ──────────────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Study Tips', 'Exam Prep', 'Subject Guides', 'VCE News'];

const FEATURED = {
  category: 'Study Tips',
  title: 'The Complete Guide to VCE Exam Preparation: Everything You Need to Know',
  excerpt:
    'From building your study schedule to mastering exam technique, this comprehensive guide covers every aspect of VCE preparation — based on research and interviews with Australia\'s top-performing students.',
  author: 'Sarah Mitchell',
  initials: 'SM',
  date: '20 Mar 2026',
  readTime: '12 min',
  gradient: 'linear-gradient(135deg,#f5f2ff 0%,#dcd1ff 45%,#a280f8 100%)',
};

const ARTICLES = [
  { id: 1, category: 'Study Tips',     title: 'How to Ace Your VCE English: Text Response Strategies',          excerpt: 'Master the art of writing compelling text responses with proven strategies from top-scoring VCE students across Australia.',                     author: 'Sarah Mitchell', initials: 'SM', date: '18 Mar 2026', readTime: '8 min',  gradient: 'linear-gradient(135deg,#f5f2ff,#dcd1ff)' },
  { id: 2, category: 'Study Tips',     title: 'The Science of Spaced Repetition: Study Smarter, Not Harder',   excerpt: 'Discover how cognitive science can transform your study routine with evidence-based spaced repetition techniques.',                            author: 'James Chen',     initials: 'JC', date: '14 Mar 2026', readTime: '6 min',  gradient: 'linear-gradient(135deg,#dfe8ff,#a1b8ff)' },
  { id: 3, category: 'Subject Guides', title: 'VCE Math Methods: 5 Topics Every Student Struggles With',       excerpt: 'An in-depth breakdown of the most challenging Math Methods topics with worked examples and practice strategies.',                             author: 'Emma Torres',    initials: 'ET', date: '10 Mar 2026', readTime: '10 min', gradient: 'linear-gradient(135deg,#d1faea 0%,#07947a 90%)' },
  { id: 4, category: 'Exam Prep',      title: 'Managing Exam Anxiety: Strategies That Actually Work',          excerpt: 'Evidence-based techniques to manage stress and anxiety before and during your VCE exams for peak performance.',                             author: 'Dr. Lisa Park',  initials: 'LP', date: '6 Mar 2026',  readTime: '7 min',  gradient: 'linear-gradient(135deg,#ffedd4 0%,#ea5a0c 90%)' },
  { id: 5, category: 'VCE News',       title: 'Understanding Your ATAR: How Study Scores Are Calculated',      excerpt: 'A clear explanation of how your ATAR is calculated from study scores, scaling, and what this means for your university applications.',       author: 'Ryan Walsh',     initials: 'RW', date: '2 Mar 2026',  readTime: '5 min',  gradient: 'linear-gradient(135deg,#ece8fd 0%,#783cf0 90%)' },
  { id: 6, category: 'Exam Prep',      title: 'How to Build a Revision Schedule That Actually Works',          excerpt: 'Step-by-step guide to creating a realistic, effective revision schedule that accounts for your workload and maintains your wellbeing.',     author: 'Sarah Mitchell', initials: 'SM', date: '26 Feb 2026', readTime: '9 min',  gradient: 'linear-gradient(135deg,#dfe8ff 0%,#5967f4 90%)' },
  { id: 7, category: 'Subject Guides', title: 'VCE Chemistry: Mastering Equilibrium Questions in Unit 3 & 4', excerpt: 'Break down the complex world of chemical equilibrium with our structured approach to the most heavily-examined topics in VCE Chemistry.',    author: 'Emma Torres',    initials: 'ET', date: '20 Feb 2026', readTime: '8 min',  gradient: 'linear-gradient(135deg,#d1faea 0%,#057764 90%)' },
  { id: 8, category: 'Study Tips',     title: 'Top 10 Study Habits of High-Achieving VCE Students',           excerpt: 'We interviewed students who scored 40+ study scores to uncover the habits and routines that set them apart from their peers.',              author: 'James Chen',     initials: 'JC', date: '14 Feb 2026', readTime: '6 min',  gradient: 'linear-gradient(135deg,#dfe8ff 0%,#4b4ded 90%)' },
];

/* ── Sub-components ────────────────────────────────────────────────── */
function FeaturedCard({ article }: { article: typeof FEATURED }) {
  return (
    <Link
      href="/blog/vce-exam-preparation"
      className="flex bg-white rounded-2xl border border-[#e7e5e4] overflow-hidden no-underline mb-12 transition-shadow hover:shadow-[0_8px_32px_rgba(120,60,240,0.12)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      {/* Gradient art */}
      <div className="w-[360px] shrink-0 relative min-h-[300px]" style={{ background: article.gradient }}>
        <div className="absolute inset-0 flex flex-col justify-end p-7 gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full bg-white/25 backdrop-blur-sm w-fit">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.236 2.506L10 3.882l-2 1.95.472 2.75L6 7.25 3.528 8.582l.472-2.75-2-1.95 2.764-.376z" fill="#fff"/></svg>
            <span className="font-semibold text-xs text-white">Featured</span>
          </div>
          <span className="font-medium text-[13px] text-white/75">{article.readTime} read</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-9 flex flex-col justify-center flex-1">
        <div className="flex items-center gap-2.5 mb-4">
          <Badge category={article.category} size="lg" />
          <span className="text-[13px] text-[#a6a09b]">{article.readTime} read</span>
        </div>
        <h2 className="font-nunito font-extrabold text-[26px] leading-[1.22] text-[#1c1917] mb-3.5">
          {article.title}
        </h2>
        <p className="text-[15px] leading-[1.65] text-[#57534d] mb-7">{article.excerpt}</p>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <Avatar initials={article.initials} />
            <div>
              <p className="font-semibold text-sm text-[#1c1917]">{article.author}</p>
              <p className="text-[13px] text-[#a6a09b]">{article.date}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-[22px] py-3 rounded-full bg-[#783cf0] font-nunito font-extrabold text-sm text-white">
            Read article
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: (typeof ARTICLES)[number] }) {
  return (
    <Link
      href="/blog/vce-exam-preparation"
      className="block bg-white rounded-2xl border border-[#e7e5e4] overflow-hidden no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(120,60,240,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="h-[184px] relative" style={{ background: article.gradient }}>
        <div className="absolute top-3.5 left-3.5">
          <Badge category={article.category} white />
        </div>
      </div>
      <div className="px-6 pt-5 pb-6">
        <h3 className="font-nunito font-extrabold text-[17px] leading-[1.3] text-[#1c1917] mb-2.5 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm leading-[1.6] text-[#79716b] mb-[18px] line-clamp-3">{article.excerpt}</p>
        <div className="border-t border-[#f4f4f1] pt-4 flex items-center gap-2">
          <Avatar initials={article.initials} size={30} />
          <div className="flex-1">
            <p className="font-semibold text-[13px] text-[#292524]">{article.author}</p>
            <p className="text-xs text-[#a6a09b]">{article.date}</p>
          </div>
          <span className="font-medium text-xs text-[#a6a09b] whitespace-nowrap">{article.readTime} read</span>
        </div>
      </div>
    </Link>
  );
}

function CategoryTabs({ active, onChange }: { active: string; onChange: (cat: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap mb-8">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
            active === cat
              ? 'bg-[#f5f2ff] border border-[#783cf0] text-[#783cf0] font-semibold'
              : 'bg-white border border-[#e7e5e4] text-[#57534d]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function NewsletterBanner() {
  return (
    <div className="relative rounded-[20px] overflow-hidden bg-[#2d1260] mt-14 px-14 py-[52px]">
      {/* Envelope illustration */}
      <div className="absolute right-[60px] top-1/2 -translate-y-1/2 w-[220px] h-[220px] pointer-events-none">
        <Image src="/mail-subscribe.png" alt="" fill className="object-contain" />
      </div>

      {/* Copy + form */}
      <div className="relative max-w-[520px]">
        <h2 className="font-nunito font-extrabold text-[28px] text-white leading-[1.2] mb-2.5">
          Get study tips in your inbox
        </h2>
        <p className="text-[15px] text-white/60 mb-7 leading-[1.6]">
          Weekly guides, strategies, and VCE news — no spam, ever.
        </p>
        <div className="flex gap-2.5">
          <div className="flex-1 max-w-[280px] h-12 bg-white/10 rounded-[10px] border border-white/20 flex items-center px-4 backdrop-blur-sm">
            <span className="text-sm text-white/40">your@email.com</span>
          </div>
          <button className="px-6 py-3 rounded-full bg-[#783cf0] font-nunito font-extrabold text-sm text-white cursor-pointer whitespace-nowrap shadow-[0_0_24px_rgba(120,60,240,0.5)]">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered =
    activeCategory === 'All' ? ARTICLES : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Nav />

      {/* Hero */}
      <section
        className="relative overflow-hidden px-[180px] pt-[72px] pb-[80px]"
        style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f8f7ff 50%,#F5F5F5 100%)' }}
      >
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom,transparent,#F5F5F5)' }} />

        <div className="max-w-[1440px] mx-auto relative flex items-center justify-between">
          {/* Left copy */}
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-[5px] rounded-full bg-[#ece8fd] mb-[22px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#783cf0] shrink-0" />
              <span className="font-semibold text-[13px] text-[#783cf0]">Blog & Resources</span>
            </div>
            <h1 className="font-nunito font-extrabold text-[52px] leading-[1.06] text-[#1c1917] mb-[18px]">
              Study smarter,<br />
              <span className="text-[#783cf0]">not just harder.</span>
            </h1>
            <p className="text-[18px] leading-[1.56] text-[#57534d] max-w-[460px]">
              Expert strategies, subject guides, and study insights to help every VCE student reach
              their potential.
            </p>
          </div>

          {/* Right illustration */}
          <div className="shrink-0 mr-5">
            <Image
              src="/subjects-gem.svg"
              alt=""
              width={420}
              height={420}
              className="w-[420px] h-auto block drop-shadow-[0_24px_48px_rgba(120,60,240,0.18)]"
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-[1440px] mx-auto px-[180px] pt-[52px]">
        {/* Featured */}
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-nunito font-extrabold text-xl text-[#1c1917]">Featured Article</h2>
            <div className="flex-1 h-px bg-[#e7e5e4]" />
          </div>
          <FeaturedCard article={FEATURED} />
        </div>

        {/* Article grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-nunito font-extrabold text-xl text-[#1c1917]">All Articles</h2>
            <div className="flex-1 h-px bg-[#e7e5e4]" />
            <span className="text-[13px] text-[#a6a09b] whitespace-nowrap">
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-[#a6a09b] text-[15px]">
              No articles in this category yet — check back soon.
            </p>
          )}
        </div>

        {/* Load more */}
        {filtered.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3.5 rounded-full border border-[#e7e5e4] bg-white font-nunito font-extrabold text-sm text-[#44403b] cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              Load more articles
            </button>
          </div>
        )}

        <NewsletterBanner />
        <div className="h-20" />
      </main>

      <Footer />
    </div>
  );
}
