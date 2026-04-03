'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';

/* ── TOC sections ──────────────────────────────────────────────────── */
const TOC_SECTIONS = [
  { id: 'why-matters',   label: 'Why Text Response Matters' },
  { id: 'decode-prompt', label: 'Decoding the Prompt' },
  { id: 'contention',    label: 'Building Your Contention' },
  { id: 'structure',     label: 'Essay Structure' },
  { id: 'language',      label: 'Using Language Effectively' },
  { id: 'action-plan',   label: 'Your Action Plan' },
];

/* ── Share icons ────────────────────────────────────────────────────── */
function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="13" height="13" rx="3.5" stroke="#783cf0" strokeWidth="1.2"/>
      <circle cx="7.5" cy="7.5" r="2.8" stroke="#783cf0" strokeWidth="1.2"/>
      <circle cx="11.2" cy="3.8" r="0.8" fill="#783cf0"/>
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="1" y="1" width="13" height="13" rx="2.5" stroke="#783cf0" strokeWidth="1.2"/>
      <path d="M3.2 5.8h1.7v6.2H3.2V5.8ZM4.05 4.9a.85.85 0 1 0 0-1.7.85.85 0 0 0 0 1.7ZM6.8 5.8H8.4v.85h.02c.24-.46.96-1 1.96-1C12.1 5.65 12.5 7 12.5 8.7V12H10.8V9.05c0-.73-.01-1.67-1.02-1.67-1.02 0-1.18.8-1.18 1.62V12H6.8V5.8Z" fill="#783cf0"/>
    </svg>
  );
}
function IconCopyLink() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M6.3 8.2a3.2 3.2 0 0 0 4.5 0l1.7-1.7a3.2 3.2 0 0 0-4.5-4.5L7 3.05" stroke="#783cf0" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8.7 6.8a3.2 3.2 0 0 0-4.5 0L2.5 8.5a3.2 3.2 0 0 0 4.5 4.5L8 11.95" stroke="#783cf0" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Sidebar components ─────────────────────────────────────────────── */
function TableOfContents({ activeSection }: { activeSection: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e7e5e4] p-5 mb-5 sticky top-[72px]">
      <p className="font-nunito font-extrabold text-sm text-[#1c1917] mb-3">In this article</p>
      <nav>
        {TOC_SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`block font-medium text-[13.5px] px-3 py-[7px] rounded-[7px] mb-0.5 border-l-2 transition-all no-underline ${
              activeSection === s.id
                ? 'bg-[#f5f2ff] text-[#783cf0] border-[#783cf0] font-semibold'
                : 'text-[#79716b] border-transparent hover:bg-[#f5f2ff] hover:text-[#783cf0]'
            }`}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function AuthorCard({ onViewAll }: { onViewAll: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e7e5e4] p-5 mb-5">
      <p className="font-nunito font-extrabold text-sm text-[#1c1917] mb-4">Written by</p>
      <div className="flex items-center gap-3 mb-3">
        <Avatar initials="SM" size={48} />
        <div>
          <p className="font-semibold text-sm text-[#1c1917]">Sarah Mitchell</p>
          <p className="text-xs text-[#79716b]">VCE English Specialist</p>
        </div>
      </div>
      <p className="text-[13px] leading-[1.6] text-[#57534d] mb-4">
        Sarah has helped over 2,000 VCE students improve their English scores through targeted text response coaching.
      </p>
      <button
        onClick={onViewAll}
        className="w-full py-2 rounded-lg border border-[#e7e5e4] font-medium text-[13px] text-[#57534d] cursor-pointer bg-white transition-colors hover:bg-[#f5f2ff] hover:text-[#783cf0] hover:border-[#dcd1ff]"
      >
        View all articles
      </button>
    </div>
  );
}

function ShareCard() {
  const [copied, setCopied] = useState(false);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    padding: '11px 16px', borderRadius: 10,
    border: '1px solid #e7e5e4',
    background: active ? 'rgba(120,60,240,0.07)' : '#fff',
    fontWeight: 500, fontSize: 13, color: '#783cf0',
    cursor: 'pointer', transition: 'background 0.15s', width: '100%',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e7e5e4] p-5 mt-5">
      <p className="font-nunito font-extrabold text-[15px] text-[#1c1917] mb-[5px]">Found this helpful?</p>
      <p className="text-[13px] text-[#79716b] mb-3.5 leading-[1.5]">Share with a classmate who needs it.</p>
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button style={btnStyle(false)} onClick={() => window.open('https://www.instagram.com/')}>
          <IconInstagram /> Instagram
        </button>
        <button
          style={btnStyle(false)}
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`)}
        >
          <IconLinkedIn /> LinkedIn
        </button>
      </div>
      {/* Row 2 */}
      <button style={btnStyle(copied)} onClick={handleCopy}>
        <IconCopyLink /> {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}

/* ── Related articles data ──────────────────────────────────────────── */
const RELATED = [
  { category: 'Study Tips',     gradient: 'linear-gradient(135deg,#dfe8ff,#a1b8ff)',          title: 'The Science of Spaced Repetition: Study Smarter, Not Harder', author: 'James Chen',    initials: 'JC', date: '14 Mar 2026', readTime: '6 min'  },
  { category: 'Exam Prep',      gradient: 'linear-gradient(135deg,#ffedd4 0%,#ea5a0c 90%)',   title: 'Managing Exam Anxiety: Strategies That Actually Work',         author: 'Dr. Lisa Park', initials: 'LP', date: '6 Mar 2026',  readTime: '7 min'  },
  { category: 'Subject Guides', gradient: 'linear-gradient(135deg,#d1faea 0%,#07947a 90%)',   title: 'VCE Math Methods: 5 Topics Every Student Struggles With',      author: 'Emma Torres',   initials: 'ET', date: '10 Mar 2026', readTime: '10 min' },
];

function RelatedCard({ article }: { article: (typeof RELATED)[number] }) {
  return (
    <Link
      href="/blog/vce-exam-preparation"
      className="block bg-white rounded-2xl border border-[#e7e5e4] overflow-hidden no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(120,60,240,0.1)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="h-[160px] relative" style={{ background: article.gradient }}>
        <div className="absolute top-3.5 left-3.5">
          <Badge category={article.category} white />
        </div>
      </div>
      <div className="px-5 pt-4 pb-5">
        <h3 className="font-nunito font-extrabold text-[15px] leading-[1.3] text-[#1c1917] mb-3 line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-2">
          <Avatar initials={article.initials} size={28} />
          <div className="flex-1">
            <p className="font-semibold text-[12px] text-[#292524]">{article.author}</p>
            <p className="text-[11px] text-[#a6a09b]">{article.date}</p>
          </div>
          <span className="font-medium text-[12px] text-[#a6a09b] whitespace-nowrap">{article.readTime} read</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Author Articles view ───────────────────────────────────────────── */
function AuthorArticlesPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Nav />
      <div className="bg-white border-b border-[#e7e5e4]">
        <div className="max-w-[1240px] mx-auto px-8 pt-10 pb-9">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 mb-7 bg-transparent border-none cursor-pointer text-[#79716b] text-[13px] p-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4l-4 4 4 4" stroke="#79716b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to article
          </button>
          <div className="flex items-center gap-5">
            <Avatar initials="SM" size={72} />
            <div>
              <h1 className="font-nunito font-extrabold text-[28px] text-[#1c1917] mb-1">Sarah Mitchell</h1>
              <p className="text-[15px] text-[#79716b]">VCE English Specialist · 12 articles</p>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-[1240px] mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6">
          {RELATED.map((a, i) => <RelatedCard key={i} article={a} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function BlogDetailPage() {
  const [view, setView] = useState<'article' | 'author-articles'>('article');
  const [activeSection, setActiveSection] = useState('why-matters');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    TOC_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (view === 'author-articles') {
    return <AuthorArticlesPage onBack={() => { setView('article'); window.scrollTo(0, 0); }} />;
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <Nav />

      {/* Article header */}
      <div className="bg-[#F5F5F5]">
        <div className="max-w-[1240px] mx-auto px-[50px] pt-10 pb-9">
          <div className="flex items-center gap-2.5 mb-5">
            <Badge category="Study Tips" size="lg" />
            <span
              className="font-medium text-sm text-white whitespace-nowrap px-[10px] py-[2px] rounded-md"
              style={{ background: '#79716b' }}
            >
              8 min read
            </span>
            <span
              className="font-medium text-sm text-white whitespace-nowrap px-[10px] py-[2px] rounded-md"
              style={{ background: '#79716b' }}
            >
              Year 12
            </span>
          </div>
          <h1 className="font-nunito font-extrabold text-[25px] leading-[1.22] text-[#1c1917] mb-4 max-w-[680px]">
            How to Ace Your VCE English: Text Response Strategies
          </h1>
          <div className="flex items-center gap-3">
            <Avatar initials="SM" size={36} />
            <div>
              <p className="font-semibold text-sm text-[#1c1917]">Sarah Mitchell</p>
              <p className="text-[13px] text-[#a6a09b]">18 Mar 2026 · 8 min read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero image
       * NOTE: Replace src with your actual asset path.
       * The design uses a sunset road photo with a frosted-glass "VCE A to Z" search pill.
       */}
      <div className="relative h-[320px] overflow-hidden bg-[#a1a1a1]">
        <Image
          src="/images/vce-hero.jpg"
          alt="VCE hero"
          fill
          className="object-cover"
          priority
        />
        {/* Frosted glass pill */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3.5 px-[31px] py-[26px] rounded-[60px]"
          style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(42px)', WebkitBackdropFilter: 'blur(42px)', width: 447 }}
        >
          {/* Search icon — replace with your search SVG asset */}
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="shrink-0">
            <circle cx="15" cy="15" r="8" stroke="#201b1b" strokeWidth="2"/>
            <path d="M21 21l5 5" stroke="#201b1b" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-[40px] font-bold text-[#201b1b] whitespace-nowrap leading-[1.34]">VCE A to Z</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1240px] mx-auto px-8 py-12">
        <div className="grid gap-12" style={{ gridTemplateColumns: '1fr 300px' }}>

          {/* Article body */}
          <article ref={contentRef} className="article-body">
            <div id="why-matters">
              <h2>Why Text Response Matters</h2>
              <p>
                In VCE English, the Text Response task is one of the most significant assessments you&apos;ll face.
                It tests not only your understanding of the text but your ability to construct a clear, persuasive,
                and sophisticated argument.
              </p>
              <div className="callout">
                <p><strong>Key insight:</strong> The difference between a 35 and a 45+ in English rarely comes down
                to knowing the text better — it comes down to knowing how to argue about it.</p>
              </div>
            </div>

            <div id="decode-prompt">
              <h2>Decoding the Prompt</h2>
              <p>Every prompt contains signals about what the examiner wants to see. Learn to identify the key directive words and thematic focus.</p>
            </div>

            <div id="contention">
              <h2>Building Your Contention</h2>
              <p>Your contention is the backbone of your essay. It should be specific, arguable, and sustained throughout your response.</p>
              <div className="tip">
                <p><strong>Pro tip:</strong> Write your contention before you outline your paragraphs — it will keep your argument focused.</p>
              </div>
            </div>

            <div id="structure">
              <h2>Essay Structure</h2>
              <p>A clear structure signals sophisticated thinking. Use topic sentences that link back to your contention.</p>
            </div>

            <div id="language">
              <h2>Using Language Effectively</h2>
              <p>Metalanguage, authorial intent, and precise textual evidence distinguish high-scoring responses.</p>
            </div>

            <div id="action-plan">
              <h2>Your Action Plan</h2>
              <ul>
                <li>Read your text twice before writing practice essays</li>
                <li>Practise writing contentions under timed conditions</li>
                <li>Seek feedback on your topic sentences</li>
                <li>Build a bank of precise quotations with analysis</li>
              </ul>
            </div>
          </article>

          {/* Sidebar */}
          <aside>
            <TableOfContents activeSection={activeSection} />
            <AuthorCard onViewAll={() => { setView('author-articles'); window.scrollTo(0, 0); }} />
            <ShareCard />
          </aside>
        </div>
      </div>

      {/* Related articles */}
      <div className="bg-white border-t border-[#e7e5e4] px-8 pt-20 pb-[110px]">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-nunito font-extrabold text-[22px] text-[#1c1917]">Related Articles</h2>
            <div className="flex-1 h-px bg-[#e7e5e4]" />
            <Link href="/blog" className="flex items-center gap-1.5 font-medium text-sm text-[#783cf0] whitespace-nowrap no-underline">
              View all
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#783cf0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {RELATED.map((article, i) => <RelatedCard key={i} article={article} />)}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
