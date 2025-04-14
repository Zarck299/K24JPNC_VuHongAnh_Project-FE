document.addEventListener("DOMContentLoaded", () => {
    // ==== Xử lý các nút điều hướng ====
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

    // ==== Quản lý dịch vụ ====
    const serviceList = document.getElementById("serviceList");
    const addBtn = document.getElementById("addServiceBtn");
    const modalEl = document.getElementById("serviceModal");
    const modal = new bootstrap.Modal(modalEl);
    const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmOK = document.getElementById("confirmOK");

    let confirmAction = null;
    let selectedId = null;

    const serviceId = document.getElementById("serviceId");
    const serviceName = document.getElementById("serviceName");
    const serviceDesc = document.getElementById("serviceDesc");
    const serviceImage = document.getElementById("serviceImage");
    const imagePreview = document.getElementById("imagePreview");

    function getServices() {
      return JSON.parse(localStorage.getItem("services")) || [];
    }

    function saveServices(services) {
      localStorage.setItem("services", JSON.stringify(services));
    }

    function renderServices() {
      const services = getServices();
      serviceList.innerHTML = "";
      services.forEach(service => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${service.name}</td>
          <td>${service.desc}</td>
          <td><img src="${service.image}" style="width: 100px;"></td>
          <td>
            <button class="btn btn-primary btn-sm edit-btn" data-id="${service.id}">Sửa</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${service.id}">Xóa</button>
          </td>
        `;
        serviceList.appendChild(row);
      });
    }

    function handleDelete(id) {
      const services = getServices().filter(s => s.id !== id);
      saveServices(services);
      renderServices();
    }

    function handleEdit(id) {
      const service = getServices().find(s => s.id === id);
      if (service) {
        serviceId.value = service.id;
        serviceName.value = service.name;
        serviceDesc.value = service.desc;
        imagePreview.src = service.image;
        imagePreview.style.display = "block";
        modal.show();
      }
    }

    serviceList?.addEventListener("click", function (e) {
      const id = parseInt(e.target.dataset.id);
      if (e.target.classList.contains("delete-btn")) {
        confirmMessage.textContent = "Bạn có chắc chắn muốn xóa dịch vụ này?";
        confirmAction = "delete";
        selectedId = id;
        confirmModal.show();
      }
      if (e.target.classList.contains("edit-btn")) {
        confirmMessage.textContent = "Bạn có chắc chắn muốn sửa dịch vụ này?";
        confirmAction = "edit";
        selectedId = id;
        confirmModal.show();
      }
    });

    confirmOK?.addEventListener("click", function () {
      if (confirmAction === "delete") {
        handleDelete(selectedId);
      } else if (confirmAction === "edit") {
        handleEdit(selectedId);
      }
      confirmAction = null;
      selectedId = null;
      confirmModal.hide();
    });

    addBtn?.addEventListener("click", () => {
      serviceId.value = "";
      serviceName.value = "";
      serviceDesc.value = "";
      serviceImage.value = "";
      imagePreview.src = "";
      imagePreview.style.display = "none";
      modal.show();
    });

    serviceImage?.addEventListener("change", () => {
      const file = serviceImage.files[0];
      if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
      }
    });

    document.getElementById("saveServiceBtn")?.addEventListener("click", () => {
      const id = serviceId.value;
      const name = serviceName.value.trim();
      const desc = serviceDesc.value.trim();
      const imgSrc = imagePreview.src;

      if (!name || !desc || !imgSrc) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      let services = getServices();

      if (id) {
        services = services.map(s => s.id == id ? { id: +id, name, desc, image: imgSrc } : s);
      } else {
        services.push({ id: Date.now(), name, desc, image: imgSrc });
      }

      saveServices(services);
      renderServices();
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    });

    document.getElementById("cancelServiceBtn")?.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    });

    document.getElementById("confirmCancelModal")?.addEventListener("click", () => {
      confirmModal.hide();
    });

    renderServices();
});
