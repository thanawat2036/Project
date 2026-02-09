document.addEventListener("DOMContentLoaded", async () => {

  /* ==========================
     USER PAGE – CHECK LOGIN
  ========================== */
  const username = document.getElementById("username");
  if (username) {
    const res = await fetch("/api/auth/me", { credentials: "include" });

    if (!res.ok) {
      location.href = "login.html";
      return;
    }

    const user = await res.json();
    username.textContent = "คุณ " + user.name;
  }

  /* ==========================
     LOGIN
  ========================== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        location.href = "user.html";
      } else {
        alert("เข้าสู่ระบบไม่สำเร็จ");
      }
    });
  }

  /* ==========================
     REGISTER
  ========================== */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async e => {
      e.preventDefault();

      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value
        })
      });

      location.href = "login.html";
    });
  }

  /* ==========================
     BOOKING PAGE – CHECK LOGIN
  ========================== */
  const tables = document.querySelectorAll(".table");
  if (tables.length === 0) return;

  const auth = await fetch("/api/auth/me", { credentials: "include" });
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

  /* ===== LOAD BOOKED TABLES ===== */
  async function loadBookedTables() {
    if (!dateInput.value || !timeInput.value) return;

    tables.forEach(t => t.classList.remove("unavailable"));

    const res = await fetch(
      `/api/bookings?date=${dateInput.value}&time=${timeInput.value}`,
      { credentials: "include" }
    );

    if (!res.ok) return;

    const booked = await res.json();

    tables.forEach(t => {
      const no = Number(t.textContent);
      if (booked.includes(no)) t.classList.add("unavailable");
    });
  }

  dateInput.addEventListener("change", loadBookedTables);
  timeInput.addEventListener("change", loadBookedTables);

  /* ===== SELECT TABLE ===== */
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

  /* ===== CONFIRM BOOKING ===== */
  confirmBtn.addEventListener("click", async () => {
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

      if (!res.ok) throw new Error("จองโต๊ะไม่สำเร็จ");

      showToast("🎉 จองโต๊ะสำเร็จ");
      loadBookedTables();

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

  const logoutBtn = document.getElementById("logout");
logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  location.href = "login.html";
});

const nameEl = document.getElementById("p-name");
const emailEl = document.getElementById("p-email");

if (nameEl && emailEl) {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) {
    location.href = "login.html";
    return;
  }
  const user = await res.json();
  nameEl.textContent = user.name;
  emailEl.textContent = user.email;
}
});
