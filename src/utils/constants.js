// Application Constants
export const CONTACT_INFO = {
  email: {
    support: 'support@ramro.com',
    hello: 'hello@ramro.com'
  },
  phone: {
    nepal: '+977 1 234 5678',
    international: '+1 (555) 123-4567'
  },
  address: {
    street: 'Thamel, Kathmandu',
    country: 'Nepal',
    postalCode: '44600'
  }
};

export const BUSINESS_HOURS = {
  weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM (NPT)',
  saturday: 'Saturday: 10:00 AM - 4:00 PM (NPT)',
  sunday: 'Sunday: Closed'
};

export const SHIPPING_INFO = {
  freeShippingThreshold: 500,
  domesticDelivery: '3-7 business days',
  internationalDelivery: '7-14 business days',
  processingTime: '2-5 business days'
};

export const RETURN_POLICY = {
  returnWindow: 7, // days
  refundMethods: ['Credit/Debit cards: 5-7 business days', 'UPI/Digital wallets: 2-3 business days', 'Cash on Delivery: Bank transfer within 7 days']
};

export const SOCIAL_MEDIA = {
  twitter: 'https://twitter.com/ramro',
  facebook: 'https://facebook.com/ramro',
  instagram: 'https://instagram.com/ramro',
  pinterest: 'https://pinterest.com/ramro'
};

export const APP_CONFIG = {
  name: 'Ramro',
  tagline: 'Authentic Himalayan Products',
  description: 'Handpicked, Organically Grown in the Himalayas',
  currency: 'INR',
  defaultLanguage: 'en'
};

export const PAYMENT_METHODS = {
  razorpay: {
    name: 'Razorpay',
    description: 'Cards, UPI, Net Banking, Wallets',
    testCards: {
      success: '4111111111111111',
      failure: '4000000000000002'
    },
    testUPI: 'success@razorpay'
  },
  cod: {
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order'
  }
};

export const ERROR_MESSAGES = {
  network: 'Network error: Please check your internet connection',
  auth: 'Authentication failed: Please check your credentials',
  payment: 'Payment processing failed: Please try again',
  server: 'Server error: Please try again later',
  validation: 'Please check your input and try again'
};

export const SUCCESS_MESSAGES = {
  orderPlaced: 'Order placed successfully!',
  productAdded: 'Product added to cart',
  profileUpdated: 'Profile updated successfully',
  messageSent: 'Message sent successfully'
};