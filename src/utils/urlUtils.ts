export function getSearchQuery(url: string): string {
  try {
    const urlObj = new URL(url);
    const searchParams = new URLSearchParams(urlObj.search);
    const query = searchParams.get("q");
    return query || url;
  } catch (error) {
    console.error("Invalid URL:", error);
    return url;
  }
}
