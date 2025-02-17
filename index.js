let originalData = [];

// ฟังก์ชันสำหรับสร้าง JSON จากข้อมูลในตาราง
function exportDataToJson() {
  const table = document.getElementById("attendance-table");
  const rows = table.getElementsByTagName("tr");
  const data = [];

  // เริ่มต้นที่ดัชนี 1 เพื่อข้ามแถวหัวตาราง
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    const rowData = {
      รหัสประจำตัว: cells[0].textContent,
      ชื่อ: cells[1].textContent,
      "สัปดาห์ที่ 1": cells[2].textContent,
      "สัปดาห์ที่ 2": cells[3].textContent,
      "สัปดาห์ที่ 3": cells[4].textContent,
      "สัปดาห์ที่ 4": cells[5].textContent,
      "สัปดาห์ที่ 5": cells[6].textContent,
    };
    data.push(rowData);
  }

  // แปลงข้อมูลเป็น JSON string
  const jsonData = JSON.stringify(data, null, 2);

  // สร้าง Blob
  const blob = new Blob([jsonData], { type: "application/json" });

  // สร้าง Element ลิงก์สำหรับดาวน์โหลดไฟล์ JSON
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = "student_attendance.json";

  // เพิ่ม Element ลิงก์ไปยัง DOM และเรียกคลิก
  document.body.appendChild(a);
  a.click();

  // ลบ Element ลิงก์ออกจาก DOM
  document.body.removeChild(a);

  // ปลด URL object
  URL.revokeObjectURL(url);
}

function toggleAttendanceStatus(cell, week) {
  const newValue = cell.textContent === "✓" ? "❌" : "✓";
  cell.textContent = newValue;
  cell.classList.toggle("attended");
  cell.classList.toggle("not-attended");
}
function addPerson() {
  const idInput = document.getElementById("id");
  const nameInput = document.getElementById("name");
  const id = idInput.value;
  const name = nameInput.value;

  if (!id || !name) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  const listContainer = document.getElementById("attendance-list");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
                <td>${id}</td>
                <td>${name}</td>
                <td onclick="toggleAttendanceStatus(this, 1)"></td>
                <td onclick="toggleAttendanceStatus(this, 2)"></td>
                <td onclick="toggleAttendanceStatus(this, 3)"></td>
                <td onclick="toggleAttendanceStatus(this, 4)"></td>
                <td onclick="toggleAttendanceStatus(this, 5)"></td>
            `;
  listContainer.appendChild(newRow);

  // Clear input fields
  idInput.value = "";
  nameInput.value = "";
}

function filterNames() {
  const searchInput = document.getElementById("search");
  const searchTerm = searchInput.value.toLowerCase();
  const filteredData = originalData.filter((person) =>
    person["ชื่อ"].toLowerCase().includes(searchTerm)
  );
  renderTable(filteredData);
}

function renderTable(data) {
  const listContainer = document.getElementById("attendance-list");
  listContainer.innerHTML = "";
  data.forEach((student) => {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    idCell.textContent = student["รหัสประจำตัว"];
    const nameCell = document.createElement("td");
    nameCell.textContent = student["ชื่อ"];
    const week1Cell = document.createElement("td");
    week1Cell.textContent = Math.random() > 0.5 ? "✓" : "❌";
    const week2Cell = document.createElement("td");
    week2Cell.textContent = Math.random() > 0.5 ? "✓" : "❌";
    const week3Cell = document.createElement("td");
    week3Cell.textContent = Math.random() > 0.5 ? "✓" : "❌";
    const week4Cell = document.createElement("td");
    week4Cell.textContent = Math.random() > 0.5 ? "✓" : "❌";
    const week5Cell = document.createElement("td");
    week5Cell.textContent = Math.random() > 0.5 ? "✓" : "❌";

    // เพิ่มอีเวนต์คลิกเพื่อแก้ไขการเข้าเรียนของแต่ละสัปดาห์
    week1Cell.addEventListener("click", () =>
      toggleAttendanceStatus(week1Cell, 1)
    );
    week2Cell.addEventListener("click", () =>
      toggleAttendanceStatus(week2Cell, 2)
    );
    week3Cell.addEventListener("click", () =>
      toggleAttendanceStatus(week3Cell, 3)
    );
    week4Cell.addEventListener("click", () =>
      toggleAttendanceStatus(week4Cell, 4)
    );
    week5Cell.addEventListener("click", () =>
      toggleAttendanceStatus(week5Cell, 5)
    );

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(week1Cell);
    row.appendChild(week2Cell);
    row.appendChild(week3Cell);
    row.appendChild(week4Cell);
    row.appendChild(week5Cell);
    listContainer.appendChild(row);
  });
}

// ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON และแสดงบนตาราง HTML
function loadAttendanceData() {
  fetch("student_attendance.json") // ตรงนี้ให้เปลี่ยนเส้นทางไฟล์ให้ถูกต้อง
    .then((response) => response.json())
    .then((data) => {
      originalData = data;
      renderTable(data);
    })
    .catch((error) => console.error("Error loading the data:", error));
}

// เรียกใช้ฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
window.onload = loadAttendanceData;
