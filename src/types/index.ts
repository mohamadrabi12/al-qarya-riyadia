export type Category = 'كرة القدم' | 'كرة السلة' | 'التنس' | 'السباحة' | 'الملاكمة' | 'غيرها';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  imageUrl: string;
  author: string;
  publishedAt: string;
  isBreaking: boolean;
  isFeatured: boolean;
  views: number;
}

export interface Admin {
  username: string;
  password: string;
}
