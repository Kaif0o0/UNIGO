import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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

// Pages that should NOT show the bottom nav
const HIDE_NAV_PATHS = ['/chat/'];

function AppContent() {
  const location = useLocation();
  const hideNav = HIDE_NAV_PATHS.some(p => location.pathname.startsWith(p));

  return (
    // Outer shell: full-height flex column — this is the layout anchor
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Page content scrolls inside here; pb-20 reserves space for the fixed bottom nav */}
      <main className="flex-1 pb-20">
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
        </Routes>
      </main>

      {/* Global overlays — always outside page content */}
      <NotificationToast />
      {!hideNav && <BottomNav />}
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
