import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Home, Store, PlusCircle, ShoppingCart, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const path = location.pathname;
  const active = (p) => path === p || (p !== '/' && path.startsWith(p));

  const NavBtn = ({ to, icon: Icon, label }) => {
    const isActive = active(to);
    return (
      <button
        onClick={() => navigate(to)}
        style={{ flex: 1 }}
        className="flex flex-col items-center justify-center gap-1 py-2 bg-transparent border-0 cursor-pointer"
      >
        <Icon
          size={22}
          className={isActive ? 'text-black' : 'text-gray-400'}
          strokeWidth={isActive ? 2.5 : 1.8}
        />
        <span
          className={`text-[10px] font-bold uppercase tracking-wide ${
            isActive ? 'text-black' : 'text-gray-400'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center w-full max-w-lg px-1 pt-1.5 pb-2">

        <NavBtn to="/" icon={Home} label="Home" />
        <NavBtn to="/store" icon={Store} label="Store" />

        {/* Raised Sell button */}
        <button
          onClick={() => navigate(user ? '/sell' : '/account')}
          style={{ flex: 1 }}
          className="flex flex-col items-center justify-center bg-transparent border-0 cursor-pointer"
        >
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 48,
              height: 48,
              backgroundColor: '#90EE90',
              marginTop: -20,
              border: '3px solid white',
              boxShadow: '0 4px 14px rgba(144,238,144,0.6)',
            }}
          >
            <PlusCircle size={22} className="text-black" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mt-0.5">
            Sell
          </span>
        </button>

        <NavBtn to="/cart" icon={ShoppingCart} label="Cart" />
        <NavBtn to="/account" icon={User} label="Account" />

      </div>
    </nav>
  );
};

export default BottomNav;
