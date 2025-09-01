import React from 'react';
import './PostDetail.css';

const PostDetail = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="post-detail-overlay">
      <div className="post-detail-container">
        <div className="post-detail-header">
          <h2>📋 Post Details</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="post-detail-content">
          <div className="detail-section">
            <h3>🏷️ Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Platform:</label>
                <span>{post.platform || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Username:</label>
                <span>{post.username || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>User ID:</label>
                <span>{post.user_id || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Language:</label>
                <span>{post.language || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📝 Content</h3>
            <div className="content-box">
              <p>{post.content_text || post.content || 'No content available'}</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>📊 Engagement Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">👍</div>
                <div className="metric-info">
                  <span className="metric-value">{(post.likes || 0).toLocaleString()}</span>
                  <span className="metric-label">Likes</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📤</div>
                <div className="metric-info">
                  <span className="metric-value">{(post.shares || 0).toLocaleString()}</span>
                  <span className="metric-label">Shares</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">💬</div>
                <div className="metric-info">
                  <span className="metric-value">{(post.comments_count || post.comments || 0).toLocaleString()}</span>
                  <span className="metric-label">Comments</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>🏷️ Hashtags & Mentions</h3>
            <div className="tags-container">
              <div className="tags-group">
                <label>Hashtags:</label>
                <div className="tags-list">
                  {post.hashtags && post.hashtags.length > 0 ? 
                    post.hashtags.map((hashtag, index) => (
                      <span key={index} className="tag hashtag">{hashtag}</span>
                    )) : 
                    <span className="no-data">No hashtags</span>
                  }
                </div>
              </div>
              <div className="tags-group">
                <label>Mentions:</label>
                <div className="tags-list">
                  {post.mentions ? 
                    <span className="tag mention">{post.mentions}</span> : 
                    <span className="no-data">No mentions</span>
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>🔗 Links & Media</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Profile Link:</label>
                <span className="link">
                  {post.profile_link ? 
                    <a href={post.profile_link} target="_blank" rel="noopener noreferrer">
                      {post.profile_link}
                    </a> : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="detail-item">
                <label>URLs:</label>
                <span className="link">
                  {post.urls ? 
                    <a href={post.urls} target="_blank" rel="noopener noreferrer">
                      {post.urls}
                    </a> : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="detail-item">
                <label>Media Type:</label>
                <span>{post.media_type || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Media URL:</label>
                <span className="link">
                  {post.media_url ? 
                    <a href={post.media_url} target="_blank" rel="noopener noreferrer">
                      View Media
                    </a> : 
                    'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>⏰ Timestamp & Additional Info</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Timestamp:</label>
                <span>{post.timestamp || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Label:</label>
                <span>{post.label || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>OCR Text:</label>
                <span>{post.ocr_text || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <label>Organization Hint:</label>
                <span>{post.org_hint || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>🛡️ Analysis Results</h3>
            <div className="analysis-grid">
              <div className="analysis-card">
                <h4>📸 Image Analysis</h4>
                <div className="analysis-item">
                  <label>Anti-India Content:</label>
                  <span className={`status ${post.img_is_anti_india ? 'negative' : 'positive'}`}>
                    {post.img_is_anti_india || 'N/A'}
                  </span>
                </div>
                <div className="analysis-item">
                  <label>Confidence:</label>
                  <span>{post.img_confidence || 'N/A'}</span>
                </div>
                <div className="analysis-item">
                  <label>Reasoning:</label>
                  <span>{post.img_reasoning || 'N/A'}</span>
                </div>
              </div>
              
              <div className="analysis-card">
                <h4>📝 Text Analysis</h4>
                <div className="analysis-item">
                  <label>Anti-India Content:</label>
                  <span className={`status ${post.text_is_anti_india ? 'negative' : 'positive'}`}>
                    {post.text_is_anti_india || 'N/A'}
                  </span>
                </div>
                <div className="analysis-item">
                  <label>Confidence:</label>
                  <span>{post.text_confidence || 'N/A'}</span>
                </div>
                <div className="analysis-item">
                  <label>Reasoning:</label>
                  <span>{post.text_reasoning || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
