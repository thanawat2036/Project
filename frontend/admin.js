const bookingList = document.getElementById("bookingList");
const filterDate = document.getElementById("filterDate");

async function loadBookings() {
  let url = "/api/admin/bookings";

  if (filterDate.value) {
    url += `?date=${filterDate.value}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  bookingList.innerHTML = "";

  if (data.length === 0) {
    bookingList.innerHTML =
      `<tr><td colspan="5">ไม่มีข้อมูลการจอง</td></tr>`;
    return;
  }

  data.forEach(b => {
    bookingList.innerHTML += `
      <tr>
        <td>${b.date}</td>
        <td>${b.time}</td>
        <td>${b.table_no}</td>
        <td>${b.people}</td>
        <td>${b.created_at}</td>
      </tr>
    `;
  });
}

filterDate.addEventListener("change", loadBookings);
loadBookings();
