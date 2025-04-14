//Đăng nhập:
document.getElementById("registerButton").addEventListener("click", function (event) {
    event.preventDefault();

    let name = document.getElementById("reg-name").value;
    let email = document.getElementById("reg-email").value;
    let password = document.getElementById("reg-password").value;
    let checkpass = document.getElementById("checkpass").value;
    let role = email.includes("@") ? "admin" : "user";

    let errorName = document.getElementById('errorName');
    let errorEmail = document.getElementById('errorEmail');
    let errorPass = document.getElementById('errorPass');
    let errorCheck = document.getElementById('errorCheck')
    
    errorName.style.display = 'none';
    errorEmail.style.display = 'none';
    errorPass.style.display = 'none';
    errorCheck.style.display = 'none';
    let isError = false;
    if (!name) {
        errorName.style.display = 'block';
        errorName.textContent = "Vui lòng nhập tên!";
        isError = true;
    }
    if (!email) {
        errorEmail.style.display = 'block';
        errorEmail.textContent = "Vui lòng nhập email!";
        isError = true;
    }
    //note: đã tách các trường hợp xét mật khẩu để tránh bị ghi đè lỗi
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
    if (!checkpass) {
        errorCheck.style.display = 'block';
        errorCheck.textContent = "Vui lòng nhập xác nhận mật khẩu!";
        isError = true;
    } 
    if (password && checkpass && password !== checkpass) {
        errorCheck.style.display = 'block';
        errorCheck.textContent = "Mật khẩu xác nhận không khớp!";
        isError = true;
    }
    localStorage.setItem("reg-name", name);
    localStorage.setItem("reg-email", email);
    localStorage.setItem("reg-password", password);
    if (isError) return;
    // Kiểm tra xem tài khoản đã tồn tại hay chưa
    if (localStorage.getItem(`user-${email}`)) {
        alert("Tài khoản đã tồn tại!");
        return;
    }
    let user = {
        name: name,
        email: email,
        password: password,
        role: role
    };
    // Lưu user vào LocalStorage
    localStorage.setItem(`user-${email}`, JSON.stringify(user));
    alert("Đăng ký thành công! Bạn đã được đăng ký với vai trò: " + role);
    window.location.href = "login.html";
});
