/* =========================
   NAVBAR (MOBILE)
========================= */
function toggleMenu() {
  document.querySelector(".menu")?.classList.toggle("active");
}

/* =========================
   ELEMENTS
========================= */
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const peopleInput = document.getElementById("people");
const tableInput = document.getElementById("tableNumber");
const bookingMessage = document.getElementById("bookingMessage");
const tables = document.querySelectorAll(".table");

/* =========================
   SELECT TABLE
========================= */
tables.forEach(table => {
  table.addEventListener("click", () => {
    if (table.classList.contains("unavailable")) return;

    tables.forEach(t => t.classList.remove("selected"));
    table.classList.add("selected");
    tableInput.value = table.textContent.trim();
  });
});

/* =========================
   LOAD BOOKED TABLES
========================= */
async function loadBookedTables() {
  const date = dateInput.value;
  const time = timeInput.value;

  if (!date || !time) return;

  try {
    const res = await fetch(`/api/booked?date=${date}&time=${time}`);
    const booked = await res.json();

    tables.forEach(table => {
      table.classList.remove("unavailable", "selected");

      if (booked.includes(table.textContent.trim())) {
        table.classList.add("unavailable");
      }
    });

    tableInput.value = "";
  } catch (err) {
    console.error("โหลดโต๊ะไม่สำเร็จ", err);
  }
}

/* =========================
   WATCH DATE & TIME
========================= */
dateInput?.addEventListener("change", loadBookedTables);
timeInput?.addEventListener("change", loadBookedTables);

/* =========================
   SUBMIT BOOKING
========================= */
document.getElementById("bookingForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  if (!tableInput.value) {
    alert("กรุณาเลือกโต๊ะ");
    return;
  }

  const payload = {
    date: dateInput.value,
    time: timeInput.value,
    table: tableInput.value,
    people: peopleInput.value
  };

  try {
    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "เกิดข้อผิดพลาด");
      return;
    }

    bookingMessage.textContent = "🎉 จองโต๊ะสำเร็จ";
    bookingMessage.style.color = "#2a9d8f";

    loadBookedTables();
    document.getElementById("bookingForm").reset();
    tableInput.value = "";

  } catch (err) {
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
  }
});
