//Phần thêm mới
document.addEventListener("DOMContentLoaded", function () {
    // Auth check
    const currentEmail = localStorage.getItem("currentUser");
    const userData = localStorage.getItem(`user-${currentEmail}`);
    if (!currentEmail || !userData) {
        alert("Bạn chưa đăng nhập!");
        return (window.location.href = "../auth/login.html");
    }
    const user = JSON.parse(userData);
    if (user.role !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        return (window.location.href = "../../index.html");
    }

    // Biến & DOM
    const modal = document.getElementById("scheduleModal");
    const openModalBtn = document.querySelector(".btn-add");
    const closeModalBtn = document.querySelector(".cancel-btn");
    const saveBtn = document.querySelector(".save-btn");
    const scheduleTableBody = document.getElementById("scheduleTableBody");

    const classes = document.getElementById("reg-class");
    const date = document.getElementById("reg-date");
    const time = document.getElementById("reg-time");
    const name = document.getElementById("reg-name");
    const email = document.getElementById("reg-email");

    const errorClass = document.getElementById("errorClass");
    const errorDate = document.getElementById("errorDate");
    const errorTime = document.getElementById("errorTime");
    const errorName = document.getElementById("errorName");
    const errorEmail = document.getElementById("errorEmail");

    const classFilter = document.getElementById("classFilter");
    const emailFilterInput = document.getElementById("emailFilter");

    const confirmModal = document.getElementById("confirmModal");
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmOK = document.getElementById("confirmOK");
    const confirmCancel = document.getElementById("confirmCancel");

    let editIndex = null;
    let confirmAction = null;
    let selectedIndex = null;

    // Utility
    const clearErrors = () => document.querySelectorAll(".error-msg").forEach(e => e.textContent = "");
    const resetForm = () => {
        [classes, date, time, name, email].forEach(input => input.value = "");
        clearErrors();
        editIndex = null;
    };
    const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isFutureDate = inputDate => new Date(inputDate) >= new Date().setHours(0, 0, 0, 0);

    const validateSchedule = schedule => {
        clearErrors();
        let valid = true;
        if (!schedule.classes) errorClass.textContent = "Vui lòng nhập lớp học!", valid = false;
        if (!schedule.date) errorDate.textContent = "Vui lòng nhập ngày tập!", valid = false;
        else if (!isFutureDate(schedule.date)) errorDate.textContent = "Ngày tập phải từ hôm nay trở đi!", valid = false;
        if (!schedule.time) errorTime.textContent = "Vui lòng nhập khung giờ!", valid = false;
        if (!schedule.name || schedule.name.length < 2) errorName.textContent = "Họ tên ít nhất 2 ký tự!", valid = false;
        if (!schedule.email || !isValidEmail(schedule.email)) errorEmail.textContent = "Email không đúng định dạng!", valid = false;

        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        const duplicate = list.some((s, idx) =>
            idx !== editIndex && s.classes === schedule.classes &&
            s.date === schedule.date && s.time === schedule.time && s.email === schedule.email
        );
        if (duplicate) errorDate.textContent = "Lịch tập này đã tồn tại!", valid = false;

        return valid;
    };

    const updateTable = () => {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
    
        const classValue = classFilter ? classFilter.value.trim().toLowerCase() : "";
        const emailText = emailFilterInput ? emailFilterInput.value.trim().toLowerCase() : "";
    
        const filteredList = list.filter(s => {
            const classMatch = (classValue === "" || classValue === "all" || s.classes.toLowerCase() === classValue);
            const emailMatch = s.email.toLowerCase().includes(emailText);
            return classMatch && emailMatch;
        });
    
        scheduleTableBody.innerHTML = filteredList.map((s, i) => `
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
        `).join("");
    };
    function initializeChartFromStorage() {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        let gymCount = 0, yogaCount = 0, zumbaCount = 0;
    
        list.forEach(item => {
            const type = item.classes.trim().toLowerCase();
            if (type === 'gym') gymCount++;
            else if (type === 'yoga') yogaCount++;
            else if (type === 'zumba') zumbaCount++;
        });
    
        gymChart.data.datasets[0].data[0] = gymCount;
        yogaChart.data.datasets[0].data[0] = yogaCount;
        zumbaChart.data.datasets[0].data[0] = zumbaCount;
    
        gymChart.update();
        yogaChart.update();
        zumbaChart.update();
    }
    
    const gymCtx = document.getElementById('gymChart').getContext('2d');
    const yogaCtx = document.getElementById('yogaChart').getContext('2d');
    const zumbaCtx = document.getElementById('zumbaChart').getContext('2d');
    
    const sharedOptions = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: {
            color: (ctx) => {
              const tick = ctx.tick;
              const ticks = ctx.chart?.scales?.y?.ticks;
              if (!tick || !ticks || ticks.length < 2) return '#ccc';
    
              const value = tick.value;
              const min = ticks[0].value;
              const max = ticks[ticks.length - 1].value;
    
              return (value === min || value === max) ? '#ccc' : 'transparent';
            }
          }
        },
        x: {
          grid: { display: false }
        }
      }
    };
    
    function getSharedOptions() {
        return {
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 },
              grid: {
                color: (ctx) => {
                  const tick = ctx.tick;
                  const ticks = ctx.chart?.scales?.y?.ticks;
                  if (!tick || !ticks || ticks.length < 2) return '#ccc';
      
                  const value = tick.value;
                  const min = ticks[0].value;
                  const max = ticks[ticks.length - 1].value;
      
                  return (value === min || value === max) ? '#ccc' : 'transparent';
                }
              }
            },
            x: {
              grid: { display: false }
            }
          }
        };
      }
      
      const gymChart = new Chart(document.getElementById('gymChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Gym'],
          datasets: [{
            label: 'Lịch Gym',
            data: [0],
            backgroundColor: '#3b82f6'
          }]
        },
        options: getSharedOptions()
      });
      
      const yogaChart = new Chart(document.getElementById('yogaChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Yoga'],
          datasets: [{
            label: 'Lịch Yoga',
            data: [0],
            backgroundColor: '#10b981'
          }]
        },
        options: getSharedOptions()
      });
      
      const zumbaChart = new Chart(document.getElementById('zumbaChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Zumba'],
          datasets: [{
            label: 'Lịch Zumba',
            data: [0],
            backgroundColor: '#8b5cf6'
          }]
        },
        options: getSharedOptions()
      });
      
      function updateChartByClass(className) {
        const name = className.trim().toLowerCase();
        if (name === 'gym') {
          gymChart.data.datasets[0].data[0]++;
          gymChart.update();
        } else if (name === 'yoga') {
          yogaChart.data.datasets[0].data[0]++;
          yogaChart.update();
        } else if (name === 'zumba') {
          zumbaChart.data.datasets[0].data[0]++;
          zumbaChart.update();
        }
      }
      
      function updateChartFromList() {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        const counts = { gym: 0, yoga: 0, zumba: 0 };
      
        list.forEach(item => {
          const name = item.classes.trim().toLowerCase();
          if (counts[name] !== undefined) counts[name]++;
        });
    
        
    
        gymChart.data.datasets[0].data[0] = counts.gym;
        yogaChart.data.datasets[0].data[0] = counts.yoga;
        zumbaChart.data.datasets[0].data[0] = counts.zumba;
      
        gymChart.update();
        yogaChart.update();
        zumbaChart.update();
      }
      
      updateChartFromList();
    
    const deleteSchedule = i => {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        list.splice(i, 1);
        localStorage.setItem("scheduleList", JSON.stringify(list));
        updateTable();
        updateChartFromList();
    };

    const editSchedule = i => {
        const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
        const s = list[i];
        classes.value = s.classes;
        date.value = s.date;
        time.value = s.time;
        name.value = s.name;
        email.value = s.email;
        editIndex = i;
        modal.style.display = "flex";
    };

    // Modal hành động
    if (openModalBtn) {
        openModalBtn.onclick = () => {
            resetForm();
            modal.style.display = "flex";
        };
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = () => modal.style.display = "none";
    }

    if (saveBtn) {
        saveBtn.onclick = () => {
            const newSchedule = {
                classes: classes.value.trim().toLowerCase(), 
                date: date.value.trim(),
                time: time.value.trim(),
                name: name.value.trim(),
                email: email.value.trim(),
            };

            if (!validateSchedule(newSchedule)) return;

            const list = JSON.parse(localStorage.getItem("scheduleList")) || [];
            if (editIndex !== null) list[editIndex] = newSchedule;
            else list.push(newSchedule);
            localStorage.setItem("scheduleList", JSON.stringify(list));

            modal.style.display = "none";
            resetForm();
            updateTable();
            updateChartFromList();
        };
    }

    document.addEventListener("click", event => {
        if (event.target.classList.contains("delete-btn")) {
            selectedIndex = parseInt(event.target.dataset.id);
            confirmAction = "delete";
            confirmMessage.textContent = "Bạn có chắc chắn muốn xóa lịch này?";
            confirmModal.style.display = "flex";
        } else if (event.target.classList.contains("edit-btn")) {
            selectedIndex = parseInt(event.target.dataset.id);
            confirmAction = "edit";
            confirmMessage.textContent = "Bạn có chắc chắn muốn sửa lịch này?";
            confirmModal.style.display = "flex";
        }
    });

    confirmOK.onclick = () => {
        if (confirmAction === "delete") deleteSchedule(selectedIndex);
        else if (confirmAction === "edit") editSchedule(selectedIndex);
        confirmModal.style.display = "none";
    };

    confirmCancel.onclick = () => confirmModal.style.display = "none";

    // Lọc
    if (classFilter) classFilter.addEventListener("input", updateTable);
    if (emailFilterInput) emailFilterInput.addEventListener("input", updateTable);

    // Sidebar điều hướng
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
    updateChartFromList();
});
