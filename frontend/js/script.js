document.addEventListener("DOMContentLoaded", async () => {

  /* ==================================================
     AUTH CHECK (user.html)
  ================================================== */
  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    const res = await fetch("/api/me", { credentials: "include" });

    if (!res.ok) {
      window.location.href = "login.html";
      return;
    }

    const user = await res.json();
    usernameEl.textContent = `คุณ ${user.name}`;
  }

  /* ==================================================
     LOGIN
  ================================================== */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      if (data.user.role === "admin") {
        window.location.href = "/admin.html";
      } else {
        window.location.href = "/user.html"; // หรือ index.html
      }
    });
  }

  /* ==================================================
     REGISTER
  ================================================== */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);

      alert("✅ สมัครสมาชิกสำเร็จ");
      window.location.href = "login.html";
    });
  }

  /* ==================================================
     TABLE BOOKING
  ================================================== */
  const tables = document.querySelectorAll(".table");
  if (tables.length === 0) return;

  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");

  /* ---------- โหลดโต๊ะที่ถูกจอง ---------- */
  async function loadBookedTables() {
    const date = dateInput?.value;
    const time = timeInput?.value;
    if (!date || !time) return;

    // reset โต๊ะทั้งหมด
    tables.forEach(t => t.classList.remove("unavailable"));

    const res = await fetch(
      `/api/booked-tables?date=${date}&time=${time}`
    );

    if (!res.ok) return;

    const booked = await res.json(); // [1,5,12]

    tables.forEach(t => {
      const tableNo = Number(t.textContent.trim());
      if (booked.includes(tableNo)) {
        t.classList.add("unavailable");
      }
    });
  }

  dateInput?.addEventListener("change", loadBookedTables);
  timeInput?.addEventListener("change", loadBookedTables);

  /* ---------- popup booking ---------- */
  const popup = document.getElementById("tablePopup");
  const popupTableNo = document.getElementById("popupTableNo");
  const popupPeople = document.getElementById("popupPeople");
  const popupTime = document.getElementById("popupTime");
  const cancelBtn = document.getElementById("cancelTable");
  const confirmBtn = document.getElementById("confirmTable");
  const toast = document.getElementById("toast");
  const loading = document.getElementById("loadingOverlay");

  let selectedTable = null;

  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) return;

      if (!dateInput.value || !timeInput.value) {
        alert("กรุณาเลือกวันที่และเวลาก่อน");
        return;
      }

      selectedTable = table;
      popupTableNo.textContent = table.textContent;
      popupPeople.value = 1;
      popupTime.value = timeInput.value;

      popup.classList.add("active");
    });
  });

  cancelBtn?.addEventListener("click", () => {
    popup.classList.remove("active");
    selectedTable = null;
  });

  confirmBtn?.addEventListener("click", async () => {
    if (!selectedTable) return;

    const people = parseInt(popupPeople.value);
    const date = dateInput.value;
    const time = popupTime.value;

    popup.classList.remove("active");
    loading.classList.add("active");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date,
          time,
          people,
          table: Number(selectedTable.textContent)
        }),
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

/* ==================================================
   LOGOUT
================================================== */
const logoutBtn = document.getElementById("logout");
logoutBtn?.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  window.location.href = "login.html";
});

/* =========================
   CONTACT ADMIN
========================= */
const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("message").value.trim();
  if (!message) return;

  const res = await fetch("/api/contact-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
  });

  const data = await res.json();

  if (!res.ok) {
    return alert(data.message || "ส่งข้อความไม่สำเร็จ");
  }

  alert("✅ ส่งข้อความถึงแอดมินเรียบร้อย");
  contactForm.reset();
});
