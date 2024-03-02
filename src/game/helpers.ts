export function debounceLog(...args: any[]) {
  if (Math.random() > 0.96) {
    console.log(...args);
  }
}
