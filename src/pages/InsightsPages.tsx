import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, Loader2, Inbox, Tag, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { getInsights, getInsightBySlug, type InsightRecord } from '@/lib/cms';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function InsightCard({ post, delay }: { post: InsightRecord; delay: number }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={`/insights/${post.slug}`}
        className="card-surface group block h-full p-7 transition-all duration-300 hover:border-accent-400/30 hover:bg-ink-800"
      >
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-accent-500/10 px-3 py-1 font-medium text-accent-400">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {formatDate(post.created_at)}
          </span>
        </div>
        <h2 className="mt-4 text-xl font-bold transition-colors duration-200 group-hover:text-accent-300">
          {post.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock size={12} /> {post.read_time} read
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Read article <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function InsightsPage() {
  const [posts, setPosts] = useState<InsightRecord[] | null>(null);

  useEffect(() => {
    getInsights().then(setPosts);
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Insights"
        title="Practical ideas for"
        highlight="growing businesses."
        description="Short, honest reads on social media strategy, content and local discovery — no fluff, no growth-hacking theater."
      />
      <section className="pb-24">
        <div className="container-page">
          {posts === null ? (
            <div className="flex justify-center py-16">
              <Loader2 size={28} className="animate-spin text-accent-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="card-surface flex flex-col items-center p-14 text-center">
              <Inbox size={32} className="text-slate-600" />
              <h2 className="mt-4 text-lg font-semibold">No insights published yet</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                We only publish articles we would want to read ourselves. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {posts.map((post, i) => (
                <InsightCard key={post.slug} post={post} delay={i * 80} />
              ))}
            </div>
          )}
          {posts !== null && posts.length > 0 && (
            <Reveal>
              <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Tag size={12} /> New articles added regularly
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}

export function InsightDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<InsightRecord | null | 'loading'>('loading');

  useEffect(() => {
    let active = true;
    getInsightBySlug(slug ?? '').then((p) => {
      if (active) setPost(p);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (post === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-32">
        <Loader2 size={28} className="animate-spin text-accent-400" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-32 text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-slate-400">The article you are looking for does not exist.</p>
        <Link to="/insights" className="btn-secondary mt-8">
          <ArrowLeft size={16} /> Back to insights
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <article className="container-page max-w-3xl">
        <Reveal>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> All insights
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-accent-500/10 px-3 py-1 font-medium text-accent-400">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={12} /> {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.read_time} read
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-bold sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">{post.excerpt}</p>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 space-y-5 border-t border-white/[0.06] pt-10">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed text-slate-300">
                {para}
              </p>
            ))}
          </div>
          <div className="card-surface mt-14 p-8 text-center">
            <h3 className="text-xl font-bold">Want help applying this?</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Book a free growth call and we will turn these ideas into a plan for your business.
            </p>
            <Link to="/growth-call" className="btn-primary mt-6">
              Book a growth call <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </article>
    </div>
  );
}
