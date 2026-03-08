import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { supabase } from '../../lib/supabase';
import type { Category, NewsArticle } from '../../types';

const CATEGORIES: Category[] = ['كرة القدم', 'كرة السلة', 'التنس', 'السباحة', 'الملاكمة', 'غيرها'];

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

async function uploadImageToStorage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  const { data: urlData } = supabase.storage
    .from('article-images')
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}

export default function NewsForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { addArticle, updateArticle, getArticleById } = useNews();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
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
        setImagePreview(article.imageUrl);
      } else {
        setNotFound(true);
      }
    }
  }, [id, isEdit, getArticleById]);

  // cleanup object URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setError('');
  }, []);

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن يكون أقل من 5 ميغابايت');
      return;
    }
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setForm(prev => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

    setIsSubmitting(true);
    try {
      let imageUrl = form.imageUrl;

      // upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImageToStorage(imageFile);
      }

      const articleData: Omit<NewsArticle, 'id' | 'views'> = {
        ...form, title, summary, content, author, imageUrl,
        publishedAt: new Date(form.publishedAt).toISOString(),
      };

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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">صورة الخبر</label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 left-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-700 transition-colors shadow-md"
                  title="حذف الصورة"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 left-2 bg-white/90 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors shadow-md border border-gray-200"
                >
                  تغيير الصورة
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                }`}
              >
                <span className="text-4xl mb-2">📷</span>
                <p className="text-sm font-medium text-gray-600">اضغط لرفع صورة أو اسحبها هنا</p>
                <p className="text-xs text-gray-400 mt-1">PNG، JPG، WEBP - حتى 5MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
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
