const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Notes', 'Books', 'Test-Series', 'Question Bank']
  },
  price: { 
    type: Number, 
    required: true 
  },
  pdfUrl: { 
    type: String, 
    required: false 
  },
  thumbnailUrl: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Product', productSchema);
