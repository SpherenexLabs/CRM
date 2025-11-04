import { AlertTriangle } from 'lucide-react';

function StockAlerts({ alerts, stores }) {
  const getStoreName = (storeId) => {
    return stores.find(s => s.id === storeId)?.name || 'Unknown';
  };

  const getStockPercentage = (quantity, threshold) => {
    return ((quantity / threshold) * 100).toFixed(0);
  };

  return (
    <div className="stock-alerts">
      <div className="alerts-header">
        <AlertTriangle className="alert-icon" />
        <h2>Stock Alerts - Items Below Threshold</h2>
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">
          <p>No stock alerts at this time. All inventory levels are healthy!</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {alerts.map(item => (
            <div key={item.id} className="alert-card">
              <div className="alert-header">
                <div>
                  <h3>{item.productName}</h3>
                  <p className="alert-sku">{item.sku}</p>
                </div>
                <span className="alert-badge">Low Stock</span>
              </div>
              
              <div className="alert-details">
                <div className="alert-row">
                  <span className="label">Store:</span>
                  <span className="value">{getStoreName(item.storeId)}</span>
                </div>
                <div className="alert-row">
                  <span className="label">Current Stock:</span>
                  <span className="value danger">{item.quantity} units</span>
                </div>
                <div className="alert-row">
                  <span className="label">Min Threshold:</span>
                  <span className="value">{item.minThreshold} units</span>
                </div>
                <div className="alert-row">
                  <span className="label">Stock Level:</span>
                  <span className="value danger">{getStockPercentage(item.quantity, item.minThreshold)}%</span>
                </div>
              </div>

              <div className="stock-progress">
                <div 
                  className="stock-progress-bar"
                  style={{ width: `${getStockPercentage(item.quantity, item.minThreshold)}%` }}
                ></div>
              </div>

              <div className="alert-actions">
                <button className="btn-alert btn-primary">Reorder Now</button>
                <button className="btn-alert btn-secondary">Transfer Stock</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockAlerts;




