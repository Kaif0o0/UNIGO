import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationToast from './components/NotificationToast'
import BottomNav from './components/BottomNav'
import Account from './pages/Account'
import Sell from './pages/Sell'
import Store from './pages/Store'
import Orders from './pages/Orders'
import Mentors from './pages/Mentors'
import MentorSession from './pages/MentorSession'
import Chat from './pages/Chat'
import Inbox from './pages/Inbox'
import Checkout from './pages/Checkout'
import MyGear from './pages/MyGear'
import StoreDashboard from './pages/StoreDashboard'
import ProductDetail from './pages/ProductDetail'

// Pages that should NOT show the bottom nav
const HIDE_NAV_PATHS = ['/chat/', '/product/'];

function AppContent() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.some(p => location.pathname.startsWith(p));

  // Pages that are full-screen and must NOT have pb-20 or the bottom nav
  const isFullScreen = ['/chat/', '/product/'].some(p => location.pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className={isFullScreen ? '' : 'flex-1 pb-20'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/store" element={<Store />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/session/:id" element={<MentorSession />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-gear" element={<MyGear />} />
          <Route path="/store-dashboard" element={<StoreDashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>

      {/* Global overlays */}
      <NotificationToast />
      {!isFullScreen && <BottomNav />}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        toastClassName="!rounded-2xl !font-black !text-[11px] !uppercase !tracking-widest"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
