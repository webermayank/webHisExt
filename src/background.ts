import { DatabaseService } from "./services/database";
import { getSearchQuery } from "./utils/urlUtils";
import { DatabaseResponse, MessageRequest, UrlEntry } from "./types";

const dbService = new DatabaseService();

// Handle tab updates
chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    if (changeInfo.status === "complete") {
      if (tab.url) {
        dbService.storeUrl(tabId, tab.url);
      }
    }
  }
);

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  // We're keeping the history even after tab removal
  console.log(`Tab ${tabId} closed, history preserved`);
});

// Handle messages
chrome.runtime.onMessage.addListener(
  (request: MessageRequest, sender, sendResponse) => {
    if (request.action === "getUrlHistory") {
      dbService
        .getAllUrls()
        .then((results) => {
          const processedResults = results.map((entry: UrlEntry) => ({
            ...entry,
            query: getSearchQuery(entry.url),
          }));
          sendResponse({ data: processedResults });
        })
        .catch(() => {
          sendResponse({ data: [] });
        });
      return true;
    } else if (request.action === "clearUrlHistory") {
      dbService
        .clearHistory()
        .then(() => {
          sendResponse({ success: true });
        })
        .catch((error) => {
          sendResponse({
            success: false,
            message: "Error clearing URL history",
          });
        });
      return true;
    }
  }
);
