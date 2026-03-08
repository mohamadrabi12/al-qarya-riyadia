import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';
import type { Category } from '../types';
import { Link } from 'react-router-dom';

const CATEGORIES: Category[] = ['كرة القدم', 'كرة السلة', 'التنس', 'الملاكمة'];

const CATEGORY_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  'كرة القدم': { icon: '⚽', color: 'text-green-700', bg: 'bg-green-50 hover:bg-green-100 border-green-200' },
  'كرة السلة': { icon: '🏀', color: 'text-orange-700', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  'التنس': { icon: '🎾', color: 'text-yellow-700', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  'السباحة': { icon: '🏊', color: 'text-blue-700', bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  'الملاكمة': { icon: '🥊', color: 'text-red-700', bg: 'bg-red-50 hover:bg-red-100 border-red-200' },
  'غيرها': { icon: '🏅', color: 'text-gray-700', bg: 'bg-gray-50 hover:bg-gray-100 border-gray-200' },
};

export default function Home() {
  const { articles, getFeaturedArticles } = useNews();
  const featured = getFeaturedArticles();
  const latest = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const hero = featured[0];
  const secondaryFeatured = featured.slice(1, 3);
  const latestNews = latest.slice(0, 6);

  const allCategories = ['كرة القدم', 'كرة السلة', 'التنس', 'السباحة', 'الملاكمة', 'غيرها'] as const;

  return (
    <main className="container mx-auto px-4 py-6">

      {/* Categories Quick-Nav */}
      <section className="mb-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {allCategories.map(cat => {
            const cfg = CATEGORY_ICONS[cat];
            const count = articles.filter(a => a.category === cat).length;
            return (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${cfg.bg}`}
              >
                <span className="text-3xl">{cfg.icon}</span>
                <span className={`text-xs font-black ${cfg.color} text-center leading-tight`}>{cat}</span>
                {count > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 ${cfg.color}`}>
                    {count} خبر
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hero Section */}
      {hero && (
        <section className="mb-8">
          <h2 className="section-title">الخبر الرئيسي</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <NewsCard article={hero} size="large" />
            </div>
            <div className="flex flex-col gap-4">
              {secondaryFeatured.map(a => (
                <NewsCard key={a.id} article={a} size="medium" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">آخر الأخبار</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNews.map(a => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      {CATEGORIES.map(cat => {
        const catArticles = articles.filter(a => a.category === cat).slice(0, 3);
        if (catArticles.length === 0) return null;
        const cfg = CATEGORY_ICONS[cat];
        return (
          <section key={cat} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">
                <span className="ml-2">{cfg.icon}</span>{cat}
              </h2>
              <Link
                to={`/category/${cat}`}
                className="text-primary font-bold text-sm hover:text-primary-dark transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md"
              >
                المزيد ←
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-r-4 border-primary">
              {catArticles.map(a => (
                <NewsCard key={a.id} article={a} size="small" />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
