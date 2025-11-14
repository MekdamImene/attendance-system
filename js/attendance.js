document.addEventListener("DOMContentLoaded", () => {

    /* ===========================================================
        0) FUNCTIONS FIRST
    ============================================================ */

    // Create the 12 checkboxes (S1..S6)
    function generateSessionCells() {
        let cells = "";
        for (let i = 1; i <= 6; i++) {
            cells += `
                <td><input type="checkbox" class="present"></td>
                <td><input type="checkbox" class="participate"></td>
            `;
        }
        return cells;
    }

    // Add a new student row to the table
    function addStudentToAttendanceTable(student) {
        const tbody = document.getElementById("attendanceBody");

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${student.last}</td>
            <td>${student.first}</td>
            ${generateSessionCells()}
            <td class="abs"></td>
            <td class="par"></td>
            <td class="msg"></td>
        `;

        tbody.appendChild(tr);

        // Update row after building it
        updateRow(tr);
    }

    // Recalculate row (existing function)
    function updateRow(row) {

        const presentBoxes = row.querySelectorAll(".present");
        const participateBoxes = row.querySelectorAll(".participate");

        let absences = 0;
        let participation = 0;

        presentBoxes.forEach(box => {
            if (!box.checked) absences++;
        });

        participateBoxes.forEach(box => {
            if (box.checked) participation++;
        });

        row.querySelector(".abs").textContent = absences + " Abs";
        row.querySelector(".par").textContent = participation + " Par";

        let message = "";

        if (absences > 4) {
            message = "Excluded – too many absences – You need to participate more";
        }
        else if (absences >= 3) {
            message = "Warning – attendance low – You need to participate more";
        }
        else {
            if (participation >= 4)
                message = "Good attendance – Excellent participation";
            else if (participation >= 2)
                message = "Good attendance – Good participation";
            else
                message = "Good attendance – You need to participate more";
        }

        row.querySelector(".msg").textContent = message;

        if (absences < 3) row.style.background = "#d4ffd4";
        else if (absences <= 4) row.style.background = "#fff4c2";
        else row.style.background = "#ffc2c2";
    }



    /* ===========================================================
        1) LOAD STUDENTS & ADD THEM TO TABLE
    ============================================================ */

let students = JSON.parse(localStorage.getItem("students")) || [];

// Always render all students from storage (no special-case)
students.forEach(student => addStudentToAttendanceTable(student));

// Remove old flag (not needed anymore)
localStorage.removeItem("newStudentAdded");




    /* ===========================================================
        2) LINK CHECKBOXES AFTER ROWS EXIST
    ============================================================ */

    let checkboxes = document.querySelectorAll("input[type=checkbox]");

    checkboxes.forEach((ch, index) => {
        const uniqueID = "checkbox_" + index;
        ch.dataset.id = uniqueID;

        const savedState = localStorage.getItem(uniqueID);
        if (savedState === "true") ch.checked = true;
        if (savedState === "false") ch.checked = false;
    });



    /* ===========================================================
        3) RECALCULATE AFTER LOADING CHECKBOXES
    ============================================================ */

    const rows = document.querySelectorAll("#attendanceBody tr");
    rows.forEach(row => updateRow(row));



    /* ===========================================================
        4) SAVE NEW CHECKS AND UPDATE ROW
    ============================================================ */

    checkboxes.forEach(ch => {
        ch.addEventListener("change", () => {

            const id = ch.dataset.id;
            localStorage.setItem(id, ch.checked);

            const row = ch.closest("tr");
            updateRow(row);
        });
    });

});
 
// ---------------- SHOW REPORT BUTTON ----------------
document.getElementById("showReportBtn").addEventListener("click", () => {

    const container = document.getElementById("reportContainer");
    const btn = document.getElementById("showReportBtn");

    // If visible → hide it
    if (container.style.display === "block") {
        container.style.display = "none";
        btn.textContent = "Show Report";  // ← change text
        return;
    }

    // Otherwise → show and regenerate report
    container.style.display = "block";
    btn.textContent = "Hide Report"; // ← change text

    const rows = document.querySelectorAll("#attendanceBody tr");

    let total = rows.length;
    let presentCount = 0;
    let participateCount = 0;

    rows.forEach(row => {
        const presentBoxes = Array.from(row.querySelectorAll(".present"));
        const participateBoxes = Array.from(row.querySelectorAll(".participate"));

        if (presentBoxes.some(cb => cb.checked)) presentCount++;
        if (participateBoxes.some(cb => cb.checked)) participateCount++;
    });

    // Fill data
    document.getElementById("totalStudents").textContent = total;
    document.getElementById("presentStudents").textContent = presentCount;
    document.getElementById("participatingStudents").textContent = participateCount;

    // Draw chart
    const ctx = document.getElementById("attendanceChart");

    if (window.attendanceChartInstance) {
        window.attendanceChartInstance.destroy();
    }

    window.attendanceChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total", "Present", "Participating"],
            datasets: [{
                label: "Students",
                data: [total, presentCount, participateCount],
                backgroundColor: ["#3498db", "#2ecc71", "#f1c40f"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });

});



