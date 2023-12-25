export function isValidTwitterUsername(username: string): boolean {
  return /^[A-Za-z0-9_]+$/.test(username);
}

export function nextTick(callback: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
}
