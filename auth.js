document.getElementById("homepageBtn").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./index.html";
});
document.getElementById("calendarBtn").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./pages/auth/calendar.html";
});
document.getElementById("logoutBtn").addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./pages/auth/login.html";
});