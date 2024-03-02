export function debounceLog(...args: any[]) {
  if (Math.random() > 0.9) {
    console.log(...args);
  }
}
