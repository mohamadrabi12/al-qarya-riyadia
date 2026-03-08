import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import BreakingNewsBar from './components/BreakingNewsBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Article from './pages/Article';
import Category from './pages/Category';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsForm from './pages/admin/NewsForm';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreakingNewsBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NewsProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/article/:id" element={<PublicLayout><Article /></PublicLayout>} />
              <Route path="/category/:name" element={<PublicLayout><Category /></PublicLayout>} />
              <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/add" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
              <Route path="/admin/edit/:id" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </NewsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
