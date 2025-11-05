import { useState } from 'react';
import { ShoppingCart, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';
import OrdersList from './OrdersList';
import CreateOrder from './CreateOrder';
import OrderDetails from './OrderDetails';
import './Orders.css';

function Orders() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders: allOrders, getTotalRevenue } = useOrderStore();
  const { currentUser } = useAuthStore();

  // Filter orders based on user role
  const orders = currentUser?.role === 'Customer' 
    ? allOrders.filter(order => order.customerAccountId === currentUser.id)
    : allOrders;

  const ordersByStatus = {
    placed: orders.filter(o => o.status === 'placed'),
    shipped: orders.filter(o => o.status === 'shipped'),
    delivered: orders.filter(o => o.status === 'delivered'),
    cancelled: orders.filter(o => o.status === 'cancelled'),
  };

  // Calculate revenue from filtered orders
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.paymentStatus === 'paid') {
      return sum + (order.grandTotal || 0);
    }
    return sum;
  }, 0);

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <ShoppingCart className="stat-icon" />,
      color: 'blue'
    },
    {
      title: 'Pending Orders',
      value: ordersByStatus.placed.length,
      icon: <Package className="stat-icon" />,
      color: 'orange'
    },
    {
      title: 'In Transit',
      value: ordersByStatus.shipped.length,
      icon: <Truck className="stat-icon" />,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <CheckCircle className="stat-icon" />,
      color: 'green'
    }
  ];

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Order Lifecycle Management</h1>
        <p>Manage orders from creation to delivery</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create New Order
        </button>
        <button 
          className={`tab ${activeTab === 'placed' ? 'active' : ''}`}
          onClick={() => setActiveTab('placed')}
        >
          Placed ({ordersByStatus.placed.length})
        </button>
        <button 
          className={`tab ${activeTab === 'shipped' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipped')}
        >
          Shipped ({ordersByStatus.shipped.length})
        </button>
        <button 
          className={`tab ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered ({ordersByStatus.delivered.length})
        </button>
      </div>

      <div className="orders-content">
        {selectedOrder ? (
          <OrderDetails 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        ) : activeTab === 'create' ? (
          <CreateOrder onSuccess={() => setActiveTab('all')} />
        ) : (
          <OrdersList 
            orders={activeTab === 'all' ? orders : ordersByStatus[activeTab]} 
            onSelectOrder={setSelectedOrder}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;




