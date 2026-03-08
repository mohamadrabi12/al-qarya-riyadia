import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark border-2 border-accent-dark">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="leading-tight">
                <h3 className="font-black text-xl leading-none" style={{color: '#ffd700'}}>القرية</h3>
                <h3 className="font-black text-xl leading-none text-white">الرياضية</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              موقعكم الأول للأخبار الرياضية العربية والعالمية، نقدم لكم أحدث الأخبار والتقارير والتحليلات الرياضية.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61585493021459"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1877f2] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#166fe5] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              القرية الرياضية على فيسبوك
            </a>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-accent mb-4 text-lg">التصنيفات</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['كرة القدم', 'كرة السلة', 'التنس', 'السباحة', 'الملاكمة'].map(cat => (
                <li key={cat}>
                  <Link to={`/category/${cat}`} className="hover:text-accent transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-accent mb-4 text-lg">تواصل معنا</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61585493021459"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#1877f2] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  القرية الرياضية
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <a href="https://wa.me/9720547876305" className="hover:text-green-400 transition-colors">
                  0547876305
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <a
                  href="https://whatsapp.com/channel/0029VbBnK582UPBOMI0OFo1D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  قناة الواتساب
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© 2026 القرية الرياضية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
