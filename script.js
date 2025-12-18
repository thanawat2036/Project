/* ============================
   NAVBAR: Toggle Mobile Menu
============================ */
function toggleMenu() {
  const menu = document.querySelector(".nav-menu");
  menu.classList.toggle("active");
}

function goToTable() {
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const result = document.getElementById("bookingResult");

  if (!date || !time) {
    result.style.color = "red";
    result.textContent = "กรุณาเลือกวันที่และเวลาก่อน";
    return;
  }

  document.getElementById("stepDate").style.display = "none";
  document.getElementById("stepTable").style.display = "block";
  result.textContent = "";
}

function submitBooking(event) {
  event.preventDefault();

  const form = event.target;
  const tableInput = document.getElementById("tableNumber");
  const peopleInput = document.getElementById("people");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const result = document.getElementById("bookingResult");

  // ตรวจสอบข้อมูล
  if (!tableInput.value || !peopleInput.value) {
    result.style.color = "red";
    result.textContent = "กรุณาเลือกโต๊ะและจำนวนคน";
    return;
  }

  // แสดงผลลัพธ์ (อย่า reset ก่อน)
  result.style.color = "#98ff98";
  result.innerHTML = `
    🎉 การจองสำเร็จ!<br>
    โต๊ะ: ${tableInput.value}<br>
    จำนวนคน: ${peopleInput.value}<br>
    วันที่: ${dateInput.value}<br>
    เวลา: ${timeInput.value}
  `;

  /* =========================
     RESET STATE
  ========================= */

  // ล้างการเลือกโต๊ะ
  document.querySelectorAll(".table").forEach(t =>
    t.classList.remove("selected")
  );

  // ล้างค่า hidden input
  tableInput.value = "";

  // รีเซ็ตฟอร์ม (หลังแสดงผล)
  form.reset();

  // กลับไป STEP 1
  document.getElementById("stepTable").style.display = "none";
  document.getElementById("stepDate").style.display = "block";
}



/* ============================
   Smooth Scrolling (Optional)
============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ============================
   Fade-in on scroll
============================ */
const fadeElements = document.querySelectorAll("section, .card");

function handleScroll() {
  fadeElements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < window.innerHeight - 120) {
      el.classList.add("fade-in");
    }
  });
}

window.addEventListener("scroll", handleScroll);
handleScroll(); // initial check

/* ============================
   TABLE MAP SELECTION
============================ */
document.addEventListener("DOMContentLoaded", () => {
  const tables = document.querySelectorAll(".table");
  const tableInput = document.getElementById("tableNumber");

  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) return;

      tables.forEach(t => t.classList.remove("selected"));
      table.classList.add("selected");

      tableInput.value = table.dataset.table;
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
  const tables = document.querySelectorAll(".table");
  const tableInput = document.getElementById("tableNumber");

  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) return;

      tables.forEach(t => t.classList.remove("selected"));
      table.classList.add("selected");
      tableInput.value = table.dataset.table;
    });
  });
});
});