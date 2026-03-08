import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const { getArticleById, updateArticle, articles } = useNews();
  const article = getArticleById(id!);

  useEffect(() => {
    if (id) {
      const current = getArticleById(id);
      if (current) {
        updateArticle(current.id, { views: current.views + 1 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-500">الخبر غير موجود</h2>
        <Link to="/" className="btn-primary inline-block mt-4">العودة للرئيسية</Link>
      </div>
    );
  }

  const related = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article */}
        <article className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-72 object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800'; }}
            />
            <div className="p-6">
              {article.isBreaking && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 inline-block">عاجل</span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <Link
                  to={`/category/${article.category}`}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  {article.category}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-dark leading-tight mb-4">
                {article.title}
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-4 border-r-4 border-secondary pr-4 bg-gray-50 p-3 rounded">
                {article.summary}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-4 border-b border-gray-100">
                <span>✍️ {article.author}</span>
                <span>📅 {formatDate(article.publishedAt)}</span>
                <span>👁 {article.views.toLocaleString('ar')} مشاهدة</span>
              </div>
              <div className="prose prose-lg max-w-none text-dark leading-loose whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          {related.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="section-title text-lg">أخبار ذات صلة</h3>
              {related.map(a => (
                <NewsCard key={a.id} article={a} size="small" />
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
