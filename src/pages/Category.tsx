import { useParams } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import type { Category as CategoryType } from '../types';
import NewsCard from '../components/NewsCard';

export default function Category() {
  const { name } = useParams<{ name: string }>();
  const { getArticlesByCategory } = useNews();
  const articles = getArticlesByCategory(name as CategoryType);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="section-title text-2xl">{name}</h1>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">📰</p>
          <p className="text-xl font-medium">لا توجد أخبار في هذا التصنيف بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(a => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
