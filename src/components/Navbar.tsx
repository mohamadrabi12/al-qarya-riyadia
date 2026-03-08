import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = [
  { label: 'كرة القدم', path: '/category/كرة القدم', icon: '⚽' },
  { label: 'كرة السلة', path: '/category/كرة السلة', icon: '🏀' },
  { label: 'التنس', path: '/category/التنس', icon: '🎾' },
  { label: 'السباحة', path: '/category/السباحة', icon: '🏊' },
  { label: 'الملاكمة', path: '/category/الملاكمة', icon: '🥊' },
  { label: 'غيرها', path: '/category/غيرها', icon: '🏅' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-2xl">
      {/* Top bar */}
      <div style={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0d47a1 100%)' }} className="py-2.5 border-b border-blue-800">
        <div className="container mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full shadow-lg border-2 border-yellow-400 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #ffd700, #f9a825)' }}>
              <span className="text-xl">⚽</span>
            </div>
            <div className="leading-tight">
              <div className="flex items-baseline gap-1">
                <span className="font-black text-xl" style={{ color: '#ffd700', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>القرية</span>
                <span className="font-black text-xl text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>الرياضية</span>
              </div>
              <p className="text-blue-200 text-xs font-medium">أخبار الرياضة العربية</p>
            </div>
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن الأخبار..."
                className="px-4 py-2 pr-10 rounded-lg text-dark text-sm outline-none w-64 border-2 border-transparent focus:border-yellow-400 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            </div>
            <button type="submit" className="bg-yellow-400 text-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors shadow-md">
              بحث
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Facebook link */}
            <a
              href="https://www.facebook.com/profile.php?id=61585493021459"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-[#1877f2] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#166fe5] transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              فيسبوك
            </a>

            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-yellow-400 text-sm font-bold hover:text-white transition-colors">
                  لوحة التحكم
                </Link>
                <button onClick={logout} className="text-blue-200 text-sm hover:text-white transition-colors">
                  خروج
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="text-yellow-400 text-xs font-bold hover:text-white transition-colors">
                دخول المشرف
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div style={{ background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)' }} className="border-b-2 border-red-600">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center gap-0.5 py-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all font-bold text-sm flex items-center gap-1.5 ${
                isActive('/') ? 'bg-red-600 text-white shadow-md' : 'text-white hover:bg-white/10'
              }`}
            >
              🏠 الرئيسية
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`px-4 py-2 rounded-lg transition-all font-bold text-sm flex items-center gap-1.5 ${
                  isActive(cat.path) ? 'bg-red-600 text-white shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>

          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between py-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="القائمة"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`}></span>
              </div>
            </button>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث..."
                className="px-3 py-1.5 rounded-lg text-dark text-sm outline-none w-36 border-2 border-transparent focus:border-yellow-400 transition-colors"
              />
              <button type="submit" className="bg-yellow-400 text-dark px-3 py-1.5 rounded-lg font-bold text-sm">
                🔍
              </button>
            </form>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-3 border-t border-white/20 mt-1">
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium">
                🏠 الرئيسية
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-white px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium"
                >
                  {cat.icon} {cat.label}
                </Link>
              ))}
              <a
                href="https://www.facebook.com/profile.php?id=61585493021459"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors font-medium"
              >
                <svg className="w-4 h-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                القرية الرياضية على فيسبوك
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
