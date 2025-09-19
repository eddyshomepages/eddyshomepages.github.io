// analytics.js - Truly private, console access only
class LocalAnalytics {
  constructor() {
    this.storageKey = 'site_analytics';
    this.maxEntries = 1000;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    
    this.trackPageView();
    this.setupRouteTracking();
    this.setupEventTracking();
    
    // Make analytics available via console ONLY
    // No secrets, no hidden access methods
    window.analytics = this;
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

    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 100);
    });
  }

  setupEventTracking() {
    document.addEventListener('click', (e) => {
      const element = e.target;
      
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
      
      if (stored.length > this.maxEntries) {
        stored.splice(0, stored.length - this.maxEntries);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(stored));
    } catch (error) {
      console.warn('Analytics: Could not store data', error);
    }
  }

  // Public methods (visible to anyone who knows to look in console)
  stats() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const stats = this.calculateStats(data);
    console.table(stats);
    return stats;
  }

  data() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    console.table(data.slice(-20)); // Show last 20 entries
    return data;
  }

  export() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('📥 Analytics data downloaded');
  }

  clear() {
    if (confirm('Clear all analytics data? This cannot be undone!')) {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ Analytics data cleared');
      return true;
    }
    return false;
  }

  dashboard() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const stats = this.calculateStats(data);
    
    const modal = this.createModal();
    const content = this.createDashboardContent(stats, data);
    
    modal.appendChild(content);
    document.body.appendChild(modal);

    const closeBtn = content.querySelector('.close-analytics-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.remove());
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // ESC to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8); z-index: 20000;
      display: flex; align-items: center; justify-content: center; padding: 20px;
    `;
    return modal;
  }

  createDashboardContent(stats, rawData) {
    const content = document.createElement('div');
    content.style.cssText = `
      background: white; padding: 25px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      max-width: 900px; max-height: 85vh; overflow-y: auto; width: 95%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
        <h2 style="margin: 0; color: #2c3e50; font-size: 1.8em;">📊 Analytics Dashboard</h2>
        <button class="close-analytics-btn" 
                style="background: #e74c3c; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
          ✕ Close
        </button>
      </div>
      
      <details style="margin-bottom: 25px;">
        <summary style="cursor: pointer; padding: 12px; background: #f8f9fa; border-radius: 8px; font-weight: bold; color: #495057;">
          💻 Console Commands (click to expand)
        </summary>
        <div style="padding: 15px; background: #e8f4fd; border-radius: 0 0 8px 8px; margin-top: 2px;">
          <div style="display: grid; gap: 8px; font-family: 'Courier New', monospace; font-size: 13px;">
            <div><strong>analytics.stats()</strong> - Show summary table</div>
            <div><strong>analytics.data()</strong> - Show recent data entries</div>
            <div><strong>analytics.export()</strong> - Download JSON file</div>
            <div><strong>analytics.clear()</strong> - Clear all data</div>
            <div><strong>analytics.dashboard()</strong> - Show this dashboard</div>
          </div>
        </div>
      </details>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 30px;">
        <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(102,126,234,0.3);">
          <div style="font-size: 2.8em; font-weight: bold; margin-bottom: 8px;">${stats.totalPageviews}</div>
          <div style="opacity: 0.9; font-size: 14px; font-weight: 500;">Total Page Views</div>
        </div>
        <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(240,147,251,0.3);">
          <div style="font-size: 2.8em; font-weight: bold; margin-bottom: 8px;">${stats.uniquePages}</div>
          <div style="opacity: 0.9; font-size: 14px; font-weight: 500;">Unique Pages</div>
        </div>
        <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(79,172,254,0.3);">
          <div style="font-size: 2.8em; font-weight: bold; margin-bottom: 8px;">${stats.todayViews}</div>
          <div style="opacity: 0.9; font-size: 14px; font-weight: 500;">Today's Views</div>
        </div>
        <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(67,233,123,0.3);">
          <div style="font-size: 2.8em; font-weight: bold; margin-bottom: 8px;">${stats.totalClicks}</div>
          <div style="opacity: 0.9; font-size: 14px; font-weight: 500;">Total Clicks</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
        <div>
          <h3 style="margin: 0 0 18px 0; color: #2c3e50; font-size: 1.3em; display: flex; align-items: center; gap: 8px;">
            🔝 <span>Top Pages</span>
          </h3>
          <div style="background: #f8f9fa; border-radius: 10px; padding: 18px; border: 1px solid #e9ecef;">
            ${stats.topPages.length > 0 ? stats.topPages.map(page => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #dee2e6; last-child: border-bottom: none;">
                <span style="color: #495057; font-size: 14px; font-weight: 500; flex: 1; word-break: break-all;">${page.path}</span>
                <span style="background: #007bff; color: white; padding: 4px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; margin-left: 10px; min-width: 30px; text-align: center;">${page.count}</span>
              </div>
            `).join('') : '<p style="color: #6c757d; text-align: center; margin: 30px 0; font-style: italic;">No page data yet</p>'}
          </div>
        </div>
        
        <div>
          <h3 style="margin: 0 0 18px 0; color: #2c3e50; font-size: 1.3em; display: flex; align-items: center; gap: 8px;">
            📅 <span>Recent Activity</span>
          </h3>
          <div style="background: #f8f9fa; border-radius: 10px; padding: 18px; max-height: 350px; overflow-y: auto; border: 1px solid #e9ecef;">
            ${stats.recentActivity.length > 0 ? stats.recentActivity.map(activity => `
              <div style="padding: 12px 0; border-bottom: 1px solid #dee2e6; last-child: border-bottom: none;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <strong style="color: #495057; font-size: 14px;">${activity.type}</strong>
                  <span style="color: #6c757d; font-size: 13px; flex: 1; word-break: break-all;">${activity.page}</span>
                </div>
                <div style="color: #6c757d; font-size: 11px; font-family: monospace;">${new Date(activity.timestamp).toLocaleString('fi-FI')}</div>
              </div>
            `).join('') : '<p style="color: #6c757d; text-align: center; margin: 30px 0; font-style: italic;">No recent activity</p>'}
          </div>
        </div>
      </div>
      
      <div style="border-top: 2px solid #e9ecef; padding-top: 20px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 20px; background: #f8f9fa; padding: 12px 20px; border-radius: 25px; border: 1px solid #e9ecef;">
          <span style="color: #495057; font-size: 14px; font-weight: 500;">
            📊 ${rawData.length} events tracked
          </span>
          <span style="color: #6c757d;">•</span>
          <span style="color: #495057; font-size: 14px; font-weight: 500;">
            💾 ~${Math.round(JSON.stringify(rawData).length / 1024)}KB used
          </span>
        </div>
      </div>
    `;

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
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    const recentActivity = data
      .slice(-15)
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

// Initialize analytics and make it globally available
if (typeof window !== 'undefined') {
  window.analytics = new LocalAnalytics();
  console.log('📊 Analytics loaded successfully');
  console.log('💻 Try: analytics.dashboard()');
}