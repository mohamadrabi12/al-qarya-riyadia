import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import type { Category, NewsArticle } from '../../types';

const CATEGORIES: Category[] = ['كرة القدم', 'كرة السلة', 'التنس', 'السباحة', 'الملاكمة', 'غيرها'];

function isValidImageUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const DEFAULT_FORM = {
  title: '',
  summary: '',
  content: '',
  category: 'كرة القدم' as Category,
  imageUrl: '',
  author: '',
  isBreaking: false,
  isFeatured: false,
  publishedAt: new Date().toISOString().slice(0, 16),
};

export default function NewsForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { addArticle, updateArticle, getArticleById } = useNews();
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const article = getArticleById(id);
      if (article) {
        setForm({
          title: article.title,
          summary: article.summary,
          content: article.content,
          category: article.category,
          imageUrl: article.imageUrl,
          author: article.author,
          isBreaking: article.isBreaking,
          isFeatured: article.isFeatured,
          publishedAt: article.publishedAt.slice(0, 16),
        });
      } else {
        setNotFound(true);
      }
    }
  }, [id, isEdit, getArticleById]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const title = form.title.trim();
    const summary = form.summary.trim();
    const content = form.content.trim();
    const author = form.author.trim();

    if (!title || !summary || !content || !author) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (title.length < 5) {
      setError('عنوان الخبر يجب أن يكون 5 أحرف على الأقل');
      return;
    }
    if (form.imageUrl && !isValidImageUrl(form.imageUrl)) {
      setError('رابط الصورة غير صحيح. يجب أن يبدأ بـ https:// أو http://');
      return;
    }

    setIsSubmitting(true);
    const articleData: Omit<NewsArticle, 'id' | 'views'> = {
      ...form, title, summary, content, author,
      publishedAt: new Date(form.publishedAt).toISOString(),
    };
    try {
      if (isEdit && id) {
        await updateArticle(id, articleData);
      } else {
        await addArticle(articleData);
      }
      navigate('/admin');
    } catch {
      setError('حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
          <span className="text-5xl">📰</span>
          <h2 className="text-xl font-bold text-dark mt-4 mb-2">الخبر غير موجود</h2>
          <Link to="/admin" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors mt-2">
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-dark text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚽</span>
          <h1 className="font-bold text-lg">{isEdit ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h1>
        </div>
        <Link to="/admin" className="text-secondary text-sm hover:text-white transition-colors">
          ← العودة للوحة التحكم
        </Link>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              عنوان الخبر <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="أدخل عنوان الخبر..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                التصنيف <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                اسم الكاتب <span className="text-red-500">*</span>
              </label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="اسم الصحفي..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              رابط الصورة
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                form.imageUrl && !isValidImageUrl(form.imageUrl)
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-gray-300 focus:border-primary'
              }`}
            />
            {form.imageUrl && !isValidImageUrl(form.imageUrl) && (
              <p className="text-red-500 text-xs mt-1">⚠️ الرابط غير صحيح. يجب أن يبدأ بـ https://</p>
            )}
            {form.imageUrl && isValidImageUrl(form.imageUrl) && (
              <img
                src={form.imageUrl}
                alt="preview"
                className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ملخص الخبر <span className="text-red-500">*</span>
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={3}
              placeholder="ملخص قصير للخبر..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              محتوى الخبر <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              placeholder="اكتب تفاصيل الخبر هنا..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">تاريخ النشر</label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={form.publishedAt}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isBreaking"
                checked={form.isBreaking}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
              />
              <span className="font-medium text-sm">خبر عاجل 🔴</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 accent-yellow-500"
              />
              <span className="font-medium text-sm">خبر مميز ⭐</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري الحفظ...' : (isEdit ? 'حفظ التعديلات' : 'نشر الخبر')}
            </button>
            <Link
              to="/admin"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
