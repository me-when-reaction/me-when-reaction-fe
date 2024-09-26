export function arrayExcept<T>(arrA: T[], arrB: T[]) {
  return arrA.filter(a => !arrB.includes(a));
}

export function arrayUnion<T>(arrA: T[], arrB: T[]) {
  return [...new Set(([arrA, arrB]).flat())];
}

export function noNullObject(obj: object) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
}