document.addEventListener("DOMContentLoaded", async () => {

  /* ===============================
     AUTH CHECK (user / index)
  ================================ */
  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    const res = await fetch("/api/auth/me", {
      credentials: "include"
    });

    if (!res.ok) {
      location.href = "login.html";
      return;
    }

    const user = await res.json();
    usernameEl.textContent = "คุณ " + user.name;
  }

  /* ===============================
     LOGIN
  ================================ */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      location.href = "user.html"; // หน้าเว็บร้าน
    });
  }

  /* ===============================
     REGISTER
  ================================ */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async e => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        alert("สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      alert("สมัครสมาชิกสำเร็จ");
      location.href = "login.html";
    });
  }

  /* ===============================
     BOOKING PAGE
  ================================ */
  const tables = document.querySelectorAll(".table");
  if (!tables.length) return;

  // ต้อง login ก่อนจอง
  const auth = await fetch("/api/auth/me", {
    credentials: "include"
  });
  if (!auth.ok) {
    location.href = "login.html";
    return;
  }

  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");

  const popup = document.getElementById("tablePopup");
  const popupTableNo = document.getElementById("popupTableNo");
  const popupPeople = document.getElementById("popupPeople");
  const popupTime = document.getElementById("popupTime");

  const cancelBtn = document.getElementById("cancelTable");
  const confirmBtn = document.getElementById("confirmTable");

  const toast = document.getElementById("toast");
  const loading = document.getElementById("loadingOverlay");

  let selectedTable = null;

  /* ===============================
     LOAD BOOKED TABLES
  ================================ */
  async function loadBookedTables() {
    if (!dateInput.value || !timeInput.value) return;

    const res = await fetch(
      `/api/bookings?date=${dateInput.value}&time=${timeInput.value}`,
      { credentials: "include" }
    );

    if (!res.ok) return;

    const booked = await res.json(); // [1,5,12]

    tables.forEach(t => {
      const no = Number(t.textContent.trim());
      t.classList.toggle("unavailable", booked.includes(no));
    });
  }

  dateInput.addEventListener("change", loadBookedTables);
  timeInput.addEventListener("change", loadBookedTables);

  /* ===============================
     SELECT TABLE
  ================================ */
  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) return;

      if (!dateInput.value || !timeInput.value) {
        alert("กรุณาเลือกวันที่และเวลา");
        return;
      }

      selectedTable = table;
      popupTableNo.textContent = table.textContent;
      popupPeople.value = 1;
      popupTime.value = timeInput.value;

      popup.classList.add("active");
    });
  });

  cancelBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    selectedTable = null;
  });

  /* ===============================
     CONFIRM BOOKING
  ================================ */
  confirmBtn.addEventListener("click", async () => {
    if (!selectedTable) return;

    popup.classList.remove("active");
    loading.classList.add("active");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date: dateInput.value,
          time: popupTime.value,
          table_no: Number(selectedTable.textContent),
          people: popupPeople.value
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast("🎉 จองโต๊ะสำเร็จ");
      await loadBookedTables();

    } catch (err) {
      alert(err.message);
    } finally {
      loading.classList.remove("active");
      selectedTable = null;
    }
  });

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
});

/* ===============================
   LOGOUT
================================ */
const logoutBtn = document.getElementById("logout");
logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  location.href = "login.html";
});
