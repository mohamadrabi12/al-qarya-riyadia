import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { NewsArticle, Category } from '../types';
import { sampleNews } from '../data/sampleNews';

interface NewsContextType {
  articles: NewsArticle[];
  addArticle: (article: Omit<NewsArticle, 'id' | 'views'>) => void;
  updateArticle: (id: string, article: Partial<NewsArticle>) => void;
  deleteArticle: (id: string) => void;
  getArticleById: (id: string) => NewsArticle | undefined;
  getArticlesByCategory: (category: Category) => NewsArticle[];
  getFeaturedArticles: () => NewsArticle[];
  getBreakingNews: () => NewsArticle[];
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const STORAGE_KEY = 'al-qarya-news';

export function NewsProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : sampleNews;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const addArticle = (article: Omit<NewsArticle, 'id' | 'views'>) => {
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      views: 0,
    };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updated: Partial<NewsArticle>) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const getArticleById = (id: string) => articles.find(a => a.id === id);

  const getArticlesByCategory = (category: Category) =>
    articles.filter(a => a.category === category);

  const getFeaturedArticles = () => articles.filter(a => a.isFeatured);

  const getBreakingNews = () => articles.filter(a => a.isBreaking);

  return (
    <NewsContext.Provider value={{
      articles,
      addArticle,
      updateArticle,
      deleteArticle,
      getArticleById,
      getArticlesByCategory,
      getFeaturedArticles,
      getBreakingNews,
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
