# Ramro - Himalayan E-commerce Platform

## 🏔️ About Ramro

Ramro is a premium e-commerce platform showcasing authentic Himalayan products including handcrafted goods, organic foods, and traditional items. Our mission is to connect global customers with local Himalayan artisans while preserving cultural heritage and supporting sustainable communities.

## ✨ Features

### Core E-commerce
- **Smart Shopping Cart** - Persistent cart with quantity controls
- **Product Catalog** - Advanced filtering and search
- **Multi-Currency Support** - USD, EUR, INR, NPR, CNY
- **Secure Checkout** - Multiple payment methods
- **User Accounts** - Profile management and order history

### Himalayan-Specific Features
- **Artisan Profiles** - Stories and backgrounds of local creators
- **Origin Verification** - GPS tracking and authenticity certificates
- **Cultural Context** - Educational content about products and regions
- **Multi-Language Support** - English, Hindi, Nepali, Tibetan
- **Seasonal Availability** - Weather and altitude-based product availability

### Technical Features
- **Progressive Web App** - Offline browsing capabilities
- **Responsive Design** - Optimized for all devices
- **Performance Optimized** - Fast loading with image optimization
- **Accessibility Compliant** - WCAG 2.1 AA standards

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ramro.git
   cd ramro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router** - Client-side routing

### Backend & Services
- **Firebase** - Authentication and database
- **Stripe** - Payment processing
- **Cloudinary** - Image management
- **Supabase** - Database and real-time features

### Development Tools
- **ESLint** - Code linting
- **Cypress** - E2E testing
- **TypeScript** - Type safety (optional)

## 📁 Project Structure

```
ramro/
├── public/                 # Static assets
│   ├── images/            # Product and marketing images
│   └── favicon.ico        # Site favicon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── AddToCartButton.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── Cart.jsx
│   │   └── ...
│   ├── store/            # State management
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── ...
│   ├── data/             # Static data and configurations
│   ├── utils/            # Utility functions
│   ├── firebase/         # Firebase configuration
│   └── index.css         # Global styles
├── cypress/              # E2E tests
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--himalayan-primary: #2D5A27    /* Deep Forest Green */
--himalayan-secondary: #8B4513  /* Mountain Earth Brown */
--himalayan-accent: #CD853F     /* Warm Sandstone */

/* Interactive Elements */
--button-primary: #1B4332       /* Dark Pine Green */
--button-hover: #2D5A27         /* Lighter on hover */

/* Status Colors */
--success: #27AE60              /* Natural green */
--warning: #F39C12              /* Sunset orange */
--error: #E74C3C                /* Mountain sunset red */
```

### Typography
- **Primary**: Inter (clean, international readability)
- **Display**: Playfair Display (elegant headers)
- **Cultural**: Noto Sans Devanagari (Hindi/Nepali support)

## 🧪 Testing

### Run E2E Tests
```bash
npm run cy:open
```

### Test Coverage
- User authentication flow
- Shopping cart functionality
- Product browsing and search
- Checkout process
- Admin panel operations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Himalayan artisans and communities
- Open source contributors
- Cultural consultants and advisors
- Beta testers and early adopters

## 📞 Support

- **Email**: support@ramro.com
- **Documentation**: [docs.ramro.com](https://docs.ramro.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/ramro/issues)

---

Made with ❤️ for the Himalayan community