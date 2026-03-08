import { Link, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { articles, deleteArticle } = useNews();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الخبر: "${title}"؟`)) {
      deleteArticle(id);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sortedArticles = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-primary-dark text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <div>
            <h1 className="font-bold text-lg">لوحة التحكم</h1>
            <p className="text-gray-300 text-xs">القرية الرياضية</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-secondary text-sm hover:text-white transition-colors">
            عرض الموقع
          </Link>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
            خروج
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'إجمالي الأخبار', value: articles.length, icon: '📰', color: 'bg-blue-500' },
            { label: 'أخبار عاجلة', value: articles.filter(a => a.isBreaking).length, icon: '🔴', color: 'bg-red-500' },
            { label: 'أخبار مميزة', value: articles.filter(a => a.isFeatured).length, icon: '⭐', color: 'bg-yellow-500' },
            { label: 'إجمالي المشاهدات', value: articles.reduce((s, a) => s + a.views, 0).toLocaleString('ar'), icon: '👁', color: 'bg-green-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
              <div className={`${stat.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs">{stat.label}</p>
                <p className="font-bold text-xl text-dark">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-dark">إدارة الأخبار</h2>
          <Link
            to="/admin/add"
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span>+</span> إضافة خبر جديد
          </Link>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">الصورة</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">العنوان</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">التصنيف</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">الكاتب</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">الحالة</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">المشاهدات</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedArticles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                      <p className="text-4xl mb-3">📰</p>
                      <p className="font-medium">لا توجد أخبار بعد. ابدأ بإضافة خبر جديد!</p>
                    </td>
                  </tr>
                )}
                {sortedArticles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-14 h-10 object-cover rounded-lg"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=100'; }}
                      />
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-medium text-dark line-clamp-2">{article.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{article.author}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {article.isBreaking && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">عاجل</span>
                        )}
                        {article.isFeatured && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">مميز</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{article.views.toLocaleString('ar')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/edit/${article.id}`}
                          className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
