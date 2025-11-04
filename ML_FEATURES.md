# ML Features Quick Reference Guide

## 🤖 Machine Learning Implementation Overview

This CRM system includes **three advanced ML prediction models** that provide actionable business insights. Currently implemented as **mock algorithms** ready for backend API integration.

---

## 1. XGBoost Sales Prediction

### Location
`src/store/mlStore.js` → `generateSalesPredictions()`

### Purpose
Predict product sales for the next 7-30 days with confidence intervals.

### Input Parameters
```javascript
{
  products: Array<{id, name, sku, currentStock}>,
  historicalData: Object<{
    productId: {avgSales, seasonality, trends}
  }>
}
```

### Output
```javascript
[{
  productId: string,
  productName: string,
  currentStock: number,
  predictedSales: number,           // Units expected to sell
  confidence: number,                // 0.0 - 1.0
  trend: 'increasing' | 'decreasing',
  recommendedRestock: number,        // Units to order
  factors: {
    seasonality: number,
    historicalPerformance: number,
    currentTrend: number
  }
}]
```

### Use Cases
- **Inventory Planning**: Determine restock quantities
- **Promotional Planning**: Identify products for targeted campaigns
- **Budget Forecasting**: Predict revenue from product sales

### How to Use
```javascript
import useMLStore from './store/mlStore';

function MyComponent() {
  const { generateSalesPredictions } = useMLStore();
  const predictions = generateSalesPredictions(products, historical);
  
  // Display predictions in UI
  predictions.forEach(pred => {
    console.log(`${pred.productName}: ${pred.predictedSales} units (${pred.confidence * 100}% confidence)`);
  });
}
```

---

## 2. XGBoost Demand Forecasting

### Location
`src/store/mlStore.js` → `generateDemandForecast()`

### Purpose
30-day hourly/daily demand forecast with upper and lower confidence bounds.

### Input Parameters
```javascript
{
  product: Object<{id, name, sku, currentStock}>,
  days: number (default: 30)
}
```

### Output
```javascript
[{
  date: Date,
  predicted: number,      // Expected demand
  upperBound: number,     // 95% confidence upper limit
  lowerBound: number,     // 95% confidence lower limit
  dayOfWeek: number,
  isWeekend: boolean
}]
```

### Use Cases
- **Peak Demand Identification**: Know when to staff up
- **Stock Buffer Calculation**: Avoid stockouts during high-demand periods
- **Pricing Strategy**: Dynamic pricing based on predicted demand

### Visualization
Displayed as **Area Chart** in ML Insights → Sales Forecasting tab.

---

## 3. LightGBM Customer Churn Prediction

### Location
`src/store/mlStore.js` → `predictCustomerChurn()`

### Purpose
Identify customers at risk of churning with retention recommendations.

### Input Parameters
```javascript
{
  customers: Array<{id, name, email, loyaltyPoints, tier}>,
  orders: Array<{customerId, date, total}>
}
```

### Output
```javascript
[{
  customerId: string,
  customerName: string,
  churnScore: number,              // 0.0 - 1.0 (1.0 = highest risk)
  churnRisk: 'low' | 'medium' | 'high',
  retentionProbability: number,    // 0.0 - 1.0
  daysSinceLastPurchase: number,
  recommendedActions: Array<string>, // e.g., ["Offer 15% discount", "Send re-engagement email"]
  factors: {
    recency: number,
    frequency: number,
    monetary: number
  }
}]
```

### Risk Categories
- **High Risk** (score > 0.7): Immediate action required
- **Medium Risk** (score 0.4-0.7): Proactive engagement needed
- **Low Risk** (score < 0.4): Maintain regular communication

### Use Cases
- **Retention Campaigns**: Target at-risk customers before they leave
- **Personalized Offers**: Generate discounts/incentives based on churn score
- **Customer Success**: Prioritize support for high-value churners

### Visualization
Displayed as **Risk Cards** in ML Insights → Churn Prediction tab with color-coded alerts.

---

## 4. LightGBM Customer Value Classification

### Location
`src/store/mlStore.js` → `classifyCustomerValue()`

### Purpose
Segment customers into value tiers for targeted marketing.

### Output Segments
```javascript
{
  segment: 'VIP' | 'High-Value' | 'Medium-Value' | 'Low-Value',
  lifetimeValue: number,      // Total customer revenue
  valueScore: number,         // 0-100 calculated score
  tier: string,               // Loyalty tier
  marketingRecommendation: string
}
```

### Segment Criteria
- **VIP**: LTV > $5000, valueScore > 80
- **High-Value**: LTV $2000-$5000, valueScore 60-80
- **Medium-Value**: LTV $500-$2000, valueScore 40-60
- **Low-Value**: LTV < $500, valueScore < 40

### Use Cases
- **VIP Programs**: Exclusive benefits for top customers
- **Marketing Budget Allocation**: Spend more on high-value segments
- **Product Recommendations**: Tailor suggestions by value tier

---

## 5. Temporal Fusion Transformer (TFT) Revenue Forecasting

### Location
`src/store/mlStore.js` → `generateTemporalForecast()`

### Purpose
12-month revenue forecast with temporal dependencies and attention mechanisms.

### Input Parameters
```javascript
{
  product: Object,
  months: number (default: 12)
}
```

### Output
```javascript
[{
  month: string,           // 'Jan 2025', 'Feb 2025', ...
  predicted: number,       // Predicted revenue
  confidence: number,      // Model confidence
  trend: string,           // 'stable', 'growing', 'declining'
  seasonalFactor: number   // Seasonal multiplier
}]
```

### Use Cases
- **Annual Planning**: Budget and resource allocation
- **Growth Projections**: Investor presentations and forecasts
- **Seasonal Staffing**: Hire/reduce staff based on predicted demand

### Visualization
Displayed as **Line Chart** in ML Insights → Temporal Analytics tab.

---

## 6. Seasonal Trend Analysis

### Location
`src/store/mlStore.js` → `analyzeSeasonalTrends()`

### Purpose
Identify recurring seasonal patterns across business cycles.

### Output
```javascript
[{
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter',
  averageIncrease: number,        // Percentage increase vs baseline
  peakMonths: Array<string>,      // ['March', 'April']
  topCategories: Array<string>,   // ['Electronics', 'Clothing']
  recommendation: string          // Actionable business advice
}]
```

### Use Cases
- **Inventory Stocking**: Pre-order seasonal products
- **Marketing Campaigns**: Plan promotions around peak seasons
- **Staffing**: Schedule more employees during busy seasons

---

## 7. Restocking Optimization

### Location
`src/store/mlStore.js` → `optimizeRestocking()`

### Purpose
AI-recommended restock schedule based on predicted demand and current inventory.

### Output
```javascript
[{
  productName: string,
  currentStock: number,
  predictedDailyDemand: number,
  daysOfStockLeft: number,
  urgency: 'low' | 'medium' | 'high',
  recommendedOrderQty: number,
  suggestedOrderDate: Date,
  estimatedCost: number
}]
```

### Urgency Levels
- **High**: < 7 days of stock remaining
- **Medium**: 7-14 days of stock remaining
- **Low**: > 14 days of stock remaining

### Use Cases
- **Automated Procurement**: Generate purchase orders automatically
- **Cash Flow Management**: Order inventory at optimal times
- **Stockout Prevention**: Avoid lost sales from out-of-stock items

---

## Integration with Backend ML API

### Current State
All ML functions return **mock data** with realistic patterns.

### Production Integration Steps

#### Step 1: Create Backend ML Endpoints
```javascript
POST /api/ml/sales-predictions
POST /api/ml/demand-forecast
POST /api/ml/churn-prediction
POST /api/ml/customer-classification
POST /api/ml/temporal-forecast
POST /api/ml/seasonal-analysis
```

#### Step 2: Replace Mock Functions
```javascript
// BEFORE (Mock)
const generateSalesPredictions = (products, historical) => {
  return products.map(p => ({
    predictedSales: Math.random() * 100,
    // ...
  }));
};

// AFTER (API Integration)
const generateSalesPredictions = async (products, historical) => {
  const response = await fetch('/api/ml/sales-predictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products, historical })
  });
  return response.json();
};
```

#### Step 3: Update Zustand Store
```javascript
// Make ML store actions async
set({ loading: true, error: null });
try {
  const predictions = await apiGenerateSalesPredictions(products);
  set({ predictions, loading: false });
} catch (error) {
  set({ error: error.message, loading: false });
}
```

#### Step 4: Add Loading States to UI
```javascript
const { predictions, loading, error } = useMLStore();

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <PredictionsChart data={predictions} />;
```

---

## Model Training Requirements

### Data Pipeline
1. **Historical Sales Data**: 2+ years of daily sales records
2. **Customer Data**: Purchase history, demographics, behavior
3. **Inventory Data**: Stock levels, restock events, stockouts
4. **External Factors**: Seasonality, promotions, market trends

### Model Training Frequency
- **Sales Forecasting**: Retrain weekly with last 90 days of data
- **Churn Prediction**: Retrain monthly with last 12 months of data
- **Temporal Forecast**: Retrain quarterly with last 3 years of data

### Performance Metrics
- **Sales Forecasting**: RMSE, MAPE, R²
- **Churn Prediction**: AUC-ROC, Precision, Recall
- **Temporal Forecast**: SMAPE, Coverage

---

## Best Practices

### 1. Always Show Confidence Scores
Users need to know how reliable predictions are.

### 2. Provide Actionable Recommendations
Don't just show a number—tell users what to do about it.

### 3. Visualize Trends
Charts make patterns easier to understand than raw numbers.

### 4. Update Predictions Regularly
Stale predictions lose value quickly.

### 5. Log Prediction Accuracy
Track actual vs predicted to improve models over time.

---

## Troubleshooting

### Issue: Predictions seem unrealistic
**Solution**: Adjust random ranges in mock functions or integrate real ML API.

### Issue: Performance slow with large datasets
**Solution**: Implement pagination, lazy loading, or server-side processing.

### Issue: Churn predictions all showing "low risk"
**Solution**: Increase sensitivity thresholds or add more customer behavior factors.

---

**Last Updated**: January 2025  
**For Questions**: Contact ML team or check `src/store/mlStore.js`
