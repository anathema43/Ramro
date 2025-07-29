# 🏗️ System Architecture - Ramro E-commerce Platform

## 🎯 **High-Level Architecture Overview**

This document provides a comprehensive view of the Ramro e-commerce system architecture, including all components, data flows, and integrations.

---

## 🌐 **Overall System Architecture**

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
        C[PWA App]
    end
    
    subgraph "CDN & Edge"
        D[Netlify/Vercel CDN]
        E[Image CDN]
        F[Static Assets]
    end
    
    subgraph "Frontend Application"
        G[React 19 + Vite]
        H[Tailwind CSS]
        I[Zustand State Management]
        J[React Router]
    end
    
    subgraph "Authentication & Security"
        K[Firebase Auth]
        L[JWT Tokens]
        M[Role-Based Access]
        N[Security Rules]
    end
    
    subgraph "Backend Services"
        O[Firebase Firestore]
        P[Firebase Storage]
        Q[Firebase Functions]
        R[Firebase Hosting]
    end
    
    subgraph "External APIs"
        S[Razorpay Payment Gateway]
        T[Email Service Provider]
        U[Analytics Service]
        V[Monitoring Service]
    end
    
    subgraph "Data Storage"
        W[Firestore Collections]
        X[File Storage]
        Y[Cache Layer]
        Z[Backup Storage]
    end
    
    A --> D
    B --> D
    C --> D
    D --> G
    E --> G
    F --> G
    
    G --> K
    G --> O
    G --> S
    
    K --> L
    L --> M
    M --> N
    
    O --> W
    P --> X
    Q --> T
    R --> D
    
    Q --> U
    Q --> V
    
    W --> Y
    W --> Z
```

---

## 🔧 **Frontend Architecture**

### **Component Architecture**
```mermaid
graph TD
    subgraph "App Shell"
        A[App.jsx - Root Component]
        B[Router Configuration]
        C[Global State Providers]
        D[Error Boundaries]
    end
    
    subgraph "Layout Components"
        E[Navbar]
        F[Footer]
        G[Sidebar]
        H[Mobile Menu]
    end
    
    subgraph "Page Components"
        I[Home Page]
        J[Shop Page]
        K[Product Detail]
        L[Cart Page]
        M[Checkout Page]
        N[Account Page]
        O[Admin Dashboard]
    end
    
    subgraph "Shared Components"
        P[ProductCard]
        Q[AddToCartButton]
        R[WishlistButton]
        S[ReviewStars]
        T[LoadingSpinner]
        U[Modal]
        V[Form Components]
    end
    
    subgraph "State Management"
        W[Auth Store]
        X[Cart Store]
        Y[Product Store]
        Z[Order Store]
        AA[Wishlist Store]
        BB[UI Store]
    end
    
    A --> B
    A --> C
    A --> D
    B --> I
    B --> J
    B --> K
    B --> L
    B --> M
    B --> N
    B --> O
    
    I --> E
    I --> P
    J --> P
    K --> Q
    K --> R
    
    P --> S
    Q --> X
    R --> AA
    
    W --> K
    X --> L
    Y --> J
    Z --> N
```

### **State Management Flow**
```mermaid
sequenceDiagram
    participant UI as UI Component
    participant Store as Zustand Store
    participant API as Firebase API
    participant Cache as Local Cache
    
    UI->>Store: Dispatch Action
    Store->>Store: Update State
    Store->>API: API Call (if needed)
    API->>Store: Return Data
    Store->>Cache: Update Cache
    Store->>UI: Notify State Change
    UI->>UI: Re-render Component
```

---

## 🗄️ **Database Architecture**

### **Firestore Collections Structure**
```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CARTS : owns
    USERS ||--o{ WISHLISTS : maintains
    USERS ||--o{ REVIEWS : writes
    
    PRODUCTS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : includes
    PRODUCTS ||--o{ WISHLIST_ITEMS : saved_in
    PRODUCTS ||--o{ REVIEWS : receives
    PRODUCTS ||--o{ INVENTORY_LOGS : tracks
    
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENTS : processed_via
    ORDERS ||--o{ SHIPPING_UPDATES : has
    
    CATEGORIES ||--o{ PRODUCTS : categorizes
    
    USERS {
        string uid PK
        string email UK
        string displayName
        string role
        object preferences
        array addresses
        string phone
        timestamp createdAt
        timestamp updatedAt
        boolean active
    }
    
    PRODUCTS {
        string id PK
        string name
        string description
        number price
        string image
        array images
        number quantityAvailable
        string category
        string sku UK
        number rating
        number reviewCount
        boolean featured
        boolean active
        object metadata
        timestamp createdAt
        timestamp updatedAt
    }
    
    ORDERS {
        string id PK
        string userId FK
        string orderNumber UK
        array items
        object shipping
        object payment
        number subtotal
        number tax
        number shippingCost
        number total
        string status
        string paymentStatus
        string trackingNumber
        timestamp createdAt
        timestamp updatedAt
    }
    
    CARTS {
        string userId PK
        array items
        timestamp updatedAt
    }
    
    WISHLISTS {
        string userId PK
        array productIds
        timestamp updatedAt
    }
    
    REVIEWS {
        string id PK
        string productId FK
        string userId FK
        string userName
        number rating
        string title
        string comment
        boolean verified
        number helpful
        timestamp createdAt
        timestamp updatedAt
    }
    
    CATEGORIES {
        string id PK
        string name
        string description
        string image
        number productCount
        boolean active
        number sortOrder
    }
    
    INVENTORY_LOGS {
        string id PK
        string productId FK
        string action
        number previousQuantity
        number newQuantity
        number changeAmount
        string reason
        string adminId
        timestamp createdAt
    }
    
    PAYMENTS {
        string id PK
        string orderId FK
        string paymentId
        string razorpayOrderId
        string razorpayPaymentId
        string razorpaySignature
        number amount
        string currency
        string status
        string method
        object metadata
        timestamp createdAt
        timestamp updatedAt
    }
    
    SHIPPING_UPDATES {
        string id PK
        string orderId FK
        string status
        string location
        string description
        timestamp timestamp
        timestamp createdAt
    }
```

### **Data Access Patterns**
```mermaid
graph LR
    subgraph "Read Patterns"
        A[Product Listing] --> B[Category Filter]
        A --> C[Search Query]
        A --> D[Pagination]
        
        E[User Dashboard] --> F[User Orders]
        E --> G[User Profile]
        E --> H[User Wishlist]
        
        I[Admin Dashboard] --> J[All Orders]
        I --> K[All Products]
        I --> L[All Users]
        I --> M[Analytics Data]
    end
    
    subgraph "Write Patterns"
        N[User Registration] --> O[Create User Doc]
        P[Add to Cart] --> Q[Update Cart Doc]
        R[Place Order] --> S[Create Order Doc]
        R --> T[Update Inventory]
        U[Admin Actions] --> V[Update Product]
        U --> W[Update Order Status]
    end
    
    subgraph "Real-time Updates"
        X[Cart Changes] --> Y[Real-time Sync]
        Z[Order Status] --> AA[Live Updates]
        BB[Inventory Changes] --> CC[Stock Alerts]
    end
```

---

## 🔐 **Security Architecture**

### **Authentication & Authorization Flow**
```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend App
    participant Auth as Firebase Auth
    participant Rules as Security Rules
    participant DB as Firestore
    
    User->>Frontend: Login Request
    Frontend->>Auth: Authenticate User
    Auth->>Auth: Validate Credentials
    Auth->>Frontend: Return JWT Token
    Frontend->>Frontend: Store Auth State
    
    User->>Frontend: Request Protected Resource
    Frontend->>DB: Query with Auth Token
    DB->>Rules: Check Security Rules
    Rules->>Rules: Validate User Permissions
    
    alt Authorized
        Rules->>DB: Allow Access
        DB->>Frontend: Return Data
        Frontend->>User: Display Content
    else Unauthorized
        Rules->>DB: Deny Access
        DB->>Frontend: Return Error
        Frontend->>User: Show Access Denied
    end
```

### **Security Rules Structure**
```javascript
// Firestore Security Rules Architecture
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data access
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Product access (public read, admin write)
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Order access (user owns order)
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // Helper function
    function isAdmin() {
      return request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 💳 **Payment Processing Architecture**

### **Razorpay Integration Flow**
```mermaid
sequenceDiagram
    participant Customer as Customer
    participant Frontend as Frontend
    participant Backend as Backend API
    participant Razorpay as Razorpay
    participant DB as Database
    participant Email as Email Service
    
    Customer->>Frontend: Initiate Checkout
    Frontend->>Backend: Create Order Request
    Backend->>Razorpay: Create Razorpay Order
    Razorpay->>Backend: Return Order ID
    Backend->>Frontend: Return Order Details
    
    Frontend->>Customer: Show Payment Interface
    Customer->>Razorpay: Complete Payment
    Razorpay->>Frontend: Payment Callback
    
    Frontend->>Backend: Verify Payment
    Backend->>Razorpay: Verify Signature
    Razorpay->>Backend: Confirm Payment
    
    Backend->>DB: Create Order Record
    Backend->>DB: Update Inventory
    Backend->>Email: Send Confirmation
    Backend->>Frontend: Payment Success
    Frontend->>Customer: Show Success Page
    
    Note over Razorpay, Backend: Webhook for additional security
    Razorpay->>Backend: Payment Webhook
    Backend->>DB: Update Payment Status
```

### **Payment Method Support**
```mermaid
graph TD
    A[Razorpay Gateway] --> B[Credit/Debit Cards]
    A --> C[UPI Payments]
    A --> D[Net Banking]
    A --> E[Digital Wallets]
    A --> F[EMI Options]
    A --> G[Buy Now Pay Later]
    
    B --> B1[Visa]
    B --> B2[Mastercard]
    B --> B3[RuPay]
    B --> B4[American Express]
    
    C --> C1[Google Pay]
    C --> C2[PhonePe]
    C --> C3[Paytm]
    C --> C4[BHIM UPI]
    
    D --> D1[SBI]
    D --> D2[HDFC]
    D --> D3[ICICI]
    D --> D4[Axis Bank]
    
    E --> E1[Paytm Wallet]
    E --> E2[Mobikwik]
    E --> E3[Freecharge]
    E --> E4[Amazon Pay]
```

---

## 📧 **Communication Architecture**

### **Email Service Integration**
```mermaid
graph TD
    subgraph "Email Triggers"
        A[User Registration]
        B[Order Confirmation]
        C[Order Status Update]
        D[Password Reset]
        E[Low Stock Alert]
        F[Newsletter]
    end
    
    subgraph "Email Service"
        G[Firebase Functions]
        H[Email Templates]
        I[SendGrid/Mailgun]
        J[Email Queue]
    end
    
    subgraph "Email Types"
        K[Transactional]
        L[Marketing]
        M[System Alerts]
        N[Customer Support]
    end
    
    A --> G
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
    
    G --> H
    H --> I
    I --> J
    
    J --> K
    J --> L
    J --> M
    J --> N
```

### **Notification System**
```mermaid
stateDiagram-v2
    [*] --> EventTriggered
    
    EventTriggered --> DetermineRecipients: Identify Recipients
    DetermineRecipients --> CheckPreferences: Check User Preferences
    CheckPreferences --> CreateNotification: Generate Notification
    
    CreateNotification --> EmailNotification: Email Channel
    CreateNotification --> InAppNotification: In-App Channel
    CreateNotification --> SMSNotification: SMS Channel
    
    EmailNotification --> EmailQueue: Queue Email
    InAppNotification --> NotificationStore: Store in Database
    SMSNotification --> SMSQueue: Queue SMS
    
    EmailQueue --> EmailSent: Send Email
    NotificationStore --> DisplayNotification: Show in UI
    SMSQueue --> SMSSent: Send SMS
    
    EmailSent --> TrackDelivery: Track Email Delivery
    DisplayNotification --> MarkAsRead: User Interaction
    SMSSent --> TrackDelivery: Track SMS Delivery
    
    TrackDelivery --> [*]: Complete
    MarkAsRead --> [*]: Complete
```

---

## 📊 **Analytics & Monitoring Architecture**

### **Data Collection & Analysis**
```mermaid
graph TB
    subgraph "Data Sources"
        A[User Interactions]
        B[Transaction Data]
        C[System Metrics]
        D[Error Logs]
        E[Performance Data]
    end
    
    subgraph "Collection Layer"
        F[Google Analytics]
        G[Firebase Analytics]
        H[Custom Event Tracking]
        I[Error Tracking Service]
        J[Performance Monitoring]
    end
    
    subgraph "Processing Layer"
        K[Data Aggregation]
        L[Real-time Processing]
        M[Batch Processing]
        N[Data Validation]
    end
    
    subgraph "Storage Layer"
        O[Analytics Database]
        P[Time-series Data]
        Q[Aggregated Reports]
        R[Raw Event Data]
    end
    
    subgraph "Visualization Layer"
        S[Admin Dashboard]
        T[Business Intelligence]
        U[Real-time Alerts]
        V[Custom Reports]
    end
    
    A --> F
    B --> G
    C --> H
    D --> I
    E --> J
    
    F --> K
    G --> L
    H --> M
    I --> N
    J --> K
    
    K --> O
    L --> P
    M --> Q
    N --> R
    
    O --> S
    P --> T
    Q --> U
    R --> V
```

---

## 🚀 **Deployment Architecture**

### **CI/CD Pipeline**
```mermaid
graph LR
    subgraph "Development"
        A[Local Development]
        B[Git Repository]
        C[Feature Branches]
    end
    
    subgraph "CI/CD Pipeline"
        D[GitHub Actions]
        E[Build Process]
        F[Testing Suite]
        G[Security Scan]
        H[Code Quality Check]
    end
    
    subgraph "Staging Environment"
        I[Staging Deployment]
        J[Integration Testing]
        K[Performance Testing]
        L[User Acceptance Testing]
    end
    
    subgraph "Production Environment"
        M[Production Deployment]
        N[Health Checks]
        O[Monitoring]
        P[Rollback Capability]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P
```

### **Infrastructure Components**
```mermaid
graph TD
    subgraph "CDN Layer"
        A[Global CDN]
        B[Edge Caching]
        C[Static Assets]
        D[Image Optimization]
    end
    
    subgraph "Application Layer"
        E[React Application]
        F[Service Workers]
        G[Progressive Web App]
        H[Offline Capabilities]
    end
    
    subgraph "API Layer"
        I[Firebase Functions]
        J[REST APIs]
        K[GraphQL Endpoints]
        L[Webhook Handlers]
    end
    
    subgraph "Database Layer"
        M[Firestore]
        N[Firebase Storage]
        O[Cache Layer]
        P[Backup Systems]
    end
    
    subgraph "External Services"
        Q[Payment Gateway]
        R[Email Service]
        S[Analytics]
        T[Monitoring]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> I
    F --> I
    G --> I
    H --> O
    
    I --> M
    J --> M
    K --> M
    L --> Q
    
    M --> P
    N --> P
    O --> P
    
    I --> Q
    I --> R
    E --> S
    I --> T
```

---

## 🔄 **Scalability Considerations**

### **Horizontal Scaling Strategy**
```mermaid
graph TB
    subgraph "Load Distribution"
        A[Load Balancer]
        B[CDN Distribution]
        C[Geographic Routing]
        D[Auto-scaling]
    end
    
    subgraph "Database Scaling"
        E[Read Replicas]
        F[Sharding Strategy]
        G[Caching Layer]
        H[Connection Pooling]
    end
    
    subgraph "Application Scaling"
        I[Microservices]
        J[Serverless Functions]
        K[Container Orchestration]
        L[Service Mesh]
    end
    
    subgraph "Performance Optimization"
        M[Code Splitting]
        N[Lazy Loading]
        O[Image Optimization]
        P[Bundle Optimization]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> J
    G --> K
    H --> L
    
    I --> M
    J --> N
    K --> O
    L --> P
```

This comprehensive system architecture documentation provides a complete technical overview of the Ramro e-commerce platform, covering all aspects from frontend components to backend services, security, and scalability considerations.