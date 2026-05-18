import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import PrivateRoute from './components/ui/PrivateRoute';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import ProductForm from './pages/Products/ProductForm';
import Categories from './pages/Categories/Categories';
import Brands from './pages/Brands/Brands';
import Orders from './pages/Orders/Orders';
import Users from './pages/Users/Users';
import Blogs from './pages/Blogs/Blogs';
import BlogForm from './pages/Blogs/BlogForm';
import Reviews from './pages/Reviews/Reviews';
import Settings from './pages/Settings/Settings';
import NotFound from './pages/NotFound/NotFound';

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <Sidebar />
    <div className="admin-main">
      <Topbar />
      <main className="admin-content">{children}</main>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/" element={
          <PrivateRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/products" element={
          <PrivateRoute>
            <AdminLayout><Products /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/products/new" element={
          <PrivateRoute>
            <AdminLayout><ProductForm /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/products/:id" element={
          <PrivateRoute>
            <AdminLayout><ProductForm /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/categories" element={
          <PrivateRoute>
            <AdminLayout><Categories /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/brands" element={
          <PrivateRoute>
            <AdminLayout><Brands /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute>
            <AdminLayout><Orders /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/users" element={
          <PrivateRoute>
            <AdminLayout><Users /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/blogs" element={
          <PrivateRoute>
            <AdminLayout><Blogs /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/blogs/new" element={
          <PrivateRoute>
            <AdminLayout><BlogForm /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/blogs/:id" element={
          <PrivateRoute>
            <AdminLayout><BlogForm /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/reviews" element={
          <PrivateRoute>
            <AdminLayout><Reviews /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <AdminLayout><Settings /></AdminLayout>
          </PrivateRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
