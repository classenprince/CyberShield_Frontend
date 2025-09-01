# Cyber Shield OSINT Dashboard

A real-time OSINT (Open Source Intelligence) dashboard that dynamically switches between different data sources to simulate live data updates from Gephi software.

## 🚀 Features

### Dynamic Data Source Switching
- **Automatic switching** between CSV data sources every 10 seconds
- **Real-time countdown timer** showing when next switch will occur
- **Visual indicators** for current data source and switching status
- **Data source tracking** with switch counter

### Data Sources (in sequence)
1. **Network Analysis (Primary)** - `nodes_export_for_frontend (1).csv`
   - Initial network topology from Gephi
   - Contains centrality metrics, modularity classes, etc.

2. **User Metrics (Secondary)** - `fake_user_metrics.csv`
   - Updated user behavior metrics from Gephi
   - User engagement and activity data

3. **User Network Metrics (Tertiary)** - `user_network_metrics.csv`
   - Latest network analysis from Gephi
   - Advanced network metrics and relationships

## 🔄 How It Works

1. **Startup**: Dashboard loads with data from `nodes_export_for_frontend (1).csv`
2. **After 10 seconds**: Automatically switches to `fake_user_metrics.csv`
3. **After 20 seconds**: Switches to `user_network_metrics.csv`
4. **Continuous cycle**: Keeps rotating through all sources every 10 seconds

## 📊 Dashboard Components

- **OSINT Dashboard**: Main network analysis with hub/bridge detection
- **Trending Hashtags**: Social media hashtag analysis
- **Real-time Alerts**: Automated threat detection based on metrics
- **Data Source Status**: Live monitoring of current data source

## 🛠️ Technical Implementation

- **React.js** frontend with hooks for state management
- **Papa Parse** for CSV data processing
- **Auto-refresh intervals** for seamless data switching
- **Responsive design** for mobile and desktop
- **Error handling** for CSV parsing and loading

## 📁 File Structure

```
public/
├── nodes_export_for_frontend (1).csv    # Primary network data
├── fake_user_metrics.csv                # Secondary user metrics
├── user_network_metrics.csv             # Tertiary network data
└── data_97cd739e_split_1.csv           # Hashtags data

src/
├── App.js                              # Main app with data switching logic
├── components/
│   ├── Dashboard.js                    # OSINT dashboard component
│   ├── MetricsPanel.js                 # Network metrics display
│   ├── AlertsSection.js                # Threat alerts
│   └── HashtagsTrending.js             # Trending hashtags
└── App.css                             # Main styling
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **View dashboard** at `http://localhost:3000`

## 🔧 Customization

### Change Switch Interval
Modify the interval in `App.js`:
```javascript
// Change from 10000ms (10 seconds) to desired interval
intervalRef.current = setInterval(() => {
  switchToNextDataSource();
}, 15000); // 15 seconds
```

### Add New Data Sources
Add new sources to the `dataSources` array in `App.js`:
```javascript
const dataSources = [
  // ... existing sources
  { 
    name: 'New Source', 
    url: '/new_data.csv', 
    type: 'network',
    description: 'Description of new data source'
  }
];
```

### Modify Data Processing
Update the `loadDataFromSource` function to handle new data types and processing logic.

## 📈 Data Flow

```
Gephi Software → CSV Export → Frontend Fetch → Data Processing → Dashboard Display
     ↓              ↓            ↓              ↓              ↓
  Network      CSV Files    HTTP Request   Papa Parse    React State
  Analysis     (Public)     (Every 10s)    Processing    Updates
```

## 🎯 Use Cases

- **OSINT Investigations**: Real-time network analysis
- **Threat Intelligence**: Live monitoring of suspicious activities
- **Social Network Analysis**: Dynamic relationship mapping
- **Data Visualization**: Interactive network graphs and metrics
- **Research & Development**: Testing data processing pipelines

## 🔒 Security Notes

- All data is processed client-side
- No sensitive data is transmitted to external servers
- CSV files should be placed in the `public` folder for access
- Consider implementing authentication for production use

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the dashboard functionality.
