
# 🚀Chrome Extension: Enhanced URL History & Search Query Extraction

Developed a Chrome extension that provides advanced management of browsing history by extracting and displaying search queries from URLs.
Enabling quick catch up to closed tabs by mistake , here is veido link of its working [Drive](https://drive.google.com/file/d/1ilEq17QNPAR83-cNNp6POEK-FTei95LC/view)

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Screenshots](https://github.com/webermayank/WebHis#%EF%B8%8Fscreenshots)
4. [Installation](#installation)
5. [Usage](#usage)
6. [APIs & Technologies Used](#apis--technologies-used)
7. [Contributing](#contributing)
8. [License](#license)

## 📖 Project Overview 
Chrome Extension: Enhanced URL History & Search Query Extraction is a lightweight Chrome extension that tracks user browsing history, extracts search queries from URLs, and provides a clean UI for managing this data. It stores URLs using IndexedDB for persistence and real-time updates.




## 🌟 Features
- Persistent URL Storage: Stores URLs in IndexedDB, allowing them to persist across sessions.
- Search Query Extraction: Extracts search queries from complex URLs to simplify browsing history.
- History Management: Easily clear the browsing history with the click of a button.
- User-Friendly Interface: Clean and interactive UI built using Bootstrap.
## 🖼️Screenshots
#### Image below showing the UI of the extension
![image](https://github.com/user-attachments/assets/b1e5c690-b01c-4e53-b7e3-09bea0836c69)


#### Image below shows how it looks after clearing the history
![image](https://github.com/user-attachments/assets/cff05b7c-81dd-400d-9b5e-2cfa0236d513)




## Clone the repository:

```bash
git clone https://github.com/yourusername/chrome-extension-url-history.git

```
-- go to google chrom e extension settings and select sue local extension

#### Load the Extension in Chrome:

- Open Chrome and navigate to chrome://extensions/.
- Enable Developer Mode.
- Click on Load unpacked and select the project folder.




## 🎯 Usage

- Click on the extension icon in the Chrome toolbar.
- The popup will display URLs with extracted search queries, alongside their timestamps.
- Use the Clear History button to remove stored URLs.
- Perform searches and observe real-time updates in the history!
## 📚 APIs & Technologies Used
- `Chrome Extensions API`

- `chrome.tabs API`: Tracks tab updates and captures URL data.
- `chrome.runtime API`: Handles messaging between background scripts and popup.
- `IndexedDB`: Client-side database for persistent storage of URLs and related data.

- `Bootstrap 5`: Provides responsive design for the extension’s UI.

- `JavaScript (ES6)`: Core logic including event handling, URL parsing, and storage management.
## 💡 Contributing
Contributions are welcome! To contribute:

- Fork the repository
- Create a new branch
- Make your changes
- Submit a pull request
For significant changes, please open an issue to discuss what you'd like to change.
