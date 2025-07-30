# 🏗️ Ramro E-commerce Architecture Diagrams

## 🔒 **SECURITY-ENHANCED ARCHITECTURE**
**MAJOR UPDATE**: All architecture diagrams now reflect enterprise-grade security:
- ✅ **Server-side Admin Verification** - No client-side role checks
- ✅ **Secure Data Flow** - Single source of truth from Firestore
- ✅ **File Upload Security** - Strict validation pipeline
- ✅ **Real-time Security** - Authenticated cross-tab synchronization
- ✅ **Input Validation** - XSS and injection prevention at all levels

## 📊 **System Architecture Overview**

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        A[User Interface]
        B[Admin Dashboard]
        C[Client Authentication]
        D[State Management - Zustand]
        E[Input Validation Layer]
    end
    
    subgraph "Backend Services"
        F[Firebase Auth]
        G[Firestore Database - Secure Rules]
        H[Firebase Storage - Validated]
        I[Firebase Functions]
        J[Server-side Role Verification]
    end
    
    subgraph "External Services"
        K[Razorpay Payment Gateway]
        L[Email Service]
        M[CDN/Hosting]
    end
    
    A --> F
    A --> G
    A --> K
    B --> J
    B --> G
    B --> H
    C --> F
    D --> G
    E --> G
    I --> L
    A --> M
    B --> M
```

---

## 👤 **User Flow Architecture**

### **Complete User Journey Diagram**

```mermaid
flowchart TD
    Start([User Visits Website]) --> Home[Home Page]
    
    Home --> Browse{Browse Products?}
    Browse -->|Yes| Shop[Shop Page]
    Browse -->|No| About[About/Info Pages]
    
    Shop --> Search[Search/Filter Products]
    Search --> ProductList[Product Listing]
    ProductList --> ProductDetail[Product Detail Page]
    
    ProductDetail --> AddCart{Add to Cart?}
    AddCart -->|Yes| CartUpdate[Update Cart State]
    AddCart -->|No| Wishlist[Add to Wishlist]
    
    CartUpdate --> ContinueShopping{Continue Shopping?}
    ContinueShopping -->|Yes| Shop
    ContinueShopping -->|No| ViewCart[View Cart]
    
    ViewCart --> Checkout{Proceed to Checkout?}
    Checkout -->|No| Shop
    Checkout -->|Yes| AuthCheck{User Authenticated?}
    
    AuthCheck -->|No| Login[Login/Signup Page]
    AuthCheck -->|Yes| CheckoutPage[Checkout Form]
    
    Login --> LoginSuccess{Login Successful?}
    LoginSuccess -->|No| Login
    LoginSuccess -->|Yes| CheckoutPage
    
    CheckoutPage --> PaymentMethod{Select Payment Method}
    PaymentMethod -->|Razorpay| RazorpayFlow[Razorpay Payment Flow]
    PaymentMethod -->|COD| CODFlow[Cash on Delivery]
    
    RazorpayFlow --> PaymentGateway[Razorpay Gateway]
    PaymentGateway --> PaymentResult{Payment Successful?}
    
    PaymentResult -->|Yes| OrderCreated[Order Created in Database]
    PaymentResult -->|No| PaymentFailed[Payment Failed Page]
    
    CODFlow --> OrderCreated
    PaymentFailed --> CheckoutPage
    
    OrderCreated --> EmailConfirmation[Send Order Confirmation Email]
    EmailConfirmation --> OrderSuccess[Order Success Page]
    OrderSuccess --> MyOrders[My Orders Page]
    
    MyOrders --> OrderTracking[Order Tracking]
    OrderTracking --> End([User Journey Complete])
    
    Wishlist --> WishlistPage[Wishlist Management]
    WishlistPage --> Shop
```

### **Authentication & Authorization Flow**
```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend App
    participant Auth as Firebase Auth
    participant Firestore as Firestore DB
    participant Rules as Security Rules
    
    User->>Frontend: Login Request
    Frontend->>Auth: Authenticate User
    Auth->>Auth: Validate Credentials
    Auth->>Frontend: Return JWT Token
    Frontend->>Firestore: Fetch User Profile
    Firestore->>Frontend: Return User Data (with role)
    Frontend->>Frontend: Store Auth State
    
    User->>Frontend: Request Protected Resource
    Frontend->>Firestore: Query with Auth Token
    Firestore->>Rules: Check Security Rules
    Rules->>Rules: Validate User Role (Server-side)
    
    alt Authorized
        Rules->>Firestore: Allow Access
        Firestore->>Frontend: Return Data
        Frontend->>User: Display Content
    else Unauthorized
        Rules->>Firestore: Deny Access
        Firestore->>Frontend: Return Error
        Frontend->>User: Show Access Denied
    end
```

### **Shopping Cart Flow**

```mermaid
stateDiagram-v2
    [*] --> EmptyCart
    
    EmptyCart --> HasItems: Add Product
    HasItems --> HasItems: Add More Products
    HasItems --> HasItems: Update Quantities
    HasItems --> EmptyCart: Remove All Items
    HasItems --> Checkout: Proceed to Checkout
    
    Checkout --> Authentication: Check Auth Status
    Authentication --> Checkout: User Authenticated
    Authentication --> Login: User Not Authenticated
    Login --> Checkout: Login Successful
    
    Checkout --> Payment: Fill Shipping Info
    Payment --> Processing: Submit Payment
    Processing --> Success: Payment Successful
    Processing --> Failed: Payment Failed
    
    Success --> [*]: Order Complete
    Failed --> Payment: Retry Payment
```

---

## 👨‍💼 **Admin Flow Architecture**

### **Admin Dashboard Workflow**

```mermaid
flowchart TD
    AdminStart([Admin Login]) --> AdminAuth{Admin Authentication}
    AdminAuth -->|Invalid| LoginFailed[Access Denied]
    AdminAuth -->|Valid| AdminDashboard[Admin Dashboard]
    
    AdminDashboard --> ProductMgmt[Product Management]
    AdminDashboard --> OrderMgmt[Order Management]
    AdminDashboard --> UserMgmt[User Management]
    AdminDashboard --> Analytics[Analytics & Reports]
    AdminDashboard --> Settings[System Settings]
    
    subgraph "Product Management Flow"
        ProductMgmt --> ViewProducts[View All Products]
        ViewProducts --> AddProduct[Add New Product]
        ViewProducts --> EditProduct[Edit Existing Product]
        ViewProducts --> DeleteProduct[Delete Product]
        ViewProducts --> ManageInventory[Manage Inventory]
        
        AddProduct --> ProductForm[Product Form]
        EditProduct --> ProductForm
        ProductForm --> ValidateProduct{Validate Data}
        ValidateProduct -->|Invalid| ProductForm
        ValidateProduct -->|Valid| SaveProduct[Save to Database]
        SaveProduct --> UpdateInventory[Update Inventory Count]
        UpdateInventory --> ProductMgmt
        
        ManageInventory --> StockUpdate[Update Stock Levels]
        StockUpdate --> LowStockAlert{Stock Below Threshold?}
        LowStockAlert -->|Yes| SendAlert[Send Low Stock Alert]
        LowStockAlert -->|No| ProductMgmt
        SendAlert --> ProductMgmt
    end
    
    subgraph "Order Management Flow"
        OrderMgmt --> ViewOrders[View All Orders]
        ViewOrders --> FilterOrders[Filter by Status/Date]
        FilterOrders --> OrderDetail[View Order Details]
        OrderDetail --> UpdateStatus[Update Order Status]
        UpdateStatus --> NotifyCustomer[Send Status Update Email]
        NotifyCustomer --> ProcessRefund{Refund Required?}
        ProcessRefund -->|Yes| InitiateRefund[Process Refund via Razorpay]
        ProcessRefund -->|No| OrderMgmt
        InitiateRefund --> OrderMgmt
    end
    
    subgraph "User Management Flow"
        UserMgmt --> ViewUsers[View All Users]
        ViewUsers --> UserDetail[View User Profile]
        UserDetail --> UpdateRole[Update User Role]
        UserDetail --> ViewUserOrders[View User's Orders]
        UpdateRole --> UserMgmt
        ViewUserOrders --> OrderMgmt
    end
    
    subgraph "Analytics Flow"
        Analytics --> SalesReport[Sales Reports]
        Analytics --> InventoryReport[Inventory Reports]
        Analytics --> UserReport[User Analytics]
        SalesReport --> ExportData[Export Data]
        InventoryReport --> ExportData
        UserReport --> ExportData
        ExportData --> Analytics
    end
```

### **Admin Product Management Sequence**

```mermaid
sequenceDiagram
    participant A as Admin
    participant UI as Admin UI
    participant FS as Firestore
    participant ST as Storage
    participant INV as Inventory System
    
    A->>UI: Access Product Management
    UI->>FS: Fetch All Products
    FS->>UI: Return Product List
    UI->>A: Display Products
    
    A->>UI: Add New Product
    UI->>A: Show Product Form
    A->>UI: Fill Product Details + Upload Image
    UI->>ST: Upload Product Image
    ST->>UI: Return Image URL
    UI->>FS: Save Product Data
    FS->>INV: Initialize Inventory
    INV->>FS: Update Inventory Count
    FS->>UI: Confirm Product Created
    UI->>A: Show Success Message
    
    A->>UI: Update Product Stock
    UI->>FS: Update Inventory Count
    FS->>INV: Check Stock Levels
    
    alt Stock Below Threshold
        INV->>UI: Trigger Low Stock Alert
        UI->>A: Show Low Stock Warning
    else Stock Adequate
        INV->>UI: Confirm Update
    end
```

### **Order Processing Workflow**

```mermaid
stateDiagram-v2
    [*] --> NewOrder: Customer Places Order
    
    NewOrder --> Processing: Admin Reviews Order
    Processing --> InventoryCheck: Check Product Availability
    
    InventoryCheck --> InStock: Items Available
    InventoryCheck --> OutOfStock: Items Unavailable
    
    OutOfStock --> ContactCustomer: Notify Customer
    ContactCustomer --> Cancelled: Customer Cancels
    ContactCustomer --> Backorder: Customer Waits
    
    InStock --> PaymentVerified: Verify Payment Status
    PaymentVerified --> Packaging: Prepare for Shipping
    Packaging --> Shipped: Ship Order
    Shipped --> InTransit: Tracking Active
    InTransit --> Delivered: Customer Receives Order
    
    Delivered --> ReviewRequest: Request Customer Review
    ReviewRequest --> [*]: Order Complete
    
    Cancelled --> RefundProcess: Process Refund
    RefundProcess --> [*]: Refund Complete
    
    Backorder --> InStock: Stock Replenished
```

---

## 🔄 **Data Flow Architecture**

### **Real-time Data Synchronization**

```mermaid
graph LR
    subgraph "Frontend State"
        A[User State]
        B[Cart State]
        C[Product State]
        D[Order State]
    end
    
    subgraph "Firebase Realtime"
        E[Auth State]
        F[Cart Collection]
        G[Products Collection]
        H[Orders Collection]
        I[Users Collection]
    end
    
    subgraph "External APIs"
        J[Razorpay API]
        K[Email Service]
        L[Analytics]
    end
    
    A <--> E
    B <--> F
    C <--> G
    D <--> H
    A <--> I
    
    D --> J
    H --> K
    A --> L
    C --> L
```

### **Security & Permission Flow**

```mermaid
flowchart TD
    UserRequest[User Request] --> AuthCheck{Authenticated?}
    AuthCheck -->|No| Unauthorized[Return 401 Unauthorized]
    AuthCheck -->|Yes| RoleCheck{Check User Role}
    
    RoleCheck --> Customer[Customer Role]
    RoleCheck --> Admin[Admin Role]
    
    Customer --> CustomerPermissions{Check Permissions}
    Admin --> AdminPermissions{Check Permissions}
    
    CustomerPermissions -->|Own Data| AllowAccess[Allow Access]
    CustomerPermissions -->|Others Data| Forbidden[Return 403 Forbidden]
    
    AdminPermissions -->|Admin Resources| AllowAccess
    AdminPermissions -->|System Critical| SuperAdminCheck{Super Admin?}
    
    SuperAdminCheck -->|Yes| AllowAccess
    SuperAdminCheck -->|No| Forbidden
    
    AllowAccess --> ProcessRequest[Process Request]
    ProcessRequest --> AuditLog[Log Action]
    AuditLog --> ReturnResponse[Return Response]
```

---

## 🏗️ **Component Architecture**

### **Frontend Component Hierarchy**

```mermaid
graph TD
    App[App.jsx] --> Router[React Router]
    
    Router --> PublicRoutes[Public Routes]
    Router --> ProtectedRoutes[Protected Routes]
    Router --> AdminRoutes[Admin Routes]
    
    PublicRoutes --> Home[Home Page]
    PublicRoutes --> Shop[Shop Page]
    PublicRoutes --> ProductDetail[Product Detail]
    PublicRoutes --> Login[Login/Signup]
    
    ProtectedRoutes --> Account[Account Page]
    ProtectedRoutes --> Cart[Cart Page]
    ProtectedRoutes --> Checkout[Checkout Page]
    ProtectedRoutes --> Orders[Orders Page]
    ProtectedRoutes --> Wishlist[Wishlist Page]
    
    AdminRoutes --> AdminDashboard[Admin Dashboard]
    AdminRoutes --> ProductManagement[Product Management]
    AdminRoutes --> OrderManagement[Order Management]
        P[Artisan Directory]
        Q[Artisan Profile]
    AdminRoutes --> UserManagement[User Management]
    
    subgraph "Shared Components"
        Navbar[Navigation Bar]
        ProductCard[Product Card]
        AddToCartButton[Add to Cart Button]
        WishlistButton[Wishlist Button]
        LoadingSpinner[Loading Spinner]
        ReviewStars[Review Stars]
    end
        W[ArtisanCard]
        X[Cultural Content]
        W[ResponsiveImage]
    
    subgraph "State Management"
        AuthStore[Auth Store]
        CartStore[Cart Store]
        ProductStore[Product Store]
        OrderStore[Order Store]
        WishlistStore[Wishlist Store]
        CC[Artisan Store]
    end
```

### **Database Schema Relationships**

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ CARTS : has
    USERS ||--o{ WISHLISTS : maintains
    USERS ||--o{ REVIEWS : writes
    
    PRODUCTS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : includes
    PRODUCTS ||--o{ WISHLIST_ITEMS : saved_in
    PRODUCTS ||--o{ REVIEWS : receives
    
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENTS : processed_via
    
    USERS {
        string uid PK
        string email
        string displayName
        string role
        object preferences
        array addresses
        timestamp createdAt
    }
    
    PRODUCTS {
        string id PK
        string name
        string description
        number price
        string image
        number quantityAvailable
        string category
        number rating
        number reviewCount
        boolean featured
    }
    
    ORDERS {
        string id PK
        string userId FK
        string orderNumber
        array items
        object shipping
        number total
        string status
        string paymentStatus
        timestamp createdAt
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
        number rating
        string comment
        timestamp createdAt
    }
```

---

## 🔧 **Technical Implementation Details**

### **API Integration Flow**

```mermaid
sequenceDiagram
    participant C as Client
    participant F as Frontend
    participant FB as Firebase
    participant R as Razorpay
    participant E as Email Service
    
    C->>F: Initiate Checkout
    F->>FB: Validate User & Cart
    FB->>F: Return Validation
    F->>F: Calculate Totals
    F->>R: Create Payment Order
    R->>F: Return Order ID
    F->>C: Show Payment Interface
    C->>R: Complete Payment
    R->>F: Payment Callback
    F->>FB: Create Order Record
    FB->>E: Trigger Email Notification
    E->>C: Send Confirmation Email
    F->>C: Show Success Page
```

### **Error Handling & Recovery**

```mermaid
flowchart TD
    Error[Error Occurs] --> ErrorType{Error Type}
    
    ErrorType -->|Network| NetworkError[Network Error Handler]
    ErrorType -->|Authentication| AuthError[Auth Error Handler]
    ErrorType -->|Payment| PaymentError[Payment Error Handler]
    ErrorType -->|Database| DatabaseError[Database Error Handler]
    ErrorType -->|Validation| ValidationError[Validation Error Handler]
    
    NetworkError --> Retry{Retry Available?}
    Retry -->|Yes| RetryRequest[Retry Request]
    Retry -->|No| OfflineMode[Show Offline Message]
    
    AuthError --> RedirectLogin[Redirect to Login]
    PaymentError --> PaymentRetry[Offer Payment Retry]
    DatabaseError --> FallbackData[Use Cached Data]
    ValidationError --> ShowValidation[Show Validation Messages]
    
    RetryRequest --> Success{Request Successful?}
    Success -->|Yes| Continue[Continue Normal Flow]
    Success -->|No| FallbackMode[Fallback Mode]
    
    OfflineMode --> Continue
    RedirectLogin --> Continue
    PaymentRetry --> Continue
    FallbackData --> Continue
    ShowValidation --> Continue
    FallbackMode --> Continue
```

---

## 📱 **Mobile-First Architecture**

### **Responsive Design Flow**

```mermaid
graph TD
    Device[User Device] --> DetectViewport[Detect Viewport Size]
    
    DetectViewport --> Mobile{Mobile?}
    DetectViewport --> Tablet{Tablet?}
    DetectViewport --> Desktop{Desktop?}
    
    Mobile -->|Yes| MobileLayout[Mobile Layout]
    Tablet -->|Yes| TabletLayout[Tablet Layout]
    Desktop -->|Yes| DesktopLayout[Desktop Layout]
    
    MobileLayout --> MobileNav[Hamburger Navigation]
    MobileLayout --> MobileCart[Bottom Cart Bar]
    MobileLayout --> MobileCheckout[Single Column Checkout]
    
    TabletLayout --> TabletNav[Condensed Navigation]
    TabletLayout --> TabletGrid[2-Column Product Grid]
    TabletLayout --> TabletCheckout[Two Column Checkout]
    
    DesktopLayout --> FullNav[Full Navigation Bar]
    DesktopLayout --> DesktopGrid[4-Column Product Grid]
    DesktopLayout --> DesktopCheckout[Multi-Column Checkout]
    
    MobileNav --> PWA[Progressive Web App Features]
    MobileCart --> PWA
    MobileCheckout --> PWA
```

This comprehensive architecture documentation provides a complete visual understanding of your Ramro e-commerce application's user flows, admin workflows, and technical implementation. The diagrams show how all components interact and provide a roadmap for development and maintenance.