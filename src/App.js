import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import Dashboard from './components/Dashboard';
import HashtagsTrending from './components/HashtagsTrending';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const intervalRef = useRef(null);

  // Define the sequence of data sources (hidden from user)
  const dataSources = [
    '/nodes_export_for_frontend (1).csv',
    '/fake_user_metrics.csv',
    '/user_network_metrics.csv'
  ];

  let currentSourceIndex = 0;

  // Function to load data from current source
  const loadDataFromSource = async () => {
    try {
      const response = await fetch(dataSources[currentSourceIndex]);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          let processedData = [];
          
          // Process data based on which file we're reading
          if (currentSourceIndex === 0) {
            // First file: network analysis data
            processedData = results.data.filter(row => 
              row.Label && row.Label !== 'Unnamed: 0' && 
              row['Closeness Centrality'] !== '0.0'
            ).map(row => ({
              ...row,
              'Closeness Centrality': parseFloat(row['Closeness Centrality']) || 0,
              'Betweenness Centrality': parseFloat(row['Betweenness Centrality']) || 0,
              'Eccentricity': parseInt(row['Eccentricity']) || 0,
              'Modularity Class': parseInt(row['Modularity Class']) || 0
            }));
          } else if (currentSourceIndex === 1) {
            // Second file: fake_user_metrics.csv - has same structure as network data
            processedData = results.data.filter(row => 
              row.Label && row['Closeness Centrality'] && row['Betweenness Centrality']
            ).map(row => ({
              ...row,
              'Closeness Centrality': parseFloat(row['Closeness Centrality']) || 0,
              'Betweenness Centrality': parseFloat(row['Betweenness Centrality']) || 0,
              'Eccentricity': parseInt(row['Eccentricity']) || 0,
              'Modularity Class': parseInt(row['Modularity Class']) || 0
            }));
          } else {
            // Third file: user network metrics
            processedData = results.data.filter(row => 
              row.Label && row.Label !== 'Unnamed: 0'
            ).map(row => ({
              ...row,
              'Closeness Centrality': parseFloat(row['Closeness Centrality']) || 0,
              'Betweenness Centrality': parseFloat(row['Betweenness Centrality']) || 0,
              'Eccentricity': parseInt(row['Eccentricity']) || 0,
              'Modularity Class': parseInt(row['Modularity Class']) || 0
            }));
          }
          
          setData(processedData);
          setLoading(false);
          setRefreshing(false);
          console.log(`Loaded data from source ${currentSourceIndex + 1}:`, {
            source: dataSources[currentSourceIndex],
            recordCount: processedData.length,
            sampleData: processedData.slice(0, 3)
          });
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setLoading(false);
          setRefreshing(false);
        }
      });
    } catch (error) {
      console.error('Error loading CSV:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to switch to next data source
  const switchToNextDataSource = () => {
    setRefreshing(true); // Show refreshing animation
    currentSourceIndex = (currentSourceIndex + 1) % dataSources.length;
    loadDataFromSource();
  };

  useEffect(() => {
    // Load initial data from first source
    loadDataFromSource();
    
    // Set up timer to switch data sources every 10 seconds
    intervalRef.current = setInterval(() => {
      switchToNextDataSource();
    }, 10000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hashtags':
        return <HashtagsTrending />;
      case 'dashboard':
      default:
        return <Dashboard data={data} refreshing={refreshing} />;
    }
  };

  return (
    <div className="App">
      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          🛡️ OSINT Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'hashtags' ? 'active' : ''}`}
          onClick={() => setActiveTab('hashtags')}
        >
          🔥 Live Hashtags Trending
        </button>
      </div>
      
      {/* Loading indicator */}
      {loading && activeTab === 'dashboard' ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading fresh OSINT data...</p>
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
}

export default App; 