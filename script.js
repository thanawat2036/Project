/* ============================
   NAVBAR: Toggle Mobile Menu
============================ */
function toggleMenu() {
  const menu = document.querySelector(".nav-menu");
  menu.classList.toggle("active");
}

/* ============================
   BOOKING FORM SUBMIT
============================ */
function submitBooking(event) {
  event.preventDefault();

  const table = document.getElementById("tableNumber").value;
  const people = document.getElementById("people").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const result = document.getElementById("bookingResult");

  if (!table || !people || !date || !time) {
    result.style.color = "red";
    result.textContent = "กรุณากรอกข้อมูลให้ครบถ้วน";
    return;
  }

  // แสดงผลลัพธ์การจอง
  result.style.color = "#98ff98";
  result.textContent =
    `🎉 การจองสำเร็จ!  
โต๊ะ: ${table}  
จำนวนคน: ${people}  
วันที่: ${date}  
เวลา: ${time}`;

  // Reset form
  event.target.reset();
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
  