export function tryCatch(fn) {
  try {
    const data = fn();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}
