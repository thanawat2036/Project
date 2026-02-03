document.addEventListener("DOMContentLoaded", async () => {
  await checkAdmin();
  await loadBookings();
  await loadUsers();
  await loadMessages();
});

/* ===== CHECK ADMIN ===== */
async function checkAdmin() {
  const res = await fetch("/api/me", { credentials: "include" });

  if (!res.ok) {
    location.href = "/login.html";
    return;
  }

  const user = await res.json();
  if (user.role !== "admin") {
    location.href = "/";
  }
}

/* ===== SWITCH SECTION ===== */
function showSection(id) {
  document.querySelectorAll(".admin-section").forEach(s => {
    s.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

/* ===== BOOKINGS ===== */
async function loadBookings() {
  const res = await fetch("/api/admin/bookings", { credentials: "include" });
  const data = await res.json();
  const tbody = document.getElementById("bookingList");
  tbody.innerHTML = "";

  data.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.customer}</td>
      <td>${b.table_no}</td>
      <td>${b.booking_date}</td>
      <td>${b.start_time} - ${b.end_time}</td>
      <td>${b.people}</td>
      <td>
        <button class="btn-outline" onclick="cancelBooking(${b.id})">
          ยกเลิก
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


async function cancelBooking(id) {
  if (!confirm("ยืนยันลบการจองนี้?")) return;

  const res = await fetch(`/api/admin/bookings/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) return alert("ลบไม่สำเร็จ");

  loadBookings();
}

/* ===== USERS ===== */
async function loadUsers() {
  const res = await fetch("/api/admin/users", { credentials: "include" });
  const data = await res.json();
  const tbody = document.getElementById("userList");
  tbody.innerHTML = "";

  data.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <select onchange="changeRole(${u.id}, this.value)">
          <option value="user" ${u.role === "user" ? "selected" : ""}>user</option>
          <option value="admin" ${u.role === "admin" ? "selected" : ""}>admin</option>
        </select>
      </td>
      <td>
        <button class="danger" onclick="deleteUser(${u.id})">ลบ</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ===== CHANGE ROLE ===== */
async function changeRole(userId, role) {
  if (!confirm("ยืนยันการเปลี่ยนสิทธิ์ผู้ใช้?")) return;

  await fetch("/api/admin/users/role", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, role }),
  });

  loadUsers();
}

/* ===== DELETE USER ===== */
async function deleteUser(userId) {
  if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;

  await fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  loadUsers();
}

/* ===== MESSAGES ===== */
async function loadMessages() {
  const res = await fetch("/api/admin/messages", { credentials: "include" });
  const data = await res.json();
  const tbody = document.getElementById("messageList");
  tbody.innerHTML = "";

  data.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.name}<br><small>${m.email}</small></td>
      <td style="text-align:left">${m.message}</td>
      <td>${new Date(m.created_at).toLocaleString("th-TH")}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ===== LOGOUT ===== */
document.getElementById("logout").onclick = async () => {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
  location.href = "/login.html";
};
