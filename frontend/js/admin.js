document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  loadBookings();
  loadTables();
  loadUsers();
  loadMessages();
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
   HELPER
======================= */
function normalizeResponse(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.rows)) return result.rows;
  return [];
}

/* =======================
   BOOKINGS
======================= */
async function loadBookings() {
  const tbody = document.getElementById("bookingTable");
  if (!tbody) return;

  try {
    const res = await fetch("/api/admin/bookings", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");

    const result = await res.json();
    const data = normalizeResponse(result);

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">ไม่มีข้อมูลการจอง</td></tr>`;
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

  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      `<tr><td colspan="7">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>`;
  }
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
   TABLES
======================= */
async function loadTables() {
  const tbody = document.getElementById("tableTable");
  if (!tbody) return;

  try {
    const res = await fetch("/api/admin/tables", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("โหลดโต๊ะไม่สำเร็จ");

    const tables = await res.json();
    const data = normalizeResponse(tables);

    tbody.innerHTML = "";

    data.forEach(t => {
      tbody.innerHTML += `
        <tr>
          <td>${t.table_no}</td>
          <td>${t.status ?? "open"}</td>
          <td>
            <button onclick="openTable(${t.id})">เปิด</button>
            <button class="btn-outline" onclick="closeTable(${t.id})">ปิด</button>
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

/* =======================
   USERS
======================= */
async function loadUsers() {
  const tbody = document.getElementById("userTable");
  if (!tbody) return;

  try {
    const res = await fetch("/api/admin/users", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("โหลดผู้ใช้ไม่สำเร็จ");

    const users = await res.json();
    const data = normalizeResponse(users);

    tbody.innerHTML = "";

    data.forEach(u => {
      tbody.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>
            ${u.role === "admin" ? "✔ Admin" : "User"}
            <button class="btn-outline" onclick="deleteUser(${u.id})">
              ลบ
            </button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      `<tr><td colspan="3">โหลดผู้ใช้ไม่สำเร็จ</td></tr>`;
  }
}

async function deleteUser(id) {
  if (!confirm("ลบผู้ใช้นี้?")) return;

  await fetch(`/api/admin/users/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  loadUsers();
}

/* =======================
   MESSAGES
======================= */
async function loadMessages() {
  const box = document.getElementById("messageList");
  if (!box) return;

  try {
    const res = await fetch("/api/admin/messages", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("โหลดข้อความไม่สำเร็จ");

    const msgs = await res.json();
    const data = normalizeResponse(msgs);

    box.innerHTML = "";

    data.forEach(m => {
      box.innerHTML += `
        <div class="message">
          <p><b>${m.name}</b>: ${m.message}</p>
          <textarea id="reply-${m.id}">${m.reply ?? ""}</textarea>
          <button onclick="replyMessage(${m.id})">
            ตอบกลับ
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    box.innerHTML = "<p>โหลดข้อความไม่สำเร็จ</p>";
  }
}

async function replyMessage(id) {
  const reply = document.getElementById(`reply-${id}`).value.trim();
  if (!reply) return alert("กรุณาพิมพ์ข้อความ");

  await fetch(`/api/admin/messages/${id}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reply })
  });

  loadMessages();
}
