import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './HashtagsTrending.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HashtagsTrending = () => {
  const [hashtagsData, setHashtagsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeTab, setActiveTab] = useState('hashtags');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const openDetailView = (post) => {
    setSelectedPost(post);
    setShowDetailView(true);
  };

  const closeDetailView = () => {
    setSelectedPost(null);
    setShowDetailView(false);
  };

  useEffect(() => {
    const loadHashtagsData = async () => {
      try {
        const response = await fetch('/data_97cd739e_split_1.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Process hashtags data
            const processedData = results.data
              .filter(row => row.hashtags && row.shares && row.likes)
              .map(row => {
                // Parse hashtags from the string format "['#hashtag1', '#hashtag2']"
                const hashtags = row.hashtags
                  .replace(/[\[\]']/g, '') // Remove brackets and quotes
                  .split(', ')
                  .filter(tag => tag.trim() !== '');
                
                return {
                  ...row, // Include all original column data
                  hashtags: hashtags,
                  shares: parseFloat(row.shares?.replace(/,/g, '') || '0') || 0,
                  likes: parseInt(row.likes?.replace(/,/g, '') || '0') || 0,
                  comments: parseInt(row.comments_count?.replace(/,/g, '') || '0') || 0,
                  platform: row.platform,
                  username: row.username,
                  content: row.content_text
                };
              })
              .sort((a, b) => b.shares - a.shares)
              .slice(0, 20);

            setHashtagsData(processedData);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
        setLoading(false);
      }
    };

    loadHashtagsData();
  }, []);

  if (loading) {
    return (
      <div className={`hashtags-loading ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="loading-spinner"></div>
        <p>Loading trending hashtags...</p>
      </div>
    );
  }

  return (
    <div className={`hashtags-trending ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="hashtags-header">
        <div className="header-content">
          <div className="header-text">
            <h2>🔥 Live Hashtags Trending</h2>
            <p>Top 20 hashtags by social media engagement</p>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'hashtags' ? 'active' : ''}`}
            onClick={() => switchTab('hashtags')}
          >
            📊 Hashtags View
          </button>
          <button 
            className={`tab ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => switchTab('graph')}
          >
            📈 Engagement Graph
          </button>
        </div>
      </div>

      {activeTab === 'hashtags' && (
        <div className="hashtags-grid">
          {hashtagsData.map((item, index) => {
            const isHighShare = item.shares > 5000;
            return (
            <div key={index} className={`hashtag-card ${isHighShare ? 'danger-flag' : ''}`}>
              <div className="hashtag-rank">#{index + 1}</div>
              {isHighShare && (
                <div className="danger-indicator">
                  <span className="danger-icon">🚨</span>
                  <span className="danger-text">HIGH VIRAL SPREAD</span>
                </div>
              )}
              <div className="hashtag-content">
                <div className="hashtags-list">
                  {item.hashtags.map((hashtag, tagIndex) => (
                    <span key={tagIndex} className="hashtag-tag">{hashtag}</span>
                  ))}
                </div>
                <div className="hashtag-content-text">
                  <p>{item.content}</p>
                </div>
                <div className="hashtag-stats">
                  <span className="shares-count">📤 {item.shares.toLocaleString()} shares</span>
                  <span className="likes-count">❤️ {item.likes.toLocaleString()} likes</span>
                </div>
                <div className="hashtag-meta">
                  <span className="platform">📱 {item.platform}</span>
                  <span className="username">👤 {item.username}</span>
                </div>
                <div className="hashtag-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => openDetailView(item)}
                  >
                    🔍 View Details
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {activeTab === 'graph' && (
        <div className="graph-container">
          <div className="graph-card">
            <h3>📈 Top Posts Engagement Metrics</h3>
            <p>Likes, Shares, and Comments comparison for top 20 posts</p>
            <div className="chart-wrapper">
              <Line 
                data={{
                  labels: hashtagsData.map((_, index) => `#Post${index + 1}`),
                  datasets: [
                    {
                      label: 'Likes',
                      data: hashtagsData.map(item => item.likes),
                      borderColor: '#10b981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderWidth: 3,
                      tension: 0.4,
                      pointBackgroundColor: '#10b981',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                    },
                    {
                      label: 'Shares',
                      data: hashtagsData.map(item => item.shares),
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderWidth: 3,
                      tension: 0.4,
                      pointBackgroundColor: '#3b82f6',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                    },
                    {
                      label: 'Comments',
                      data: hashtagsData.map(item => item.comments),
                      borderColor: '#8b5cf6',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      borderWidth: 3,
                      tension: 0.4,
                      pointBackgroundColor: '#8b5cf6',
                      pointBorderColor: '#ffffff',
                      pointBorderWidth: 2,
                      pointRadius: 6,
                      pointHoverRadius: 8,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: isDarkTheme ? '#f8fafc' : '#1e293b',
                        font: {
                          size: 14,
                          weight: 'bold'
                        },
                        usePointStyle: true,
                        padding: 20
                      }
                    },
                    title: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        color: isDarkTheme ? 'rgba(248, 250, 252, 0.1)' : 'rgba(30, 41, 59, 0.1)',
                      },
                      ticks: {
                        color: isDarkTheme ? '#f8fafc' : '#1e293b',
                        font: {
                          size: 12
                        }
                      }
                    },
                    y: {
                      grid: {
                        color: isDarkTheme ? 'rgba(248, 250, 252, 0.1)' : 'rgba(30, 41, 59, 0.1)',
                      },
                      ticks: {
                        color: isDarkTheme ? '#f8fafc' : '#1e293b',
                        font: {
                          size: 12
                        },
                        callback: function(value) {
                          return value.toLocaleString();
                        }
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {hashtagsData.length === 0 && activeTab === 'hashtags' && (
        <div className="no-data">
          <p>No trending hashtags found</p>
        </div>
      )}

      {/* Detailed Post View Modal */}
      {showDetailView && selectedPost && (
        <div className="detail-view-overlay" onClick={closeDetailView}>
          <div className="detail-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="detail-view-header">
              <h3>📋 Complete Post Details</h3>
              <button className="close-btn" onClick={closeDetailView}>✕</button>
            </div>
            
            <div className="detail-view-content">
              <div className="detail-section">
                <h4>🌐 Platform Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Platform:</label>
                    <span>{selectedPost.platform || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Username:</label>
                    <span>{selectedPost.username || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span>{selectedPost.user_id || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Profile Link:</label>
                    <span>{selectedPost.profile_link ? (
                      <a href={selectedPost.profile_link} target="_blank" rel="noopener noreferrer">
                        {selectedPost.profile_link}
                      </a>
                    ) : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>📝 Content Information</h4>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <label>Content Text:</label>
                    <span className="content-text">{selectedPost.content_text || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Label:</label>
                    <span>{selectedPost.label || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Language:</label>
                    <span>{selectedPost.language || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Hashtags:</label>
                    <span>{selectedPost.hashtags ? selectedPost.hashtags.join(', ') : 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Mentions:</label>
                    <span>{selectedPost.mentions || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>URLs:</label>
                    <span>{selectedPost.urls || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>📊 Engagement Metrics</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Likes:</label>
                    <span>{selectedPost.likes?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Shares:</label>
                    <span>{selectedPost.shares?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Comments:</label>
                    <span>{selectedPost.comments_count?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Timestamp:</label>
                    <span>{selectedPost.timestamp || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>🎬 Media Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Media Type:</label>
                    <span>{selectedPost.media_type || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Media URL:</label>
                    <span>{selectedPost.media_url ? (
                      <a href={selectedPost.media_url} target="_blank" rel="noopener noreferrer">
                        {selectedPost.media_url}
                      </a>
                    ) : 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>OCR Text:</label>
                    <span className="content-text">{selectedPost.ocr_text || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>🔍 Analysis Results</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Organization Hint:</label>
                    <span>{selectedPost.org_hint || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Image Anti-India:</label>
                    <span className={selectedPost.img_is_anti_india === 'True' ? 'flag-positive' : 'flag-negative'}>
                      {selectedPost.img_is_anti_india || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Image Confidence:</label>
                    <span>{selectedPost.img_confidence || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Image Reasoning:</label>
                    <span className="content-text">{selectedPost.img_reasoning || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Text Anti-India:</label>
                    <span className={selectedPost.text_is_anti_india === 'True' ? 'flag-positive' : 'flag-negative'}>
                      {selectedPost.text_is_anti_india || 'N/A'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Text Confidence:</label>
                    <span>{selectedPost.text_confidence || 'N/A'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Text Reasoning:</label>
                    <span className="content-text">{selectedPost.text_reasoning || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashtagsTrending;
