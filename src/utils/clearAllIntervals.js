export function clearAllIntervals() {
  let end = setInterval(() => {}, 0);
  while (end > 0) {
    clearInterval(end);
    end--;
  }
}
