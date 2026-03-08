import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
        <span className="text-8xl font-black text-primary">404</span>
        <p className="text-6xl mt-2">⚽</p>
        <h2 className="text-2xl font-bold text-dark mt-4 mb-2">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
