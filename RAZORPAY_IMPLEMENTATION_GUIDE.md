# 🏔️ Razorpay Integration Guide for Ramro E-commerce (Firebase Backend)

## 📋 **Complete Implementation Guide**

This guide provides step-by-step instructions for implementing Razorpay payment gateway in your Firebase-powered Ramro e-commerce application, replacing the previous Stripe integration.

---

## 🚀 **1. Setup Requirements**

### **1.1 Create Razorpay Account**
1. Visit [https://razorpay.com/](https://razorpay.com/)
2. Click **"Sign Up"** and create your account
3. Complete business verification (required for live payments)
4. Navigate to **Dashboard** → **Settings** → **API Keys**

### **1.2 Get API Keys**
```bash
# Test Mode Keys (for development)
Key ID: rzp_test_xxxxxxxxxx
Key Secret: xxxxxxxxxxxxxxxxxx

# Live Mode Keys (for production)
Key ID: rzp_live_xxxxxxxxxx  
Key Secret: xxxxxxxxxxxxxxxxxx
```

### **1.3 Environment Configuration**
Update your `.env` file:
```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_RAZORPAY_KEY_SECRET=your_key_secret
```

---

## 🛠️ **2. Implementation Details**

### **2.1 Frontend Integration**
The implementation includes:
- **RazorpayCheckout Component**: Handles payment UI and processing
- **Razorpay Service**: Manages payment operations and API calls
- **Configuration**: Centralized Razorpay settings

### **2.2 Key Features Implemented**
✅ **One-time Payments**: Complete checkout flow
✅ **Payment Verification**: Server-side verification for security
✅ **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
✅ **Error Handling**: Comprehensive error management
✅ **Refund Support**: Programmatic refund processing
✅ **Mobile Responsive**: Optimized for all devices

### **2.3 Payment Flow**
```
1. User clicks "Pay with Razorpay"
2. Frontend creates order via backend API
3. Razorpay checkout modal opens
4. User completes payment
5. Payment verified on backend
6. Order created in database
7. Success/failure handled appropriately
```

---

## 🔧 **3. Backend API Requirements**

You'll need to create these API endpoints on your backend:

### **3.1 Create Order Endpoint**
```javascript
// POST /api/razorpay/create-order
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency || 'INR',
      receipt: receipt,
      notes: notes
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **3.2 Verify Payment Endpoint**
```javascript
// POST /api/razorpay/verify-payment
const crypto = require('crypto');

app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Save order to database here
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### **3.3 Refund Endpoint**
```javascript
// POST /api/razorpay/refund
app.post('/api/razorpay/refund', async (req, res) => {
  try {
    const { payment_id, amount, notes } = req.body;
    
    const refund = await razorpay.payments.refund(payment_id, {
      amount: amount, // amount in paise, leave empty for full refund
      notes: notes
    });
    
    res.json(refund);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🔒 **4. Security Considerations**

### **4.1 API Key Management**
- ✅ **Never expose Key Secret** on frontend
- ✅ **Use environment variables** for all keys
- ✅ **Separate test/live keys** by environment
- ✅ **Rotate keys periodically**

### **4.2 Payment Verification**
- ✅ **Always verify payments** on backend
- ✅ **Use signature verification** for authenticity
- ✅ **Validate order amounts** before processing
- ✅ **Log all payment attempts** for audit

### **4.3 Data Handling**
- ✅ **PCI DSS compliance** (handled by Razorpay)
- ✅ **Encrypt sensitive data** in database
- ✅ **Implement rate limiting** on payment endpoints
- ✅ **Use HTTPS** for all communications

---

## 🧪 **5. Testing Guide**

### **5.1 Test Cards**
```javascript
// Test Card Numbers (always use in test mode)
const testCards = {
  success: '4111111111111111',
  failure: '4000000000000002',
  insufficient_funds: '4000000000000341',
  expired_card: '4000000000000069'
};

// Test UPI ID
const testUPI = 'success@razorpay';
```

### **5.2 Testing Checklist**
- [ ] **Successful Payment**: Complete purchase flow
- [ ] **Failed Payment**: Handle payment failures gracefully
- [ ] **Payment Cancellation**: User cancels payment
- [ ] **Network Issues**: Handle connectivity problems
- [ ] **Invalid Data**: Test with incorrect order amounts
- [ ] **Refund Process**: Test refund functionality

---

## 📱 **6. Mobile Optimization**

### **6.1 UPI Integration**
```javascript
// UPI-specific options
const upiOptions = {
  ...baseOptions,
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true
  }
};
```

### **6.2 Mobile-Specific Features**
- ✅ **UPI Apps Integration**: Direct app opening
- ✅ **Mobile Wallets**: Paytm, PhonePe, etc.
- ✅ **Responsive Design**: Optimized for mobile screens
- ✅ **Touch-Friendly**: Large buttons and easy navigation

---

## 🔄 **7. Webhook Implementation**

### **7.1 Webhook Setup**
1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events: `payment.captured`, `payment.failed`, `refund.created`

### **7.2 Webhook Handler**
```javascript
// POST /api/razorpay/webhook
app.post('/api/razorpay/webhook', (req, res) => {
  const webhookSignature = req.headers['x-razorpay-signature'];
  const webhookBody = JSON.stringify(req.body);
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(webhookBody)
    .digest('hex');
  
  if (webhookSignature === expectedSignature) {
    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;
    
    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        break;
      case 'payment.failed':
        // Handle failed payment
        break;
      case 'refund.created':
        // Handle refund
        break;
    }
    
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

---

## 🚀 **8. Deployment Checklist**

### **8.1 Pre-Production**
- [ ] **Test all payment flows** thoroughly
- [ ] **Verify webhook endpoints** are working
- [ ] **Check error handling** for all scenarios
- [ ] **Validate refund process**
- [ ] **Test on multiple devices** and browsers

### **8.2 Production Setup**
- [ ] **Switch to live API keys**
- [ ] **Update webhook URLs** to production
- [ ] **Enable payment methods** as needed
- [ ] **Set up monitoring** and alerts
- [ ] **Configure backup systems**

### **8.3 Go-Live**
- [ ] **Business verification** completed
- [ ] **Bank account** linked and verified
- [ ] **Settlement schedule** configured
- [ ] **Tax settings** properly configured
- [ ] **Compliance documents** submitted

---

## 📊 **9. Monitoring & Analytics**

### **9.1 Key Metrics to Track**
- **Payment Success Rate**: Target >95%
- **Average Transaction Time**: <30 seconds
- **Refund Processing Time**: <24 hours
- **Customer Support Tickets**: Payment-related issues

### **9.2 Razorpay Dashboard**
- **Transaction Reports**: Daily/monthly summaries
- **Settlement Reports**: Bank transfer details
- **Dispute Management**: Chargeback handling
- **Analytics**: Payment method preferences

---

## 🆘 **10. Troubleshooting**

### **10.1 Common Issues**
```javascript
// Issue: Payment fails with "Invalid Key ID"
// Solution: Check environment variables and key format

// Issue: Signature verification fails
// Solution: Ensure correct key secret and payload format

// Issue: Webhook not receiving events
// Solution: Verify webhook URL and signature validation
```

### **10.2 Error Codes**
- **BAD_REQUEST_ERROR**: Invalid request parameters
- **GATEWAY_ERROR**: Payment gateway issues
- **INTERNAL_ERROR**: Razorpay server issues
- **SERVER_ERROR**: Your server issues

---

## 📞 **11. Support & Resources**

### **11.1 Documentation**
- **Razorpay Docs**: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **API Reference**: [https://razorpay.com/docs/api/](https://razorpay.com/docs/api/)
- **Integration Guide**: [https://razorpay.com/docs/payments/](https://razorpay.com/docs/payments/)

### **11.2 Support Channels**
- **Email**: support@razorpay.com
- **Phone**: +91-80-61606161
- **Chat**: Available in dashboard
- **Community**: [https://community.razorpay.com/](https://community.razorpay.com/)

---

## 🎉 **Congratulations!**

Your Ramro e-commerce application now supports Razorpay payments with:
- ✅ **Multiple Payment Methods**: Cards, UPI, Net Banking, Wallets
- ✅ **Secure Processing**: Industry-standard security measures
- ✅ **Mobile Optimized**: Perfect for Indian market
- ✅ **Comprehensive Error Handling**: Robust payment flow
- ✅ **Refund Support**: Complete transaction lifecycle

**Your customers can now pay using their preferred Indian payment methods!** 🇮🇳

---

*Made with ❤️ for the Indian e-commerce ecosystem*