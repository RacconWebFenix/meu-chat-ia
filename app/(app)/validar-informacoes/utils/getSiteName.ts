export function getSiteName(url: string): string {
  try {
    const { hostname } = new URL(url);
    // Remove subdomínios comuns e TLDs
    const parts = hostname.replace(/^www\./, "").split(".");
    if (parts.length > 2) {
      return parts[parts.length - 3].charAt(0).toUpperCase() + parts[parts.length - 3].slice(1);
    }
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return url;
  }
}
