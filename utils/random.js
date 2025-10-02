// utils/random.js
export function rid(prefix = "TC") {
  const chars = "ABCDFGHIJKLMNOPQRSTUVWXYZ";
  let word = "";
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    word += chars[idx];
  }
  return `${prefix}-${word}`;
}
