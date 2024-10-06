export function register() {
  if ("serviceWorker" in navigator) {
    console.log("Service Worker is supported");
    window.addEventListener("load", () => {
      console.log("Window loaded, attempting to register service worker");
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  } else {
    console.log("Service Worker is not supported in this browser");
  }
}
