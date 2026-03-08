import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { NewsArticle, Category } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sampleNews } from '../data/sampleNews';

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  addArticle: (article: Omit<NewsArticle, 'id' | 'views'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<NewsArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  getArticleById: (id: string) => NewsArticle | undefined;
  getArticlesByCategory: (category: Category) => NewsArticle[];
  getFeaturedArticles: () => NewsArticle[];
  getBreakingNews: () => NewsArticle[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);
const STORAGE_KEY = 'al-qarya-news';

type DbRow = Record<string, unknown>;

function dbToArticle(row: DbRow): NewsArticle {
  return {
    id: row.id as string,
    title: row.title as string,
    summary: row.summary as string,
    content: row.content as string,
    category: row.category as Category,
    imageUrl: (row.image_url as string) || '',
    author: row.author as string,
    publishedAt: row.published_at as string,
    isBreaking: row.is_breaking as boolean,
    isFeatured: row.is_featured as boolean,
    views: row.views as number,
  };
}

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : sampleNews;
    }
    return [];
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // localStorage sync when Supabase not configured
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    }
  }, [articles]);

  const fetchArticles = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });
    if (!error && data) {
      setArticles(data.map(dbToArticle));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) fetchArticles();
  }, [fetchArticles]);

  const addArticle = async (article: Omit<NewsArticle, 'id' | 'views'>) => {
    if (!isSupabaseConfigured) {
      const newArticle: NewsArticle = { ...article, id: Date.now().toString(), views: 0 };
      setArticles(prev => [newArticle, ...prev]);
      return;
    }
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        summary: article.summary,
        content: article.content,
        category: article.category,
        image_url: article.imageUrl,
        author: article.author,
        published_at: article.publishedAt,
        is_breaking: article.isBreaking,
        is_featured: article.isFeatured,
        views: 0,
      }])
      .select()
      .single();
    if (!error && data) {
      setArticles(prev => [dbToArticle(data as DbRow), ...prev]);
    }
  };

  const updateArticle = async (id: string, updated: Partial<NewsArticle>) => {
    if (!isSupabaseConfigured) {
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
      return;
    }
    const db: DbRow = {};
    if (updated.title !== undefined) db.title = updated.title;
    if (updated.summary !== undefined) db.summary = updated.summary;
    if (updated.content !== undefined) db.content = updated.content;
    if (updated.category !== undefined) db.category = updated.category;
    if (updated.imageUrl !== undefined) db.image_url = updated.imageUrl;
    if (updated.author !== undefined) db.author = updated.author;
    if (updated.publishedAt !== undefined) db.published_at = updated.publishedAt;
    if (updated.isBreaking !== undefined) db.is_breaking = updated.isBreaking;
    if (updated.isFeatured !== undefined) db.is_featured = updated.isFeatured;
    if (updated.views !== undefined) db.views = updated.views;
    const { error } = await supabase.from('articles').update(db).eq('id', id);
    if (!error) {
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    }
  };

  const deleteArticle = async (id: string) => {
    if (!isSupabaseConfigured) {
      setArticles(prev => prev.filter(a => a.id !== id));
      return;
    }
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const getArticleById = (id: string) => articles.find(a => a.id === id);
  const getArticlesByCategory = (category: Category) => articles.filter(a => a.category === category);
  const getFeaturedArticles = () => articles.filter(a => a.isFeatured);
  const getBreakingNews = () => articles.filter(a => a.isBreaking);

  return (
    <NewsContext.Provider value={{
      articles, loading,
      addArticle, updateArticle, deleteArticle,
      getArticleById, getArticlesByCategory, getFeaturedArticles, getBreakingNews,
    }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within NewsProvider');
  return context;
}
