document.addEventListener("DOMContentLoaded", () => {
  initAuthHeader();
  initLogin();
  initRegister();
  initBookingPage();
  initProfilePage();
  initLogout();
});

/* ===============================
   AUTH HEADER
================================ */
async function initAuthHeader() {
  const usernameEl = document.getElementById("username");
  if (!usernameEl) return;

  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return;

  const user = await res.json();
  usernameEl.textContent = "คุณ " + user.name;
}

/* ===============================
   LOGIN
================================ */
function initLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

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

    location.href = "user.html";
  });
}

/* ===============================
   REGISTER
================================ */
function initRegister() {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "สมัครสมาชิกไม่สำเร็จ");
      return;
    }

    alert("สมัครสมาชิกสำเร็จ");
    location.href = "login.html";
  });
}

/* ===============================
   BOOKING PAGE
================================ */
async function initBookingPage() {
  const tables = document.querySelectorAll(".table");
  if (!tables.length) return;

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
  let hasBooked = false;

  async function loadBookedTables() {
    if (!dateInput.value || !timeInput.value) return;

    tables.forEach(t => {
      t.classList.remove("unavailable");
      t.classList.remove("selected");
    });

    const res = await fetch(
      `/api/bookings?date=${dateInput.value}&time=${timeInput.value}`,
      { credentials: "include" }
    );

    if (!res.ok) return;

    const bookedData = await res.json();
    const bookedTables = bookedData.map(b => b.table_no);

    tables.forEach(t => {
      const no = Number(t.textContent.trim());
      if (bookedTables.includes(no)) {
        t.classList.add("unavailable"); // 🔴
      }
    });
  }

  dateInput.addEventListener("change", loadBookedTables);
  timeInput.addEventListener("change", loadBookedTables);

  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) {
        alert("โต๊ะนี้ถูกจองแล้ว");
        return;
      }

      if (hasBooked) {
        alert("คุณจองไปแล้วในช่วงเวลานี้");
        return;
      }

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

  cancelBtn.onclick = () => {
    popup.classList.remove("active");
    selectedTable = null;
  };

  confirmBtn.onclick = async () => {
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

      hasBooked = true;
      showToast("🎉 จองโต๊ะสำเร็จ");
      await loadBookedTables();

    } catch (err) {
      alert(err.message);
    } finally {
      loading.classList.remove("active");
      selectedTable = null;
    }
  };

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }
}

/* ===============================
   PROFILE PAGE
================================ */
async function initProfilePage() {
  const bookingList = document.getElementById("bookingList");
  if (!bookingList) return;

  const meRes = await fetch("/api/auth/me", { credentials: "include" });
  if (!meRes.ok) {
    location.href = "login.html";
    return;
  }

  const me = await meRes.json();
  document.getElementById("username").textContent = "คุณ " + me.name;

  const res = await fetch("/api/bookings/my", { credentials: "include" });
  const bookings = await res.json();

  bookingList.innerHTML = "";

  bookings.forEach(b => {
    bookingList.innerHTML += `
      <tr>
        <td>${b.book_date}</td>
        <td>${b.book_time}</td>
        <td>${b.table_no}</td>
        <td>${b.status}</td>
        <td>
          ${
            b.status === "booked"
              ? `<button data-id="${b.id}" class="btn-outline cancel-btn">ยกเลิก</button>`
              : "-"
          }
        </td>
      </tr>
    `;
  });

  document.querySelectorAll(".cancel-btn").forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("ยืนยันยกเลิกการจอง?")) return;
      await fetch(`/api/bookings/${btn.dataset.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      location.reload();
    };
  });
}

/* ===============================
   LOGOUT
================================ */
function initLogout() {
  const logoutBtn = document.getElementById("logout");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    location.href = "login.html";
  });
}
