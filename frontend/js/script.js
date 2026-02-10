document.addEventListener("DOMContentLoaded", () => {
  initAuthHeader();
  initLogin();
  initRegister();
  initBookingPage();
  initProfilePage();
  initSendMessage();
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

    // ⭐ สำคัญมาก
    const data = await res.json();
    console.log("ROLE =", data.role);

    if (data.role === "admin") {
      location.href = "admin.html";
    } else {
      location.href = "user.html";
    }
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
   BOOKING PAGE (ปิดโต๊ะทั้งวัน)
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
  const popupTime = document.getElementById("popupTime");

  const cancelBtn = document.getElementById("cancelTable");
  const confirmBtn = document.getElementById("confirmTable");

  const toast = document.getElementById("toast");
  const loading = document.getElementById("loadingOverlay");

  let selectedTable = null;

  async function loadBookedTables() {
    if (!dateInput.value) return;

    tables.forEach(t =>
      t.classList.remove("unavailable", "selected")
    );

    const res = await fetch(
      `/api/bookings/booked-tables?date=${dateInput.value}`,
      { credentials: "include" }
    );

    if (!res.ok) return;
    const bookedTables = await res.json();

    tables.forEach(t => {
      const no = Number(t.dataset.table);
      if (bookedTables.includes(no)) {
        t.classList.add("unavailable");
      }
    });
  }

  dateInput.addEventListener("change", loadBookedTables);

  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) {
        alert("โต๊ะนี้ถูกจองแล้วทั้งวัน");
        return;
      }

      if (!dateInput.value || !timeInput.value) {
        alert("กรุณาเลือกวันที่และเวลา");
        return;
      }

      selectedTable = table;
      popupTableNo.textContent = table.dataset.table;
      popupTime.value = timeInput.value;
      popup.classList.add("active");
    });
  });

  cancelBtn.onclick = () => {
    popup.classList.remove("active");
    selectedTable = null;
  };

  confirmBtn.onclick = async () => {
  console.log("DEBUG:", {
    date: dateInput.value,
    time: popupTime.value,
    table_no: selectedTable.dataset.table
  });

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
        table_no: Number(selectedTable.textContent.trim())
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "จองไม่สำเร็จ");

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

  const res = await fetch("/api/bookings/me", { credentials: "include" });
  const bookings = await res.json();

  bookingList.innerHTML = "";

  bookings.forEach(b => {
    bookingList.innerHTML += `
      <tr>
        <td>${b.book_date}</td>
        <td>${b.book_time ?? "-"}</td>
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
   SEND MESSAGE (FIXED)
================================ */
function initSendMessage() {
  const sendBtn = document.getElementById("sendMsg");
  const msgInput = document.getElementById("userMessage");
  if (!sendBtn || !msgInput) return;

  sendBtn.onclick = async () => {
    const message = msgInput.value.trim();
    if (!message) {
      alert("กรุณาพิมพ์ข้อความ");
      return;
    }

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message })
    });

    if (!res.ok) {
      alert("กรุณาเข้าสู่ระบบ");
      location.href = "login.html";
      return;
    }

    alert("ส่งข้อความแล้ว");
    msgInput.value = "";
  };
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
