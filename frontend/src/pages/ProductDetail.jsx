import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Star, ShoppingBag, Zap, CheckCircle } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (!product) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
        .then(({ data }) => setProduct(data))
        .catch(() => toast.error('Could not load product'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center bg-white" style={{ position: 'fixed', inset: 0 }}>
      <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center bg-white gap-3 font-sans" style={{ position: 'fixed', inset: 0 }}>
      <p className="text-xs font-black uppercase tracking-widest text-black/30">Not found</p>
      <button onClick={() => navigate('/store')} className="text-xs font-black underline">Back to Store</button>
    </div>
  );

  const cartItem = {
    id: product._id || product.id,
    title: product.title,
    price: product.price,
    image: product.thumbnailUrl || product.image,
  };

  return (
    /* CSS Grid: header=auto, scroll area=1fr, footer=auto
       1fr fills EXACTLY the remaining space — no flex min-height bugs */
    <div
      className="bg-white font-sans text-black"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      {/* ── Row 1: Header ── */}
      <div className="flex items-center px-4 py-3 border-b border-black/5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* ── Row 2: Scrollable content (1fr) ── */}
      <div style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>
        <div className="max-w-lg mx-auto">

          {/* Image */}
          <div className="w-full flex items-center justify-center pt-8 pb-4 bg-gray-50">
            <div className="w-44 h-44 rounded-3xl overflow-hidden bg-white shadow flex items-center justify-center">
              <img
                src={product.thumbnailUrl || product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Info */}
          <div className="px-5 py-5 space-y-4">

            {product.category && (
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-black/30">
                {product.category} · {product.seller?.name || 'UniGo Seller'}
              </p>
            )}

            <h1 className="text-lg font-bold leading-snug">{product.title}</h1>

            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
              ))}
              <span className="text-[11px] text-black/40 font-semibold ml-1">{product.rating || '4.0'}</span>
            </div>

            <div className="h-px bg-black/5" />

            <div className="space-y-1">
              {product.oldPrice && (
                <p className="text-xs text-black/30 line-through">M.R.P. ₹{product.oldPrice}</p>
              )}
              <p className="text-3xl font-black tracking-tight">₹{product.price}</p>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-wide">Inclusive of all taxes</p>
            </div>

            <div className="h-px bg-black/5" />

            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-600">In Stock</p>
                <p className="text-xs text-black/40">Instant digital access after purchase</p>
              </div>
            </div>

            {product.description && (
              <p className="text-sm text-black/50 leading-relaxed">{product.description}</p>
            )}

          </div>
        </div>
      </div>

      {/* ── Row 3: CTA footer (auto) — always at the bottom ── */}
      <div
        className="border-t border-black/5 px-5 pt-3"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))', background: '#fff' }}
      >
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={() => { addToCart(cartItem); toast.success('Added to bag!', { icon: '🛍️' }); }}
            className="flex-1 flex items-center justify-center gap-2 bg-unigo-green text-black font-black py-4 rounded-2xl text-sm uppercase tracking-widest active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Bag
          </button>
          <button
            onClick={() => { addToCart(cartItem); navigate('/checkout'); }}
            className="flex-1 flex items-center justify-center gap-2 bg-unigo-black text-unigo-green font-black py-4 rounded-2xl text-sm uppercase tracking-widest active:scale-95 transition-transform"
          >
            <Zap className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
