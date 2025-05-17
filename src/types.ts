export interface UrlEntry {
  id?: number;
  tabId: number;
  url: string;
  visitedAt: string;
  query?: string;
}

export interface DatabaseResponse {
  success: boolean;
  message?: string;
  data?: UrlEntry[];
}

export interface MessageRequest {
  action: "getUrlHistory" | "clearUrlHistory";
}
