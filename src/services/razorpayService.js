// src/services/razorpayService.js
import { razorpayConfig, loadRazorpayScript } from '../config/razorpay';

class RazorpayService {
  constructor() {
    this.razorpay = null;
    this.scriptLoaded = false;
  }

  async initialize() {
    if (!this.scriptLoaded) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load Razorpay script');
      }
      this.scriptLoaded = true;
    }
    return true;
  }

  async createOrder(orderData) {
    try {
      // In a real implementation, this would call your backend API
      // which would create an order using Razorpay's server-side API
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(orderData.total * 100), // Convert to paise
          currency: 'INR',
          receipt: orderData.orderNumber || `order_${Date.now()}`,
          notes: {
            orderId: orderData.id,
            customerEmail: orderData.userEmail
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async processPayment(orderData, onSuccess, onError) {
    try {
      await this.initialize();

      // Create order on backend first
      const razorpayOrder = await this.createOrder(orderData);

      const options = {
        key: razorpayConfig.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: razorpayConfig.name,
        description: razorpayConfig.description,
        image: razorpayConfig.image,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verificationResult = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData
            });

            if (verificationResult.success) {
              onSuccess({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                paymentStatus: 'completed'
              });
            } else {
              onError('Payment verification failed');
            }
          } catch (error) {
            onError('Payment verification error: ' + error.message);
          }
        },
        prefill: {
          name: `${orderData.shipping.firstName} ${orderData.shipping.lastName}`,
          email: orderData.shipping.email,
          contact: orderData.shipping.phone
        },
        notes: {
          address: orderData.shipping.address,
          city: orderData.shipping.city
        },
        theme: razorpayConfig.theme,
        modal: {
          ondismiss: () => {
            onError('Payment cancelled by user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      onError('Payment initialization failed: ' + error.message);
    }
  }

  async verifyPayment(paymentData) {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  async processRefund(paymentId, amount, reason = 'Customer request') {
    try {
      const response = await fetch('/api/razorpay/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          amount: amount ? Math.round(amount * 100) : undefined, // Full refund if amount not specified
          notes: {
            reason: reason
          }
        })
      });

      if (!response.ok) {
        throw new Error('Refund processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Utility method to format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;