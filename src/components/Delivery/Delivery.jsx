import { useState } from 'react';
import { Truck, User, MapPin, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import useDeliveryStore from '../../store/deliveryStore';
import './Delivery.css';

function Delivery() {
  const { deliveryAgents, deliveryTasks, assignDelivery, updateDeliveryStatus, getDeliveryAnalytics } = useDeliveryStore();
  const [activeTab, setActiveTab] = useState('tasks');
  const analytics = getDeliveryAnalytics();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    if (window.confirm(`Update delivery status to "${newStatus}"?`)) {
      updateDeliveryStatus(taskId, newStatus);
      alert(`Delivery status updated to ${newStatus}!`);
    }
  };

  const stats = [
    { title: 'Total Deliveries', value: deliveryTasks.length, icon: <Truck />, color: 'blue' },
    { title: 'In Transit', value: deliveryTasks.filter(t => t.status === 'in-transit').length, icon: <MapPin />, color: 'orange' },
    { title: 'Delivered', value: deliveryTasks.filter(t => t.status === 'delivered').length, icon: <BarChart3 />, color: 'green' },
    { title: 'Active Agents', value: deliveryAgents.filter(a => a.activeDeliveries > 0).length, icon: <User />, color: 'purple' },
  ];

  return (
    <div className="delivery-container">
      <h1>Delivery & Logistics</h1>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Delivery Tasks</button>
        <button className={`tab ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>Delivery Agents</button>
        <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      {activeTab === 'tasks' && (
        <div className="table-container">
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Agent</th>
                <th>Address</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryTasks.map(task => (
                <tr key={task.id}>
                  <td data-label="Task ID">{task.id}</td>
                  <td data-label="Order ID">#{task.orderId}</td>
                  <td data-label="Customer">{task.customerName}</td>
                  <td data-label="Agent">{task.agentName}</td>
                  <td data-label="Address">{task.address}</td>
                  <td data-label="Zone">{task.zone}</td>
                  <td data-label="Status"><span className={`status-badge status-${task.status === 'delivered' ? 'success' : task.status === 'in-transit' ? 'info' : 'warning'}`}>{task.status}</span></td>
                  <td data-label="Assigned">{formatDate(task.assignedAt)}</td>
                  <td data-label="Actions">
                    {task.status === 'assigned' && (
                      <button onClick={() => handleStatusUpdate(task.id, 'in-transit')} className="btn-sm btn-primary">Start Transit</button>
                    )}
                    {task.status === 'in-transit' && (
                      <button onClick={() => handleStatusUpdate(task.id, 'delivered')} className="btn-sm btn-success">Mark Delivered</button>
                    )}
                    {task.status === 'delivered' && (
                      <span className="text-success">✓ Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="agents-grid">
          {deliveryAgents.map(agent => (
            <div key={agent.id} className="agent-card">
              <h3>{agent.name}</h3>
              <div className="agent-info">
                <p><strong>Phone:</strong> {agent.phone}</p>
                <p><strong>Zone:</strong> {agent.zone}</p>
                <p><strong>Active:</strong> {agent.activeDeliveries}</p>
                <p><strong>Total Deliveries:</strong> {agent.totalDeliveries}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-container">
          <div className="analytics-section">
            <h3>Deliveries by Zone</h3>
            {Object.entries(analytics.byZone).map(([zone, count]) => (
              <div key={zone} className="analytics-row">
                <span>{zone}</span>
                <span className="badge">{count}</span>
              </div>
            ))}
          </div>
          <div className="analytics-section">
            <h3>Deliveries by Status</h3>
            {Object.entries(analytics.byStatus).map(([status, count]) => (
              <div key={status} className="analytics-row">
                <span>{status}</span>
                <span className="badge">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Delivery;




