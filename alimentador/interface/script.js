document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.getElementById("nodeRedDashboard");

    iframe.onerror = () => {
        console.error("Failed to load the Node-RED dashboard. Check the URL or server.");
    };
});
