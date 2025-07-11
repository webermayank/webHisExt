document.addEventListener("DOMContentLoaded", () => {
  const somewhereElement = document.querySelector(".horizontal-list");
  const deleteHis = document.querySelector(".first-click");
  const visitCount = document.getElementById("visit-count");

  // Function to safely escape HTML
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Function to extract a readable title from URL
  function extractTitle(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, '');
      const pathname = urlObj.pathname;

      // Handle search engines - check if it's a search query
      const searchParams = new URLSearchParams(urlObj.search);
      const query = searchParams.get("q");
      if (query && (hostname.includes('google') || hostname.includes('bing') || hostname.includes('duckduckgo') || hostname.includes('yahoo'))) {
        return {
          title: query,
          domain: hostname
        };
      }

      // Extract meaningful parts from pathname
      if (pathname && pathname !== '/') {
        // Remove leading slash and split by slashes or hyphens
        const pathParts = pathname.slice(1).split(/[\/\-_]/);

        // Filter out empty parts, numbers, and common words
        const meaningfulParts = pathParts.filter(part =>
          part.length > 2 &&
          !['www', 'com', 'org', 'net', 'html', 'php', 'asp', 'jsp', 'index'].includes(part.toLowerCase()) &&
          !/^\d+$/.test(part) // Remove pure numbers
        );

        if (meaningfulParts.length > 0) {
          // Take first 2-3 parts and clean them up
          const titleParts = meaningfulParts.slice(0, 2).map(part => {
            // Replace underscores/hyphens with spaces and capitalize
            return part.replace(/[_-]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
          });

          let title = titleParts.join(' ');

          // Truncate if too long
          if (title.length > 40) {
            title = title.substring(0, 37) + '...';
          }

          return {
            title: title,
            domain: hostname
          };
        }
      }

      // Fallback: capitalize and clean hostname
      const cleanHostname = hostname.replace(/\.(com|org|net|edu|gov)$/, '');
      const title = cleanHostname.charAt(0).toUpperCase() + cleanHostname.slice(1);

      return {
        title: title,
        domain: hostname
      };

    } catch (error) {
      console.error("Error parsing URL:", error);
      // Return first 50 characters of URL as fallback
      const shortUrl = url.length > 50 ? url.substring(0, 47) + '...' : url;
      return {
        title: shortUrl,
        domain: ''
      };
    }
  }

  // Function to calculate "time ago"
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  }

  // Show loading state
  function showLoading() {
    somewhereElement.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <div>Loading your history...</div>
      </div>
    `;
  }

  // Show empty state
  function showEmptyState() {
    somewhereElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌐</div>
        <div class="empty-state-title">No History Yet</div>
        <div class="empty-state-text">Start browsing to see your visited sites here!</div>
      </div>
    `;
  }

  // Show error state
  function showErrorState() {
    somewhereElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">Unable to Load History</div>
        <div class="empty-state-text">Please try refreshing the extension.</div>
      </div>
    `;
  }

  // Show cleared state
  function showClearedState() {
    somewhereElement.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">✨</div>
        <div class="empty-state-title">History Cleared</div>
        <div class="empty-state-text">Your browsing history has been cleared successfully.</div>
      </div>
    `;
  }

  // Add staggered animation to list items
  function addStaggeredAnimation() {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }

  // Initialize - show loading first
  showLoading();

  chrome.runtime.sendMessage({ action: "getUrlHistory" }, (response) => {
    console.log("Received response in popup.js:", response);

    if (!response || !response.data) {
      showErrorState();
      visitCount.textContent = "0";
      return;
    }

    const urls = response.data;
    visitCount.textContent = urls.length;

    if (urls.length === 0) {
      showEmptyState();
      return;
    }

    const historyHtml = urls
      .reverse()
      .map((entry, index) => {
        const titleInfo = extractTitle(entry.url);
        return `
          <li class="list-item" style="animation-delay: ${index * 0.05}s">
            <div class="custom-card">
              <div class="card-body">
                <h5 class="card-title">${escapeHtml(titleInfo.title)}</h5>
                <p class="card-domain">${escapeHtml(titleInfo.domain)}</p>
                <p class="card-time">Visited ${escapeHtml(timeAgo(entry.visitedAt))}</p>
                <div class="card-actions">
                  <a href="${escapeHtml(entry.url)}" target="_blank" rel="noopener noreferrer" class="btn-visit">Visit</a>
                </div>
              </div>
            </div>
          </li>
        `;
      })
      .join("");

    somewhereElement.innerHTML = historyHtml;
  });

  deleteHis.addEventListener("click", () => {
    // Add loading state to button
    const originalText = deleteHis.innerHTML;
    deleteHis.innerHTML = '🔄 Clearing...';
    deleteHis.disabled = true;

    chrome.runtime.sendMessage({ action: "clearUrlHistory" }, (response) => {
      if (response && response.success) {
        console.log("URL history cleared.");
        showClearedState();
        visitCount.textContent = "0";
      } else {
        console.error("Failed to clear URL history:", response.message);
        showErrorState();
      }

      // Reset button
      deleteHis.innerHTML = originalText;
      deleteHis.disabled = false;
    });
  });
});