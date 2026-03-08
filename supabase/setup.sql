-- ========================================
-- إعداد قاعدة بيانات القرية الرياضية
-- شغّل هذا الكود في Supabase SQL Editor
-- ========================================

-- إنشاء جدول الأخبار
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_breaking BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تفعيل Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بالقراءة
CREATE POLICY "Public read articles" ON articles
  FOR SELECT USING (true);

-- السماح للجميع بالكتابة (الحماية تتم عبر لوحة تحكم الموقع)
CREATE POLICY "Public insert articles" ON articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update articles" ON articles
  FOR UPDATE USING (true);

CREATE POLICY "Public delete articles" ON articles
  FOR DELETE USING (true);

-- ========================================
-- إعداد تخزين الصور (Storage)
-- ملاحظة: أنشئ الـ bucket يدوياً من Supabase Dashboard:
-- Storage → New bucket → اسم: article-images → Public: ON
-- ثم أضف هذه السياسة:
-- ========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

-- ========================================
-- بيانات تجريبية - احذفها إذا لم تحتجها
-- ========================================

INSERT INTO articles (title, summary, content, category, image_url, author, published_at, is_breaking, is_featured, views) VALUES
(
  'ريال مدريد يحقق فوزاً مثيراً في دوري أبطال أوروبا',
  'سجل ريال مدريد فوزاً درامياً في الدقائق الأخيرة أمام بايرن ميونخ بثلاثة أهداف مقابل هدفين.',
  'حقق فريق ريال مدريد فوزاً مثيراً على حساب بايرن ميونخ الألماني في دوري أبطال أوروبا بنتيجة 3-2.',
  'كرة القدم',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  'أحمد الخالد',
  '2026-03-08T10:00:00Z',
  true,
  true,
  0
),
(
  'المنتخب الوطني يستعد لبطولة كأس الأمم الأفريقية',
  'أعلن المنتخب الوطني عن قائمته الأولية لبطولة كأس الأمم الأفريقية.',
  'كشف المنتخب الوطني لكرة القدم عن القائمة الأولية للاعبيه المشاركين في بطولة كأس الأمم الأفريقية.',
  'كرة القدم',
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
  'محمد السعيد',
  '2026-03-07T14:30:00Z',
  false,
  true,
  0
),
(
  'نجم كرة السلة ليبرون جيمس يكسر رقماً قياسياً جديداً',
  'تجاوز ليبرون جيمس حاجز 45,000 نقطة في مسيرته مع لوس أنجلوس ليكرز.',
  'حقق نجم كرة السلة الأمريكي ليبرون جيمس إنجازاً تاريخياً جديداً، إذ تجاوز حاجز 45,000 نقطة في مسيرته.',
  'كرة السلة',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'سارة العلي',
  '2026-03-07T09:00:00Z',
  false,
  false,
  0
);
