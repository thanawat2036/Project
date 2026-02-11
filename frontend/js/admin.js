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

  const res = await fetch("/api/admin/bookings", {
    credentials: "include"
  });

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="6">โหลดข้อมูลไม่สำเร็จ</td></tr>`;
    return;
  }

  const result = await res.json();

  const data = Array.isArray(result)
    ? result
    : Array.isArray(result.data)
    ? result.data
    : Array.isArray(result.rows)
    ? result.rows
    : [];

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">ไม่มีข้อมูลการจอง</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  data.forEach(b => {
    tbody.innerHTML += `
      <tr>
         <td>${b.book_date}</td>
        <td>${b.book_time ?? "-"}</td>
        <td>${b.status}</td>
        <td>${b.table_no}</td>
        <td>${b.customer}</td>
        <td>${b.people}</td>
        <td>
          <button class="btn-outline" onclick="cancelBooking(${b.id})">
            ยกเลิก
          </button>
        </td>
      </tr>
    `;
  });
}

async function cancelBooking(id) {
  if (!confirm("ยืนยันยกเลิกการจองนี้?")) return;

  await fetch(`/api/admin/bookings/${id}/cancel`, {
    method: "PUT",
    credentials: "include"
  });

  loadBookings();
}

/* =======================
   TABLES (ADMIN)
======================= */
async function loadTables() {
  const tbody = document.getElementById("tableTable");
  if (!tbody) return;

  const res = await fetch("/api/admin/tables", {
    credentials: "include"
  });

  if (!res.ok) {
    tbody.innerHTML =
      `<tr><td colspan="3">โหลดข้อมูลโต๊ะไม่สำเร็จ</td></tr>`;
    return;
  }

  const tables = await res.json();
  tbody.innerHTML = "";

  tables.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.table_no}</td>
        <td>${t.status}</td>
        <td>
          <button onclick="openTable(${t.id})">เปิด</button>
          <button class="btn-outline" onclick="closeTable(${t.id})">ปิด</button>
        </td>
      </tr>
    `;
  });
}

async function openTable(id) {
  await fetch(`/api/admin/tables/${id}/open`, {
    method: "PUT",
    credentials: "include"
  });
  loadTables();
}

async function closeTable(id) {
  await fetch(`/api/admin/tables/${id}/close`, {
    method: "PUT",
    credentials: "include"
  });
  loadTables();
}
