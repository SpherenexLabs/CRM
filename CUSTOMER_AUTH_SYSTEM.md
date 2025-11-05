# Customer Authentication System

## Overview
The application now supports customer registration and login with admin management capabilities.

## Features

### 1. Customer Registration
- New customers can register with:
  - Full Name (required)
  - Email Address (required) - used for login
  - Phone Number (optional)
  - Password (required, minimum 6 characters)
  - Confirm Password (required)

### 2. Customer Login
- Customers can login using:
  - Email address
  - Password
- Login page supports both staff (username) and customers (email)

### 3. Admin Customer Management
- Super Admin can view all registered customers
- Features include:
  - Search by name, email, or phone
  - Filter by status (Active/Inactive)
  - View customer details (name, email, phone, registration date)
  - Delete customer accounts
  - When a customer account is deleted, they cannot login anymore

## User Roles

### Super Admin
- Username: `admin`
- Password: `admin123`
- Full access to all features including customer management

### Store Customers (Staff)
- Username: `manager1` or `manager2`
- Password: `manager123`
- Access to store management features

### Registered Customers
- Login with email and password
- Can view their own data and place orders
- Account managed by admin

## How to Use

### For Customers:
1. Go to login page
2. Click "Register as Customer"
3. Fill in registration form
4. Submit and wait for success message
5. Login with registered email and password

### For Admin:
1. Login as Super Admin
2. Navigate to "Customers" from sidebar
3. View all registered customers
4. Search/filter customers as needed
5. Delete customer accounts if necessary

## Technical Details

### Data Structure
Customer accounts are stored in Firebase under `customerAccounts/` with:
```javascript
{
  email: string,
  password: string, // Note: In production, this should be hashed
  name: string,
  phone: string,
  role: 'Customer',
  createdAt: timestamp,
  isActive: boolean
}
```

### Authentication Flow
1. User enters email/username and password
2. System checks staff users first
3. If not found, checks customer accounts
4. Only active customers can login
5. Session persisted using Zustand persist middleware

### Security Notes
- Passwords are currently stored in plain text (for demo purposes)
- In production, implement:
  - Password hashing (bcrypt, argon2)
  - Email verification
  - Password reset functionality
  - Rate limiting for login attempts
  - Session tokens/JWT

## Files Added/Modified

### New Files:
- `src/components/Login/CustomerRegister.jsx` - Customer registration component
- `src/components/Login/CustomerRegister.css` - Registration styling
- `src/components/Admin/AdminCustomers.jsx` - Admin customer management
- `src/components/Admin/AdminCustomers.css` - Customer management styling

### Modified Files:
- `src/store/authStore.js` - Added customer registration, login, and delete functions
- `src/components/Login/Login.jsx` - Added register link and email support
- `src/components/Login/Login.css` - Added register button styling
- `src/components/Admin/AdminCRM.jsx` - Added Customers route
- `src/App.jsx` - Initialize customer accounts on app load

## Admin Panel Navigation
The admin sidebar now includes 6 sections:
1. Dashboard
2. Orders
3. Inventory
4. Payments
5. Stores
6. **Customers** (new)

## Future Enhancements
- Customer profile editing
- Customer order history view
- Customer-specific dashboards
- Email notifications
- Password recovery
- Two-factor authentication
- Customer activity logs
