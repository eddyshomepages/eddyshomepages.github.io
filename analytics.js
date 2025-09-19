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
      background: white; padding: 30px; border-radius: 10px;
      max-width: 800px; max-height: 90vh; overflow-y: auto; width: 100%;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0;">📊 Private Analytics Dashboard</h2>
        <button class="close-analytics-btn" 
                style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
          ✕ Close
        </button>
      </div>
      
      <div style="padding: 12px; background: #e3f2fd; border-left: 4px solid #2196f3; margin-bottom: 20px; font-size: 14px;">
        <strong>💻 Console Commands:</strong><br>
        <code>analytics.stats()</code> - Show summary statistics<br>
        <code>analytics.data()</code> - Show recent data entries<br>
        <code>analytics.export()</code> - Download all data as JSON<br>
        <code>analytics.clear()</code> - Clear all stored data<br>
        <code>analytics.dashboard()</code> - Show this dashboard
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
          <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; max-height: 300px; overflow-y: auto;">
            ${stats.topPages.length > 0 ? stats.topPages.map(page => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="color: #495057; font-size: 14px;">${page.path}</span>
                <span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">${page.count}</span>
              </div>
            `).join('') : '<p style="color: #6c757d; text-align: center; margin: 20px 0;">No page data yet</p>'}
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 15px;">📅 Recent Activity</h3>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; max-height: 300px; overflow-y: auto;">
            ${stats.recentActivity.length > 0 ? stats.recentActivity.map(activity => `
              <div style="padding: 5px 0; font-size: 14px; color: #495057; border-bottom: 1px solid #eee;">
                <strong>${activity.type}</strong>: ${activity.page}<br>
                <span style="color: #6c757d; font-size: 12px;">${new Date(activity.timestamp).toLocaleString('fi-FI')}</span>
              </div>
            `).join('') : '<p style="color: #6c757d; text-align: center; margin: 20px 0;">No recent activity</p>'}
          </div>
        </div>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px;">
        <div style="text-align: center;">
          <p style="color: #6c757d; margin: 0;">
            📊 ${rawData.length} events tracked | 💾 ~${Math.round(JSON.stringify(rawData).length / 1024)}KB storage used
          </p>
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