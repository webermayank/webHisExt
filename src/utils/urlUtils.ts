export function getSearchQuery(url: string): string {
  try {
    // Sanitize URL by removing any potential script injection
    const sanitizedUrl = url.replace(/[<>]/g, "");
    const urlObj = new URL(sanitizedUrl);

    // Only process URLs from allowed domains
    const allowedDomains = [
      "google.com",
      "bing.com",
      "duckduckgo.com",
      "yahoo.com",
    ];
    const hostname = urlObj.hostname.toLowerCase();

    if (!allowedDomains.some((domain) => hostname.includes(domain))) {
      return sanitizedUrl;
    }

    const searchParams = new URLSearchParams(urlObj.search);
    const query = searchParams.get("q");
    return query ? encodeURIComponent(query) : sanitizedUrl;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
}
