document.addEventListener("DOMContentLoaded", function() {
document.getElementById("loginButton").addEventListener("click",function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errorEmail = document.getElementById('errorEmail');
    let errorPass = document.getElementById('errorPass');
    errorEmail.style.display = 'none';
    errorPass.style.display = 'none';
    let isError = false;
    if (!email) {
        errorEmail.style.display = 'block';
        errorEmail.textContent = "Vui lòng nhập email!";
        isError = true;
    }
    if (!password) {
        errorPass.style.display = 'block';
        errorPass.textContent = "Vui lòng nhập mật khẩu!";
        isError = true;
    }
    if (password.length < 8){
        errorPass.style.display = 'block';
        errorPass.textContent = "Mật khẩu cần ít nhất 8 chữ số!";
        isError = true;
    }
    if (isError) return;
    let userData = localStorage.getItem(`user-${email}`);
    if (!userData) {
        alert("Tài khoản không tồn tại!");
        return;
    }
    let user = JSON.parse(userData);
    if (user.password !== password) {
        alert("Sai mật khẩu!");
        return;
    }
    if (user.role === "admin") {
        alert("Đăng nhập Admin thành công!");
        window.location.href = "../admin/dashboard.html";
    } else {
        alert("Đăng nhập thành công!");
        window.location.href = "../../index.html";
    }
    localStorage.setItem("currentUser", email);
    });
});