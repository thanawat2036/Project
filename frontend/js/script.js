document.addEventListener("DOMContentLoaded", async () => {

  // check login
  const username = document.getElementById("username");
  if (username) {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return location.href = "login.html";
    const user = await res.json();
    username.textContent = "คุณ " + user.name;
  }

  // login
  document.getElementById("loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = email.value;
    const password = password.value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    if (res.ok) location.href = "user.html";
    else alert("เข้าสู่ระบบไม่สำเร็จ");
  });

  // register
  document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    });
    location.href = "login.html";
  });

  /* ===== AUTH CHECK ===== */
  const auth = await fetch("/api/auth/me", { credentials: "include" });
  if (!auth.ok) {
    window.location.href = "login.html";
    return;
  }

  const tables = document.querySelectorAll(".table");
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

    const booked = await res.json(); // [1,2,5]

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showToast("🎉 จองโต๊ะสำเร็จ");
      loadBookedTables();

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