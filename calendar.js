document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("scheduleModal");
    const openModalBtn = document.querySelector(".btn-add");
    const closeModalBtn = document.querySelector(".cancel-btn");
    const saveBtn = document.querySelector(".save-btn");
    const scheduleTableBody = document.getElementById("scheduleTableBody");

    let classes = document.getElementById("reg-class");
    let date = document.getElementById("reg-date");
    let time = document.getElementById("reg-time");
    let name = document.getElementById("reg-name");
    let email = document.getElementById("reg-email");
    let confirmAction = null;
    let selectedIndex = null;

    const confirmModal = document.getElementById("confirmModal");
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmOK = document.getElementById("confirmOK");
    const confirmCancel = document.getElementById("confirmCancel");

    let errorClass = document.getElementById('errorClass');
    let errorDate = document.getElementById('errorDate');
    let errorTime = document.getElementById('errorTime');
    let errorName = document.getElementById('errorName');
    let errorEmail = document.getElementById('errorEmail');

    let editIndex = null;

    function clearErrors() {
        document.querySelectorAll(".error-msg").forEach(error => error.textContent = "");
    }

    function resetForm() {
        classes.value = "";
        date.value = "";
        time.value = "";
        name.value = "";
        email.value = "";
        clearErrors();
        editIndex = null;
    }

    openModalBtn.addEventListener("click", function () {
        resetForm();
        modal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
        resetForm();
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function isFutureDate(inputDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(inputDate);
        return selectedDate >= today;
    }

    function validateSchedule(schedule) {
        clearErrors();
        let valid = true;

        if (!schedule.classes) {
            errorClass.textContent = "Vui lòng nhập lớp học!";
            valid = false;
        }
        if (!schedule.date) {
            errorDate.textContent = "Vui lòng nhập ngày tập!";
            valid = false;
        } else if (!isFutureDate(schedule.date)) {
            errorDate.textContent = "Ngày tập phải từ hôm nay trở đi!";
            valid = false;
        }
        if (!schedule.time) {
            errorTime.textContent = "Vui lòng nhập khung giờ!";
            valid = false;
        }
        if (!schedule.name || schedule.name.length < 2) {
            errorName.textContent = "Họ tên ít nhất 2 ký tự!";
            valid = false;
        }
        else if (schedule.name.includes('A') || schedule.name.includes('a')) {
            errorName.textContent = "Tên người dùng không chứa chữ A!";
            valid = false;
        } else if (schedule.name.includes('1') || schedule.name.includes('2') || schedule.name.includes('3') || schedule.name.includes('4') || schedule.name.includes('5') || schedule.name.includes('6') || schedule.name.includes('7') || schedule.name.includes('8') || schedule.name.includes('9') || schedule.name.includes('0')){
            errorName.textContent = "Tên người dùng không chứa chữ số!";
            valid = false;
        }
            if (!schedule.email || !isValidEmail(schedule.email)) {
                errorEmail.textContent = "Email không đúng định dạng!";
                valid = false;
            }

        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        const duplicate = list.some((s, idx) =>
            idx !== editIndex &&
            s.classes === schedule.classes &&
            s.date === schedule.date &&
            s.time === schedule.time &&
            s.email === schedule.email
        );

        if (duplicate) {
            errorDate.textContent = "Lịch tập này đã tồn tại!";
            valid = false;
        }

        return valid;
    }

    function updateTable() {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        const classFilter = document.getElementById("classFilter").value.trim().toLowerCase();
        const emailFilter = document.getElementById("emailFilter").value.trim().toLowerCase();
        const filteredList = list.filter(s =>
            s.classes.toLowerCase().includes(classFilter) &&
            s.email.toLowerCase().includes(emailFilter)
        );
        scheduleTableBody.innerHTML = "";
        filteredList.forEach((s, i) => {
            scheduleTableBody.innerHTML += `
                <tr>
                    <td>${s.classes}</td>
                    <td>${s.date}</td>
                    <td>${s.time}</td>
                    <td>${s.name}</td>
                    <td>${s.email}</td>
                    <td>
                        <button class="edit-btn" data-id="${i}">Sửa</button>
                        <button class="delete-btn" data-id="${i}">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }
    document.getElementById("classFilter").addEventListener("input", updateTable);
    document.getElementById("emailFilter").addEventListener("input", updateTable);

    window.deleteSchedule = function (i) {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        list.splice(i, 1);
        localStorage.setItem("scheduleList", JSON.stringify(list));
        updateTable();
    }

    window.editSchedule = function (i) {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        const s = list[i];
        classes.value = s.classes;
        date.value = s.date;
        time.value = s.time;
        name.value = s.name;
        email.value = s.email;
        editIndex = i;
        modal.style.display = "flex";
    }

    saveBtn.addEventListener("click", function () {
        const newSchedule = {
            classes: classes.value.trim(),
            date: date.value.trim(),
            time: time.value.trim(),
            name: name.value.trim(),
            email: email.value.trim(),
        };

        if (!validateSchedule(newSchedule)) return;

        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];

        if (editIndex !== null) {
            list[editIndex] = newSchedule;
        } else {
            list.push(newSchedule);
        }

        localStorage.setItem("scheduleList", JSON.stringify(list));
        modal.style.display = "none";
        resetForm();
    });

    // Lắng nghe click vào nút sửa/xoá
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const id = parseInt(event.target.dataset.id);
            confirmMessage.textContent = "Bạn có chắc chắn muốn xóa lịch này?";
            confirmAction = "delete";
            selectedIndex = id;
            confirmModal.style.display = "flex";
        }

        if (event.target.classList.contains("edit-btn")) {
            const id = parseInt(event.target.dataset.id);
            confirmMessage.textContent = "Bạn có chắc chắn muốn sửa lịch này?";
            confirmAction = "edit";
            selectedIndex = id;
            confirmModal.style.display = "flex";
        }
    });

    confirmOK.addEventListener("click", function () {
        if (confirmAction === "delete") {
            deleteSchedule(selectedIndex);
        } else if (confirmAction === "edit") {
            editSchedule(selectedIndex);
        }
        confirmModal.style.display = "none";
        confirmAction = null;
        selectedIndex = null;
    });

    confirmCancel.addEventListener("click", function () {
        confirmModal.style.display = "none";
        confirmAction = null;
        selectedIndex = null;
    });

    // Các nút điều hướng sidebar
    document.getElementById("homepageBtn").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../../index.html";
    });
    document.getElementById("calendarBtn").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../admin/dashboard.html";
    });
    document.getElementById("logoutBtn").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "login.html";
    });
    document.getElementById("caculateBtn").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../auth/calendar.html";
    });
    document.getElementById("customBtn").addEventListener("click", function (event) {
        event.preventDefault();
        window.location.href = "../auth/service-manage.html";
      });
    updateTable();
});