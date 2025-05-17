import { UrlEntry } from "../types";

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = "UrlHistoryDB";
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = "urls";

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const objectStore = db.createObjectStore(this.STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("tabId", "tabId", { unique: false });
      objectStore.createIndex("url", "url", { unique: false });
      objectStore.createIndex("visitedAt", "visitedAt", { unique: false });
    };

    request.onsuccess = (event: Event) => {
      console.log("IndexedDB initialized successfully.");
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event: Event) => {
      console.error(
        "Error initializing IndexedDB:",
        (event.target as IDBOpenDBRequest).error
      );
    };
  }

  public async storeUrl(tabId: number, url: string): Promise<void> {
    if (!this.db) return;

    const timestamp = new Date().toISOString();
    const transaction = this.db.transaction([this.STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(this.STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.add({
        tabId,
        url,
        visitedAt: timestamp,
      });

      request.onsuccess = () => {
        console.log("URL added to the database:", url);
        resolve();
      };

      request.onerror = () => {
        console.error("Error adding URL to the database:", request.error);
        reject(request.error);
      };
    });
  }

  public async getAllUrls(): Promise<UrlEntry[]> {
    if (!this.db) return [];

    const transaction = this.db.transaction([this.STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(this.STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async clearHistory(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const transaction = this.db.transaction([this.STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(this.STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = objectStore.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
