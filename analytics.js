// analytics.js - Simple local storage analytics
class LocalAnalytics {
  constructor() {
    this.storageKey = 'site_analytics';
    this.maxEntries = 1000; // Prevent storage bloat
    this.init();
  }

  init() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    this.trackPageView();
    this.setupRouteTracking();
    this.setupEventTracking();
    this.addAnalyticsButton();
  }

  trackPageView() {
    const data = {
      type: 'pageview',
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'Direct',
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      language: navigator.language
    };

    this.storeEvent(data);
  }

  setupRouteTracking() {
    // For SPAs using History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    const self = this;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(() => self.trackPageView(), 100);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => self.trackPageView(), 100);
    };

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 100);
    });
  }

  setupEventTracking() {
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const element = e.target;
      
      // Only track specific elements to avoid noise
      if (element.tagName === 'A' || 
          element.tagName === 'BUTTON' || 
          element.classList.contains('track-click')) {
        
        const data = {
          type: 'click',
          element: element.tagName,
          text: element.textContent?.substring(0, 50) || '',
          href: element.href || '',
          className: element.className,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        };

        this.storeEvent(data);
      }
    });
  }

  storeEvent(data) {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      stored.push(data);
      
      // Keep only recent entries
      if (stored.length > this.maxEntries) {
        stored.splice(0, stored.length - this.maxEntries);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(stored));
    } catch (error) {
      console.warn('Analytics: Could not store data', error);
    }
  }

  addAnalyticsButton() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createButton());
    } else {
      this.createButton();
    }
  }

  createButton() {
    const button = document.createElement('button');
    button.innerHTML = '📊';
    button.title = 'View Analytics';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #007bff;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
    
    button.onclick = () => this.showDashboard();
    document.body.appendChild(button);
  }

  showDashboard() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const stats = this.calculateStats(data);
    
    const modal = this.createModal();
    const content = this.createDashboardContent(stats, data);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 20000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }

  createDashboardContent(stats, rawData) {
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      width: 100%;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0;">📊 Site Analytics</h2>
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
          ✕ Close
        </button>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
          <div style="font-size: 2.5em; font-weight: bold;">${stats.totalPageviews}</div>
          <div style="opacity: 0.9;">Total Page Views</div>
        </div>
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 10px;">
          <div style="font-size: 2.5em; font-weight: bold;">${stats.uniquePages}</div>
          <div style="opacity: 0.9;">Unique Pages</div>
        </div>
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 10px;">
          <div style="font-size: 2.5em; font-weight: bold;">${stats.todayViews}</div>
          <div style="opacity: 0.9;">Today's Views</div>
        </div>
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border-radius: 10px;">
          <div style="font-size: 2.5em; font-weight: bold;">${stats.totalClicks}</div>
          <div style="opacity: 0.9;">Total Clicks</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px;">
        <div>
          <h3 style="margin-bottom: 15px;">🔝 Top Pages</h3>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 15px;">
            ${stats.topPages.map(page => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #495057; font-size: 14px;">${page.path}</span>
                <span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${page.count}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 15px;">📅 Recent Activity</h3>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; max-height: 200px; overflow-y: auto;">
            ${stats.recentActivity.map(activity => `
              <div style="padding: 5px 0; font-size: 14px; color: #495057;">
                <strong>${activity.type}</strong>: ${activity.page} 
                <span style="color: #6c757d; font-size: 12px;">(${new Date(activity.timestamp).toLocaleString()})</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px;">
        <h3 style="margin-bottom: 15px;">🛠️ Data Management</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button onclick="this.downloadData(${JSON.stringify(rawData).replace(/"/g, '&quot;')})" 
                  style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
            📥 Download Data
          </button>
          <button onclick="navigator.clipboard.writeText(JSON.stringify(${JSON.stringify(rawData)}, null, 2)).then(() => alert('Data copied to clipboard!'))" 
                  style="padding: 10px 20px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer;">
            📋 Copy Data
          </button>
          <button onclick="if(confirm('Clear all analytics data?')) { localStorage.removeItem('${this.storageKey}'); location.reload(); }" 
                  style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
            🗑️ Clear Data
          </button>
        </div>
        <p style="margin-top: 15px; font-size: 14px; color: #6c757d;">
          📊 Data tracked: ${rawData.length} events | 💾 Storage used: ~${Math.round(JSON.stringify(rawData).length / 1024)}KB
        </p>
      </div>
    `;

    // Add download functionality
    content.querySelector('button[onclick*="downloadData"]').onclick = () => {
      const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return content;
  }

  calculateStats(data) {
    const pageviews = data.filter(d => d.type === 'pageview');
    const clicks = data.filter(d => d.type === 'click');
    const today = new Date().toDateString();
    
    const todayViews = pageviews.filter(d => 
      new Date(d.timestamp).toDateString() === today
    );

    const pageCount = pageviews.reduce((acc, view) => {
      const path = view.path || view.url;
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {});

    const topPages = Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }));

    const recentActivity = data
      .slice(-10)
      .reverse()
      .map(d => ({
        type: d.type === 'pageview' ? '👁️ View' : '🖱️ Click',
        page: d.path || d.url || 'Unknown',
        timestamp: d.timestamp
      }));

    return {
      totalPageviews: pageviews.length,
      uniquePages: Object.keys(pageCount).length,
      todayViews: todayViews.length,
      totalClicks: clicks.length,
      topPages,
      recentActivity
    };
  }
}

// Initialize analytics when script loads
if (typeof window !== 'undefined') {
  window.siteAnalytics = new LocalAnalytics();
}
