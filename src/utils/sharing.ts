import LZString from 'lz-string';

/**
 * Sharing Utility
 * Compresses/Decompresses stats into/from URL hash
 */

export interface ShareData {
  tracks: any[];
  artists: any[];
  genres: any[];
  userName: string;
  userImage?: string;
}

export function generateShareUrl(data: ShareData): string {
  const jsonString = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(jsonString);
  const url = new URL(window.location.origin);
  url.pathname = '/share';
  url.hash = "data=" + compressed;
  return url.toString();
}

export function decodeShareData(hash: string): ShareData | null {
  const params = new URLSearchParams(hash.replace('#', ''));
  const compressed = params.get('data');
  if (!compressed) return null;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Failed to decode share data:', error);
    return null;
  }
}
