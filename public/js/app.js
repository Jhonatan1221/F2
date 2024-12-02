// const baseURL = "/";
const baseURL = "/";

if (navigator.serviceWorker) {
  console.log("Registering sw");
  navigator.serviceWorker.register(baseURL + "sw.js");
}

window.addEventListener("load", () => {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const { type } = event.data;
    if (type === "online") {
      console.log("Conectado a internet.");
    } else if (type === "offline") {
      console.log("No hay conexión a internet, inténtalo de nuevo más tarde.");
    }
  });
});

function isOnline() {
  if (navigator.onLine) {
    console.log("Conectado a internet.");
  } else {
    alert("No hay conexión a internet, ");
    console.log("No hay conexión a internet, inténtalo de nuevo más tarde.");
  }
}

window.addEventListener("online", isOnline);
window.addEventListener("offline", isOnline);

isOnline();
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data.type === "offlineWarning") {
    alert(event.data.message);
  }
});
