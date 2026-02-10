document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  loadBookings();
  loadTables();
});

/* =======================
   AUTH
======================= */
function initAuth() {
  const logoutBtn = document.getElementById("logout");
  if (!logoutBtn) return;

  logoutBtn.onclick = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });
    location.href = "/login.html";
  };
}

/* =======================
   BOOKINGS (ADMIN)
======================= */
async function loadBookings() {
  const tbody = document.getElementById("bookingTable");
  if (!tbody) return;

  try {
    const res = await fetch("/api/bookings", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");

    const data = await res.json();
    tbody.innerHTML = "";

    data.forEach(b => {
      tbody.innerHTML += `
        <tr>
          <td>${b.booking_date}</td>
          <td>${b.start_time} - ${b.end_time}</td>
          <td>${b.table_no}</td>
          <td>${b.customer}</td>
          <td>${b.people}</td>
          <td>
            <button onclick="cancelBooking(${b.id})">ยกเลิก</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      `<tr><td colspan="6">โหลดข้อมูลไม่สำเร็จ</td></tr>`;
  }
}

async function cancelBooking(id) {
  if (!confirm("ยืนยันยกเลิกการจองนี้?")) return;

  await fetch(`/api/bookings/${id}/cancel`, {
    method: "PUT",
    credentials: "include"
  });

  loadBookings();
}

/* =======================
   TABLES
======================= */
async function loadTables() {
  const tbody = document.getElementById("tableTable");
  if (!tbody) return;

  try {
    const res = await fetch("/api/tables", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("โหลดโต๊ะไม่สำเร็จ");

    const tables = await res.json();
    tbody.innerHTML = "";

    tables.forEach(t => {
      tbody.innerHTML += `
        <tr>
          <td>${t.table_no}</td>
          <td>${t.status}</td>
          <td>
            <button onclick="openTable(${t.id})">เปิด</button>
            <button onclick="closeTable(${t.id})">ปิด</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      `<tr><td colspan="3">โหลดข้อมูลโต๊ะไม่สำเร็จ</td></tr>`;
  }
}

async function openTable(id) {
  await fetch(`/api/tables/${id}/open`, {
    method: "PUT",
    credentials: "include"
  });
  loadTables();
}

async function closeTable(id) {
  await fetch(`/api/tables/${id}/close`, {
    method: "PUT",
    credentials: "include"
  });
  loadTables();
}
