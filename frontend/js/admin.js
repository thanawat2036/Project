document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  loadBookings();
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
   BOOKINGS (ADMIN)
======================= */
async function loadBookings() {
  const tbody = document.getElementById("bookingTable");
  if (!tbody) return;

  const res = await fetch("/api/admin/bookings", {
    credentials: "include"
  });

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="5">โหลดข้อมูลไม่สำเร็จ</td></tr>`;
    return;
  }

  const data = await res.json();
  tbody.innerHTML = "";

  data.forEach(b => {
    tbody.innerHTML += `
      <tr>
        <td>${b.book_date}</td>
        <td>${b.book_time ?? "-"}</td>
        <td>${b.table_no}</td>
        <td>${b.name}</td>
        <td>${b.status}</td>
      </tr>
    `;
  });
}

/* =======================
   CLOSE / OPEN TABLE
======================= */
const closeDate = document.getElementById("closeDate");
const tableNo = document.getElementById("tableNo");

document.getElementById("closeTableBtn")?.addEventListener("click", async () => {
  if (!closeDate.value || !tableNo.value) {
    alert("กรุณากรอกวันที่และหมายเลขโต๊ะ");
    return;
  }

  await fetch("/api/admin/close-table", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      date: closeDate.value,
      table_no: Number(tableNo.value)
    })
  });

  alert("ปิดโต๊ะเรียบร้อย");
  loadBookings();
});

document.getElementById("openTableBtn")?.addEventListener("click", async () => {
  if (!closeDate.value || !tableNo.value) {
    alert("กรุณากรอกวันที่และหมายเลขโต๊ะ");
    return;
  }

  await fetch("/api/admin/open-table", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      date: closeDate.value,
      table_no: Number(tableNo.value)
    })
  });

  alert("เปิดโต๊ะเรียบร้อย");
  loadBookings();
});

/* =======================
   USERS
======================= */
async function loadUsers() {
  const tbody = document.getElementById("userTable");
  if (!tbody) return;

  const res = await fetch("/api/admin/users", {
    credentials: "include"
  });

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="3">โหลดผู้ใช้ไม่สำเร็จ</td></tr>`;
    return;
  }

  const users = await res.json();
  tbody.innerHTML = "";

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>
          <button class="btn-outline" onclick="deleteUser(${u.id})">ลบ</button>
        </td>
      </tr>
    `;
  });
}

async function deleteUser(id) {
  if (!confirm("ยืนยันลบผู้ใช้คนนี้?")) return;

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

  const res = await fetch("/api/messages", {
    credentials: "include"
  });

  if (!res.ok) {
    box.innerHTML = "<p>โหลดข้อความไม่สำเร็จ</p>";
    return;
  }

  const msgs = await res.json();
  box.innerHTML = "";

  msgs.forEach(m => {
    box.innerHTML += `
      <div class="message">
        <p><b>${m.name}</b>: ${m.message}</p>
        <textarea id="reply-${m.id}" placeholder="ตอบกลับ...">${m.reply ?? ""}</textarea>
        <button class="btn-primary" onclick="replyMessage(${m.id})">ส่ง</button>
      </div>
    `;
  });
}

async function replyMessage(id) {
  const replyInput = document.getElementById(`reply-${id}`);
  const reply = replyInput.value.trim();

  if (!reply) {
    alert("กรุณาพิมพ์ข้อความตอบกลับ");
    return;
  }

  await fetch(`/api/messages/reply/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reply })
  });

  alert("ตอบกลับแล้ว");
  loadMessages();
}
