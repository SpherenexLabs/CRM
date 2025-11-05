import { useState } from 'react';
import { TrendingUp, Brain, BarChart3, Target, AlertCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useMLStore from '../../store/mlStore';
import useInventoryStore from '../../store/inventoryStore';
import useCustomerStore from '../../store/customerStore';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';
import './MLInsights.css';

function MLInsights() {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('sales');
  const { 
    generateSalesPredictions, 
    generateDemandForecast,
    predictTopSellers,
    optimizeRestocking,
    predictCustomerChurn,
    classifyCustomerValue,
    generatePersonalizedOffers,
    generateTemporalForecast,
    analyzeSeasonalTrends,
    predictStockLevels
  } = useMLStore();

  const { inventory } = useInventoryStore();
  const { customers } = useCustomerStore();
  const { orders: allOrders } = useOrderStore();

  // Filter orders based on user role
  const orders = currentUser?.role === 'Customer' 
    ? allOrders.filter(order => order.customerAccountId === currentUser.id)
    : allOrders;

  // Generate predictions on mount using REAL DATA
  const [salesPredictions] = useState(() => {
    return generateSalesPredictions(inventory.slice(0, 5), orders);
  });

  const [demandForecast] = useState(() => 
    inventory.length > 0 ? generateDemandForecast(inventory[0], 30, orders) : []
  );

  const [topSellers] = useState(() => predictTopSellers(inventory, orders));
  
  const [restockingPlan] = useState(() => 
    optimizeRestocking(inventory, salesPredictions)
  );

  const [churnPredictions] = useState(() => 
    predictCustomerChurn(customers, orders)
  );

  const [customerValues] = useState(() => 
    classifyCustomerValue(customers, orders)
  );

  const [temporalForecast] = useState(() => 
    inventory.length > 0 ? generateTemporalForecast(inventory[0], 12) : []
  );

  const [seasonalTrends] = useState(() => analyzeSeasonalTrends());

  return (
    <div className="ml-insights-container">
      <div className="ml-header">
        <div>
          <h1><Brain size={32} /> ML Insights & Predictions</h1>
          <p>Advanced machine learning analytics for business optimization</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
          <TrendingUp size={18} /> Sales Forecasting
        </button>
        <button className={`tab ${activeTab === 'churn' ? 'active' : ''}`} onClick={() => setActiveTab('churn')}>
          <Target size={18} /> Churn Prediction
        </button>
        <button className={`tab ${activeTab === 'temporal' ? 'active' : ''}`} onClick={() => setActiveTab('temporal')}>
          <BarChart3 size={18} /> Temporal Analytics
        </button>
        <button className={`tab ${activeTab === 'restocking' ? 'active' : ''}`} onClick={() => setActiveTab('restocking')}>
          <AlertCircle size={18} /> Restocking Plan
        </button>
      </div>

      {/* Sales Forecasting (XGBoost) */}
      {activeTab === 'sales' && (
        <div className="ml-section">
          <div className="section-header">
            <h2>XGBoost Sales Prediction & Demand Forecasting</h2>
            <span className="ml-badge">XGBoost Model</span>
          </div>

          {/* 30-Day Demand Forecast */}
          <div className="chart-card">
            <h3>30-Day Demand Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={demandForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                <Legend />
                <Area type="monotone" dataKey="upperBound" stackId="1" stroke="#d1d5db" fill="#d1d5db" fillOpacity={0.3} name="Upper Bound" />
                <Area type="monotone" dataKey="predicted" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Predicted Demand" />
                <Area type="monotone" dataKey="lowerBound" stackId="3" stroke="#d1d5db" fill="#d1d5db" fillOpacity={0.3} name="Lower Bound" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sales Predictions */}
          <div className="predictions-grid">
            <div className="predictions-list">
              <h3>Product Sales Predictions</h3>
              <table className="ml-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>Predicted Sales</th>
                    <th>Confidence</th>
                    <th>Trend</th>
                    <th>Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {salesPredictions.map((pred, idx) => (
                    <tr key={idx}>
                      <td>{pred.productName}</td>
                      <td>{pred.currentStock}</td>
                      <td className="highlight">{pred.predictedSales}</td>
                      <td>
                        <div className="confidence-bar">
                          <div className="confidence-fill" style={{width: `${pred.confidence * 100}%`}}></div>
                          <span>{(pred.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`trend-badge ${pred.trend === 'increasing' ? 'positive' : 'negative'}`}>
                          {pred.trend === 'increasing' ? 'â†‘' : 'â†“'} {pred.trend}
                        </span>
                      </td>
                      <td className={pred.recommendedRestock > 0 ? 'urgent' : ''}>{pred.recommendedRestock || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Sellers */}
            <div className="top-sellers-card">
              <h3>Predicted Top Sellers (Next Week)</h3>
              <div className="top-sellers-list">
                {topSellers.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="top-seller-item">
                    <div className="rank">#{idx + 1}</div>
                    <div className="seller-info">
                      <strong>{item.productName}</strong>
                      <div className="seller-stats">
                        <span>Predicted: {Math.round(item.predictedSales)} units</span>
                        <span className="confidence">Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Churn Prediction (LightGBM) */}
      {activeTab === 'churn' && (
        <div className="ml-section">
          <div className="section-header">
            <h2>LightGBM Customer Churn & Value Classification</h2>
            <span className="ml-badge lightgbm">LightGBM Model</span>
          </div>

          <div className="churn-grid">
            {/* Churn Predictions */}
            <div className="churn-predictions">
              <h3>Churn Risk Analysis</h3>
              {churnPredictions.slice(0, 10).map((pred, idx) => (
                <div key={idx} className={`churn-card risk-${pred.churnRisk}`}>
                  <div className="churn-header">
                    <strong>{pred.customerName}</strong>
                    <span className={`risk-badge risk-${pred.churnRisk}`}>
                      {pred.churnRisk.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="churn-details">
                    <div className="detail-row">
                      <span>Churn Score:</span>
                      <strong>{(pred.churnScore * 100).toFixed(0)}%</strong>
                    </div>
                    <div className="detail-row">
                      <span>Days Since Purchase:</span>
                      <strong>{pred.daysSinceLastPurchase}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Retention Probability:</span>
                      <strong className="positive">{(pred.retentionProbability * 100).toFixed(0)}%</strong>
                    </div>
                  </div>
                  <div className="recommended-actions">
                    <strong>Recommended Actions:</strong>
                    <ul>
                      {pred.recommendedActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Value Segments */}
            <div className="value-segments">
              <h3>Customer Value Segmentation</h3>
              <div className="segments-chart">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={customerValues.reduce((acc, cv) => {
                    const existing = acc.find(a => a.segment === cv.segment);
                    if (existing) existing.count++;
                    else acc.push({ segment: cv.segment, count: 1 });
                    return acc;
                  }, [])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="value-list">
                {customerValues.slice(0, 8).map((cv, idx) => (
                  <div key={idx} className="value-item">
                    <div>
                      <strong>{cv.customerName}</strong>
                      <span className={`segment-badge segment-${cv.segment.toLowerCase().replace('-', '')}`}>
                        {cv.segment}
                      </span>
                    </div>
                    <div className="value-stats">
                      <span>LTV: ₹{cv.lifetimeValue.toFixed(0)}</span>
                      <span>Score: {cv.valueScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temporal Analytics (TFT) */}
      {activeTab === 'temporal' && (
        <div className="ml-section">
          <div className="section-header">
            <h2>Temporal Fusion Transformer - Time Series Analytics</h2>
            <span className="ml-badge tft">TFT Model</span>
          </div>

          {/* 12-Month Forecast */}
          <div className="chart-card">
            <h3>12-Month Revenue Forecast</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={temporalForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} name="Predicted Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Seasonal Trends */}
          <div className="seasonal-trends">
            <h3>Seasonal Trend Analysis</h3>
            <div className="trends-grid">
              {seasonalTrends.map((trend, idx) => (
                <div key={idx} className="trend-card">
                  <h4>{trend.season}</h4>
                  <div className="trend-stat">
                    <span>Average Increase:</span>
                    <strong className="positive">+{trend.averageIncrease}%</strong>
                  </div>
                  <div className="trend-info">
                    <p><strong>Peak Months:</strong> {trend.peakMonths.join(', ')}</p>
                    <p><strong>Top Categories:</strong> {trend.topCategories.join(', ')}</p>
                    <div className="recommendation-box">
                      <strong>ðŸ’¡ Recommendation:</strong>
                      <p>{trend.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Restocking Optimization */}
      {activeTab === 'restocking' && (
        <div className="ml-section">
          <div className="section-header">
            <h2>AI-Optimized Restocking Schedule</h2>
            <span className="ml-badge">Optimization Engine</span>
          </div>

          <div className="restocking-table">
            <table className="ml-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Daily Demand</th>
                  <th>Days Left</th>
                  <th>Urgency</th>
                  <th>Order Qty</th>
                  <th>Order By</th>
                </tr>
              </thead>
              <tbody>
                {restockingPlan.slice(0, 10).map((plan, idx) => (
                  <tr key={idx} className={plan.urgency === 'high' ? 'urgent-row' : ''}>
                    <td><strong>{plan.productName}</strong></td>
                    <td>{plan.currentStock}</td>
                    <td>{plan.predictedDailyDemand}</td>
                    <td className={plan.daysOfStockLeft < 7 ? 'warning' : ''}>{plan.daysOfStockLeft}</td>
                    <td>
                      <span className={`urgency-badge urgency-${plan.urgency}`}>
                        {plan.urgency.toUpperCase()}
                      </span>
                    </td>
                    <td className="highlight">{plan.recommendedOrderQty}</td>
                    <td>{new Date(plan.suggestedOrderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MLInsights;




