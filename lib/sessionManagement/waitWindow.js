export const waitForWindow = (callback, interval = 50) => {
  const checkWindow = setInterval(() => {
    if (typeof window !== "undefined") {
      clearInterval(checkWindow);
      callback();
    }
  }, interval);
};
