export function isURL(str: string): boolean {
  try {
    return !!(new URL(str));
  }
  catch {
    return false;
  }
}