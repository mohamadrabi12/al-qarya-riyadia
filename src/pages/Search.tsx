import { useSearchParams } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import NewsCard from '../components/NewsCard';

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const { articles } = useNews();

  const results = articles.filter(a =>
    a.title.includes(query) ||
    a.summary.includes(query) ||
    a.content.includes(query)
  );

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="section-title">
        نتائج البحث عن: <span className="text-primary">{query}</span>
      </h1>
      <p className="text-gray-500 mb-6">وجدنا {results.length} نتيجة</p>

      {results.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl font-medium">لا توجد نتائج لبحثك</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(a => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </main>
  );
}
