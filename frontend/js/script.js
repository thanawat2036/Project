document.addEventListener("DOMContentLoaded", () => {

  /* ===== TABLE MERGE RULE ===== */
  const mergedTables = {
    "1": ["1", "3"],
    "12": ["12", "13"],
    "14": ["14", "15"]
  };

  const tables = document.querySelectorAll(".table");
  const popup = document.getElementById("tablePopup");
  const popupTableNo = document.getElementById("popupTableNo");
  const popupPeople = document.getElementById("popupPeople");
  const popupTime = document.getElementById("popupTime");
  const customerName = document.getElementById("customerName");

  const cancelBtn = document.getElementById("cancelTable");
  const confirmBtn = document.getElementById("confirmTable");

  const toast = document.getElementById("toast");
  const loading = document.getElementById("loadingOverlay");

  let selectedTable = null;

  /* ===============================
     CLICK TABLE → OPEN POPUP
  =============================== */
  tables.forEach(table => {
    table.addEventListener("click", () => {
      if (table.classList.contains("unavailable")) return;

      selectedTable = table;
      popupTableNo.textContent = table.textContent;

      popupPeople.value = 1;
      customerName.value = "";
      popupTime.value = document.getElementById("time")?.value || "";

      popup.classList.add("active");
    });
  });

  /* ===============================
     CANCEL POPUP
  =============================== */
  cancelBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    selectedTable = null;
  });

  /* ===============================
     CONFIRM = BOOK NOW (REAL API)
  =============================== */
  confirmBtn.addEventListener("click", async () => {
    if (!selectedTable) return;

    const people = parseInt(popupPeople.value);
    const name = customerName.value.trim();
    const time = popupTime.value;
    const date = document.getElementById("date")?.value;

    if (!name) return alert("กรุณากรอกชื่อผู้จอง");
    if (!time || !date) return alert("กรุณาเลือกวันที่และเวลา");

    let tablesToBook = [selectedTable.textContent];

    /* ===== MORE THAN 5 PEOPLE → MERGE TABLE ===== */
    if (people > 5) {
      const mainTable = selectedTable.textContent;

      if (!mergedTables[mainTable]) {
        alert("โต๊ะนี้ไม่สามารถต่อโต๊ะได้ กรุณาเลือกโต๊ะอื่น");
        return;
      }

      tablesToBook = mergedTables[mainTable];
    }

    popup.classList.remove("active");
    loading.classList.add("active");

    try {
      /* ===== BOOK ALL TABLES ===== */
      for (const tableNo of tablesToBook) {
        const res = await fetch("/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            date,
            time,
            people,
            table: tableNo
          })
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "จองไม่สำเร็จ");
        }
      }

      /* ===== UPDATE UI ===== */
      tables.forEach(t => {
        if (tablesToBook.includes(t.textContent)) {
          t.classList.add("unavailable");
        }
      });

      showToast(
        `🎉 จองโต๊ะ ${tablesToBook.join(" + ")} สำเร็จ (${people} คน)`
      );

    } catch (err) {
      alert(err.message);
    } finally {
      loading.classList.remove("active");
      selectedTable = null;
    }
  });

  /* ===============================
     TOAST FUNCTION
  =============================== */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* ===============================
     CLOSE POPUP WHEN CLICK OUTSIDE
  =============================== */
  popup.addEventListener("click", e => {
    if (e.target === popup) {
      popup.classList.remove("active");
      selectedTable = null;
    }
  });

});
