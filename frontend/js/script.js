document.addEventListener("DOMContentLoaded", () => {
  const tables = document.querySelectorAll(".table");
  const popup = document.getElementById("tablePopup");
  const popupTableNo = document.getElementById("popupTableNo");
  const popupPeople = document.getElementById("popupPeople");
  const popupTime = document.getElementById("popupTime");
  const customerName = document.getElementById("customerName");

  const cancelBtn = document.getElementById("cancelTable");
  const confirmBtn = document.getElementById("confirmTable");

  const toast = document.getElementById("toast");
  const loading = document.getElementById("loadingOverlay");

  let selectedTable = null;

  /* ===============================
     CLICK TABLE → OPEN POPUP
  =============================== */
  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) return;

      selectedTable = table;
      popupTableNo.textContent = table.textContent;

      popupPeople.value = 1;
      customerName.value = "";
      popupTime.value = document.getElementById("time")?.value || "";

      popup.classList.add("active");
    });
  });

  /* ===============================
     CANCEL POPUP
  =============================== */
  cancelBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    selectedTable = null;
  });

  /* ===============================
     CONFIRM = BOOK NOW
  =============================== */
  confirmBtn.addEventListener("click", () => {
    if (!selectedTable) return;

    if (!customerName.value.trim()) {
      alert("กรุณากรอกชื่อผู้จอง");
      return;
    }

    popup.classList.remove("active");
    loading.classList.add("active");

    // mock loading / api
    setTimeout(() => {
      loading.classList.remove("active");

      // mark table unavailable
      selectedTable.classList.add("unavailable");
      selectedTable.classList.remove("selected");

      showToast(`✅ จองโต๊ะ ${selectedTable.textContent} สำเร็จ`);

      selectedTable = null;
    }, 800);
  });

  /* ===============================
     TOAST FUNCTION
  =============================== */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* ===============================
     CLOSE POPUP WHEN CLICK OUTSIDE
  =============================== */
  popup.addEventListener("click", e => {
    if (e.target === popup) {
      popup.classList.remove("active");
      selectedTable = null;
    }
  });
});
