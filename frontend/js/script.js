document.addEventListener("DOMContentLoaded", async () => {

  /* ===============================
     AUTH CHECK (HEADER USERNAME)
  ================================ */
  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) {
      location.href = "login.html";
      return;
    }
    const user = await res.json();
    usernameEl.textContent = "คุณ " + user.name;
  }

  /* ===============================
     LOGIN
  ================================ */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

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
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async e => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        alert("สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      location.href = "login.html";
    });
  }

  /* ===============================
     BOOKING PAGE
  ================================ */
  const tables = document.querySelectorAll(".table");
  if (tables.length) {

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

    async function loadBookedTables() {
      if (!dateInput.value || !timeInput.value) return;

      const res = await fetch(
        `/api/bookings?date=${dateInput.value}&time=${timeInput.value}`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const booked = await res.json();

      tables.forEach(t => {
        const no = Number(t.textContent.trim());
        t.classList.toggle("unavailable", booked.includes(no));
      });
    }

    dateInput.addEventListener("change", loadBookedTables);
    timeInput.addEventListener("change", loadBookedTables);

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

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message);
        }

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
  const bookingList = document.getElementById("bookingList");
  if (bookingList) {

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
            ${b.status === "booked"
              ? `<button data-id="${b.id}" class="btn-outline cancel-btn">ยกเลิก</button>`
              : "-"}
          </td>
        </tr>`;
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
});

/* ===============================
   LOGOUT
================================ */
document.getElementById("logout")?.addEventListener("click", async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  location.href = "login.html";
});
