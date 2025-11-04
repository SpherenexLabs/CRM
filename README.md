# Spherenex Multi-Store CRM System# Spherenex CRM - Multi-Store Management System# React + Vite



A comprehensive, **AI-powered** Customer Relationship Management system with multi-store inventory management, order processing, payment integration, delivery logistics, customer analytics, and **advanced machine learning predictions**.



## 🚀 Features OverviewA comprehensive Customer Relationship Management (CRM) system built with React, featuring multi-store inventory management, order lifecycle tracking, payment processing, delivery logistics, and customer analytics.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



### ✅ Phase 1: Core CRM Modules (Completed)



#### 2.1 Multi-Store Inventory Management## 🚀 FeaturesCurrently, two official plugins are available:

- **Multi-location inventory tracking** across unlimited stores

- **Real-time stock monitoring** with low-stock alerts

- **Stock transfers** between stores with automated tracking

- **Inventory analytics** including total value, turnover rates, and stock levels### 2.1 Multi-Store Inventory Management- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Stock alerts** for items below minimum threshold

- Barcode/SKU-based product identification- ✅ Centralized view of inventory across all branches- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh



#### 2.2 Order Lifecycle Management- ✅ Stock thresholds and real-time alerts for low inventory

- **Complete order processing** from creation to fulfillment

- **Multi-step status tracking**: Pending → Processing → Shipped → Delivered- ✅ Real-time item updates with timestamp tracking## React Compiler

- **Automated invoice generation** with tax calculations (10% default)

- **Order analytics** including revenue tracking and order counts- ✅ Transfer stock between stores with reason tracking

- **Customer order history** and payment tracking

- Real-time order status updates- ✅ Edit inventory items inlineThe React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.



#### 2.3 Payment System Integration- ✅ Filter inventory by store location

- **Multiple payment methods**: Credit Card, Cash, UPI, Net Banking

- **Transaction logging** with comprehensive payment history## Expanding the ESLint configuration

- **Payment status tracking**: Pending, Completed, Refunded

- **Refund processing** with transaction reversal### 2.2 Order Lifecycle Management

- **Payment analytics** including success rates and revenue totals

- Ready for integration with Razorpay, Stripe, or PayPal- ✅ New order creation with multi-item supportIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



#### 2.4 Delivery & Logistics Module- ✅ Order status tracking (placed, shipped, delivered, returned, cancelled)

- **Delivery agent management** with zone-based assignment- ✅ Auto-generated invoices with 10% tax calculation

- **Real-time delivery tracking** with GPS-ready architecture- ✅ Real-time stock updates on order confirmation

- **Multi-status workflow**: Assigned → Picked Up → In Transit → Delivered- ✅ Order details view with full tracking information

- **Route optimization** recommendations- ✅ Payment status integration

- **Delivery analytics** including completion rates and average times

- Agent performance tracking and workload distribution### 2.3 Payment System Integration

- ✅ Accept multiple payment methods: UPI, Cards, Wallets, Net Banking

#### 2.5 CRM & Customer Management- ✅ Auto-generated invoices with tax breakdown

- **360° customer profiles** with comprehensive history- ✅ Payment verification logs with transaction IDs

- **4-tier loyalty program**: Bronze → Silver → Gold → Platinum- ✅ Integration ready for Razorpay, PayPal, Stripe

- **Loyalty points system** with redemption tracking- ✅ Payment history and analytics

- **Churn risk prediction** with actionable retention strategies- ✅ Success rate tracking

- **Customer feedback management** with sentiment tracking

- **Personalized product recommendations** based on purchase history### 2.4 Delivery & Logistics Module

- Automated customer segmentation- ✅ Assign delivery tasks to agents

- ✅ Track delivery status (assigned, in-transit, delivered)

---- ✅ Delivery analytics by zone, agent, and product

- ✅ Agent performance tracking

### ✅ Phase 2: Advanced AI & Analytics (Completed)- ✅ Zone-based delivery management

- ✅ Real-time delivery status updates

#### 3.1-3.3 Machine Learning Integration

### 2.5 CRM (Customer Relationship Management)

##### 🤖 XGBoost Models- ✅ Customer registration and profile management

- **Sales Forecasting**: 30-day demand predictions with confidence intervals- ✅ Complete purchase history tracking

- **Demand Forecasting**: Product-level demand with upper/lower bounds- ✅ Offer recommendation engine (ML-ready structure)

- **Top Sellers Prediction**: Identify future best-performing products- ✅ Loyalty points and tier system (Bronze, Silver, Gold, Platinum)

- **Restocking Optimization**: AI-recommended reorder quantities and timing- ✅ Feedback collection and analytics

- ✅ Churn prediction and risk analysis

##### 🤖 LightGBM Models- ✅ Customer segmentation by tier

- **Customer Churn Prediction**: Risk scoring from 0-1 with retention probability- ✅ Average customer rating tracking

- **Customer Value Classification**: VIP, High-Value, Medium-Value, Low-Value segments

- **Personalized Offers**: AI-generated discounts based on customer behavior## 📊 Dashboard Features

- **Retention Actions**: Automated recommendations to prevent churn- Real-time revenue tracking

- Order status distribution charts

##### 🤖 Temporal Fusion Transformer (TFT)- Recent orders overview

- **12-Month Revenue Forecast**: Long-term business projections- Stock alerts monitoring

- **Seasonal Trend Analysis**: Identify peak periods and seasonal patterns- Active deliveries tracking

- **Stock Level Predictions**: 90-day inventory requirement forecasts- Customer tier distribution

- **Dynamic Pricing Optimization**: Price recommendations based on demand elasticity- Visual analytics with charts (Line, Pie, Bar)



#### 4. Sales Analytics Dashboard## 🛠️ Tech Stack

- **Revenue Trends**: Area charts with period comparisons (Week/Month/Quarter)

- **ML Predictions vs Actuals**: Compare forecasted vs real sales performance- **Frontend Framework**: React 19.1.1

- **Product Performance**: Bar charts showing top/bottom performers- **Routing**: React Router DOM

- **Store Comparison**: Multi-store revenue and order analytics- **State Management**: Zustand

- **Advanced Filters**: Date ranges, store selection, period grouping- **Icons**: Lucide React

- **Role-Based Insights**: Super Admin sees all stores, Managers see only their store- **Charts**: Recharts

- **Date Handling**: date-fns

#### 5. Role-Based Access Control (RBAC)- **Build Tool**: Vite

- **Super Admin**: Full access to all stores, analytics, and ML insights- **Styling**: Custom CSS (No frameworks)

- **Store Manager**: Access limited to assigned store data

- **Persistent Authentication**: Zustand persist middleware for session management## 📦 Installation

- **Permission Checking**: Fine-grained access control for all features

- **Secure Login**: Protected routes with authentication```bash

npm install

#### ML Insights Dashboardnpm run dev

- **Sales Forecasting Tab**: XGBoost predictions with 30-day demand charts```

- **Churn Prediction Tab**: LightGBM customer risk analysis with retention actions

- **Temporal Analytics Tab**: TFT seasonal trends and 12-month forecastsOpen browser to `http://localhost:5174`

- **Restocking Plan Tab**: AI-optimized inventory replenishment schedule

- **Interactive Charts**: Built with Recharts for responsive visualizations## 🎯 Usage Guide



---### Inventory Management

Navigate to **Inventory** → View items, check alerts, transfer stock between stores

## 🛠️ Tech Stack

### Order Management

| Category | Technology |Go to **Orders** → Create new orders, track status, view invoices

|----------|-----------|

| **Frontend Framework** | React 19.1.1 |### Payment Processing

| **Routing** | React Router DOM 7.1.3 |Access **Payments** → Process transactions, view history, monitor success rates

| **State Management** | Zustand 5.0.3 with Persist |

| **Icons** | Lucide React 0.468.0 |### Delivery Tracking

| **Charts** | Recharts 2.15.0 |Open **Delivery** → Manage tasks, track agents, analyze by zone

| **Date Handling** | date-fns 4.1.0 |

| **Build Tool** | Vite 7.1.12 |### Customer Management

| **Styling** | Custom CSS (100% vanilla, no frameworks) |Navigate to **CRM** → View profiles, loyalty points, feedback, churn risk



---## 🎨 Features Included



## 📦 Installation & Setup✅ Multi-store inventory with real-time alerts  

✅ Complete order lifecycle from creation to delivery  

### Prerequisites✅ Payment integration (UPI, Cards, Wallets, Net Banking)  

- Node.js 18+ ✅ Delivery logistics with agent assignment  

- npm or yarn✅ Customer loyalty program with tier system  

✅ Churn prediction and feedback analytics  

### Install Dependencies✅ Interactive dashboard with charts  

```bash✅ Responsive design (mobile, tablet, desktop)  

npm install

```## 📝 Sample Data Included



### Run Development Server- 3 store locations

```bash- 8 inventory items

npm run dev- 3 sample orders

```- 4 delivery agents

- 4 customers with different tiers

Application will be available at: **http://localhost:5174**

---

### Build for Production

```bash**Version**: 1.0.0 | **Built with** ❤️ **by Spherenex Team**

npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🔑 Demo Login Credentials

### Super Admin (All Stores Access)
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**: Full access to all stores, analytics, and ML insights

### Store Manager (Store 1)
- **Username**: `manager1`
- **Password**: `manager123`
- **Permissions**: Access limited to Store 1 data only

### Store Manager (Store 2)
- **Username**: `manager2`
- **Password**: `manager123`
- **Permissions**: Access limited to Store 2 data only

---

## 📱 Application Structure

```
src/
├── components/
│   ├── Analytics/          # Sales analytics dashboard
│   ├── CRM/                # Customer management
│   ├── Dashboard/          # Main dashboard with stats
│   ├── Delivery/           # Delivery logistics
│   ├── Inventory/          # Multi-store inventory
│   ├── Login/              # Authentication page
│   ├── MLInsights/         # ML predictions dashboard
│   ├── Orders/             # Order lifecycle management
│   └── Payments/           # Payment processing
├── store/
│   ├── authStore.js        # Authentication & RBAC
│   ├── customerStore.js    # Customer data & CRM
│   ├── deliveryStore.js    # Delivery logistics
│   ├── inventoryStore.js   # Multi-store inventory
│   ├── mlStore.js          # ML prediction functions
│   ├── orderStore.js       # Order management
│   └── paymentStore.js     # Payment processing
├── App.jsx                 # Main app with routing
├── App.css                 # Global styles
└── main.jsx                # React entry point
```

---

## 🎯 Usage Guide

### 1️⃣ Login
- Navigate to the app (auto-redirects to login if not authenticated)
- Use demo credentials or click quick-login buttons
- Authentication persists across browser sessions

### 2️⃣ Dashboard
- View real-time stats: revenue, orders, inventory, deliveries
- Monitor recent orders and stock alerts
- Analyze customer distribution by loyalty tier
- Interactive charts for revenue trends and order distribution

### 3️⃣ Inventory Management
- **Inventory List**: View all products across stores with stock levels
- **Stock Alerts**: Monitor items below minimum threshold
- **Stock Transfer**: Move inventory between store locations
- Filter by store, search by product name/SKU

### 4️⃣ Order Management
- **Orders List**: View all orders with status tracking
- **Create Order**: Add new orders with multiple items
- **Order Details**: View invoices, payment status, tracking info
- Auto-generated invoices with tax calculations

### 5️⃣ Payment Processing
- Process payments with multiple methods (UPI, Cards, Cash, Net Banking)
- View transaction history with filters
- Monitor payment success rates
- Process refunds for completed transactions

### 6️⃣ Delivery & Logistics
- Assign deliveries to agents by zone
- Track delivery status in real-time
- Monitor agent workload and performance
- Zone-based delivery analytics

### 7️⃣ Customer Management (CRM)
- View 360° customer profiles
- Track loyalty points and tier progression
- Analyze churn risk with retention recommendations
- Collect and monitor customer feedback
- Personalized product recommendations

### 8️⃣ Sales Analytics
- Filter by date range, store, and period (Week/Month/Quarter)
- Compare ML predictions vs actual sales
- Analyze product performance rankings
- Multi-store revenue comparisons
- Role-based data access (Super Admin vs Store Manager)

### 9️⃣ ML Insights
- **Sales Forecasting**: 30-day demand predictions with confidence scores
- **Churn Prediction**: Customer risk analysis with retention actions
- **Temporal Analytics**: Seasonal trends and 12-month forecasts
- **Restocking Plan**: AI-optimized inventory replenishment schedule

---

## 📊 Sample Data Included

The application comes pre-loaded with realistic sample data:

- **3 Store Locations**: Downtown, Mall Branch, Airport Store
- **8 Inventory Items**: Products across Electronics, Clothing, Accessories
- **Sample Orders**: Orders in various states (pending, processing, shipped, delivered)
- **4 Delivery Agents**: With zone assignments and active deliveries
- **4 Customers**: Different loyalty tiers (Bronze, Silver, Gold, Platinum)
- **ML Predictions**: Pre-generated forecasts and analytics

---

## 🔮 Machine Learning Features

### Current Implementation
All ML functions are **mock implementations** that generate realistic predictions using:
- Random variations with controlled ranges
- Trend calculations based on historical patterns
- Confidence scoring algorithms
- Risk classification logic

### Production Integration Path
The ML store (`src/store/mlStore.js`) is architected for easy backend integration:

```javascript
// Current: Mock implementation
const prediction = generateSalesPredictions(products, historical);

// Production: Replace with API call
const prediction = await fetch('/api/ml/sales-predictions', {
  method: 'POST',
  body: JSON.stringify({ products, historical })
}).then(res => res.json());
```

**Backend ML API Requirements:**
- XGBoost model endpoint for sales forecasting
- LightGBM model endpoint for churn prediction
- TFT model endpoint for temporal forecasting
- Historical data pipeline for model training

---

## 🎨 Design Philosophy

- ✅ **100% Custom CSS**: No CSS frameworks (Tailwind/Bootstrap) per requirements
- ✅ **Responsive Design**: Mobile-first approach with tablet and desktop support
- ✅ **Accessible**: Semantic HTML and ARIA labels where appropriate
- ✅ **Performance**: Lazy loading, memoization, and optimized re-renders
- ✅ **Consistent**: Unified color palette and spacing system
- ✅ **Modern**: Gradient backgrounds, smooth animations, card-based layouts

---

## 🚀 Roadmap & Future Enhancements

### Potential Additions
- [ ] Real-time notifications with WebSocket
- [ ] Email/SMS integration for order updates
- [ ] Advanced inventory forecasting with seasonality
- [ ] Multi-currency support
- [ ] Export reports to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Integration with accounting software
- [ ] Advanced RBAC with custom permissions
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme

---

## 📄 License

This project is proprietary software developed for Spherenex.  
**Copyright © 2025 Spherenex. All rights reserved.**

---

## 👥 Support

For questions or support, contact the Spherenex development team.

---

**Version**: 2.0.0 (ML-Enabled)  
**Last Updated**: January 2025  
**Built with** ❤️ **by Spherenex Team**
