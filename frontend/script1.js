const sections = document.querySelectorAll("section, .card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
});

sections.forEach(sec => observer.observe(sec));

document.addEventListener("click", function (e) {
  const wave = document.createElement("span");
  wave.classList.add("click-effect");
  wave.style.left = e.clientX + "px";
  wave.style.top = e.clientY + "px";

  document.body.appendChild(wave);

  setTimeout(() => {
    wave.remove();
  }, 600);
});

let lastSparkle = 0;

document.addEventListener("mousemove", (e) => {
  if (window.innerWidth < 768) return; // ปิดมือถือ

  const now = Date.now();
  if (now - lastSparkle < 50) return; // คุมจำนวนดาว
  lastSparkle = now;

  const star = document.createElement("span");
  star.className = "star-particle";
  star.style.left = e.clientX + "px";
  star.style.top = e.clientY + "px";

  // สุ่มขนาด
  const size = Math.random() * 4 + 4;
  star.style.width = size + "px";
  star.style.height = size + "px";

  document.body.appendChild(star);

  setTimeout(() => {
    star.remove();
  }, 1200);
});

document.addEventListener("click", (e) => {
  if (window.innerWidth < 768) return; // ปิดบนมือถือ

  const amount = 12; // จำนวนดาวที่แตก

  for (let i = 0; i < amount; i++) {
    const star = document.createElement("span");
    star.className = "star-burst";

    star.style.left = e.clientX + "px";
    star.style.top = e.clientY + "px";

    // สุ่มทิศทางกระจาย
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 60 + 20;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    star.style.setProperty("--x", `${x}px`);
    star.style.setProperty("--y", `${y}px`);

    // สุ่มขนาด
    const size = Math.random() * 4 + 4;
    star.style.width = size + "px";
    star.style.height = size + "px";

    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 800);
  }
});

const hero = document.querySelector(".hero.dark-bar");

const images = [
  "hero-bg1.jpg",
  "hero-bg2.jpg",
  "hero-bg3.jpg"
];

let index = 0;

// ตั้งค่ารูปแรก
hero.style.setProperty(
  "--bg",
  `url(${images[index]})`
);
hero.style.setProperty("--opacity", 1);

hero.style.setProperty(
  "background-image",
  `url(${images[index]})`
);

setInterval(() => {
  index = (index + 1) % images.length;

  hero.style.setProperty(
    "background-image",
    `url(${images[index]})`
  );
}, 6000);
