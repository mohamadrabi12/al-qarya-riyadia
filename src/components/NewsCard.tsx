import { Link } from 'react-router-dom';
import type { NewsArticle } from '../types';

interface Props {
  article: NewsArticle;
  size?: 'large' | 'medium' | 'small';
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const categoryConfig: Record<string, { bg: string; text: string; border: string }> = {
  'كرة القدم': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-r-4 border-green-500' },
  'كرة السلة': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-r-4 border-orange-500' },
  'التنس': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-r-4 border-yellow-500' },
  'السباحة': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-r-4 border-blue-500' },
  'الملاكمة': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-r-4 border-red-500' },
  'غيرها': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-r-4 border-gray-400' },
};

function getCategoryConfig(cat: string) {
  return categoryConfig[cat] || categoryConfig['غيرها'];
}

export default function NewsCard({ article, size = 'medium' }: Props) {
  const config = getCategoryConfig(article.category);

  if (size === 'large') {
    return (
      <Link to={`/article/${article.id}`} className="card group block">
        <div className="relative overflow-hidden" style={{ height: '340px' }}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {article.isBreaking && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg pulse-badge">
              ⚡ عاجل
            </span>
          )}
          <div className="absolute bottom-0 p-5 text-white w-full">
            <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-md ${config.bg} ${config.text}`}>
              {article.category}
            </span>
            <h2 className="text-xl font-black leading-tight mb-2 group-hover:text-yellow-300 transition-colors">{article.title}</h2>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">{article.summary}</p>
            <div className="flex items-center gap-3 text-gray-400 text-xs border-t border-white/20 pt-3">
              <span>✍️ {article.author}</span>
              <span>•</span>
              <span>📅 {formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>👁 {article.views.toLocaleString('ar')}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (size === 'small') {
    return (
      <Link
        to={`/article/${article.id}`}
        className={`flex gap-3 group py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors ${config.border}`}
      >
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-20 h-16 object-cover rounded-lg shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200'; }}
        />
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>{article.category}</span>
          <h3 className="text-sm font-bold text-dark group-hover:text-primary transition-colors line-clamp-2 mt-1 leading-snug">{article.title}</h3>
          <span className="text-xs text-gray-400 mt-1 block">📅 {formatDate(article.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} className="card group block hover:-translate-y-1 transition-all duration-300">
      <div className="relative overflow-hidden h-48">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {article.isBreaking && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-md pulse-badge">⚡ عاجل</span>
        )}
        <span className={`absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${config.bg} ${config.text}`}>
          {article.category}
        </span>
      </div>
      <div className={`p-4 ${config.border}`}>
        <h3 className="font-black text-dark group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug text-sm">
          {article.title}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{article.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <span className="font-medium">✍️ {article.author}</span>
          <span>📅 {formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
