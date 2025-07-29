import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductCard from '../ProductCard'

// Mock the stores
vi.mock('../../store/cartStore', () => ({
  useCartStore: () => ({
    addToCart: vi.fn(),
    updateQuantity: vi.fn(),
    getItemQuantity: vi.fn(() => 0),
  })
}));

vi.mock('../../store/userStore', () => ({
  useUserStore: () => ({
    wishlist: [],
    toggleWishlist: vi.fn(),
  })
}));

const mockProduct = {
  id: '1',
  name: 'Test Himalayan Product',
  price: 299,
  image: 'https://example.com/test-image.jpg',
  description: 'A test product from the Himalayas',
  quantityAvailable: 10,
  rating: 4.5,
  category: 'test'
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Himalayan Product')).toBeInTheDocument();
    expect(screen.getByText('₹299')).toBeInTheDocument();
    expect(screen.getByText('A test product from the Himalayas')).toBeInTheDocument();
  });

  it('displays product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Himalayan Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
  });

  it('shows "Add to Cart" button when quantity is 0', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('shows "Out of Stock" when quantity is 0', () => {
    const outOfStockProduct = { ...mockProduct, quantityAvailable: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('displays low stock warning when quantity is 5 or less', () => {
    const lowStockProduct = { ...mockProduct, quantityAvailable: 3 };
    render(<ProductCard product={lowStockProduct} />);
    
    expect(screen.getByText('Only 3 left in stock!')).toBeInTheDocument();
  });

  it('has a working "View Details" link', () => {
    render(<ProductCard product={mockProduct} />);
    
    const detailsLink = screen.getByText('View Details');
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink.closest('a')).toHaveAttribute('href', '#/products/1');
  });
});