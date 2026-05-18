import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Blog from './pages/Blog/Blog';
import Service from './pages/Service/Service';
import Cart from './pages/Cart/Cart';
import TrackOrder from './pages/TrackOrder/TrackOrder';
import Checkout from './pages/Checkout/Checkout';
import BlogDetail from './pages/Blog/BlogDetail';
import Wishlist from './pages/Wishlist/Wishlist';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import CompareBar from './components/ui/CompareBar';
import CompareModal from './components/ui/CompareModal';
import AIChatWidget from './components/ui/AIChatWidget';
import PaymentPending from './pages/PaymentPending/PaymentPending';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/service" element={<Service />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/pending" element={<PaymentPending />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
        <CompareBar />
        <CompareModal />
        <AIChatWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;