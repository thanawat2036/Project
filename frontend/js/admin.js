const tables = document.querySelectorAll(".table");
const popup = document.getElementById("adminPopup");
const popupTableNo = document.getElementById("popupTableNo");
const actualPeople = document.getElementById("actualPeople");

let selectedTable = null;

/* ===== MERGE RULE ===== */
const mergeRule = {
  1: [1,3],
  12: [12,13],
  14: [14,15]
};

/* CLICK TABLE */
tables.forEach(t => {
  t.addEventListener("click", () => {
    selectedTable = t;
    popupTableNo.textContent = t.textContent;
    actualPeople.value = "";
    popup.classList.add("active");
  });
});

/* CHECK IN */
document.getElementById("checkInBtn").onclick = () => {
  selectedTable.className = "table occupied";
  closePopup();
};

/* WALK IN */
document.getElementById("walkInBtn").onclick = () => {
  selectedTable.className = "table occupied";
  closePopup();
};

/* CLOSE TABLE */
document.getElementById("closeBtn").onclick = () => {
  selectedTable.className = "table closed";
  closePopup();
};

/* MERGE TABLE */
document.getElementById("mergeBtn").onclick = () => {
  const base = selectedTable.textContent;
  if (mergeRule[base]) {
    mergeRule[base].forEach(no => {
      document.querySelectorAll(".table").forEach(t => {
        if (t.textContent == no) {
          t.className = "table merged";
        }
      });
    });
  }
  closePopup();
};

function closePopup() {
  popup.classList.remove("active");
  selectedTable = null;
}
