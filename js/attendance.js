document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
        0) FUNCTIONS
    ============================================================ */

    function generateSessionCells(studentIndex) {
        let cells = "";
        for (let s = 0; s < 6; s++) {
            cells += `
                <td><input type="checkbox" class="present" data-st="${studentIndex}" data-ses="${s}"></td>
                <td><input type="checkbox" class="participate" data-st="${studentIndex}" data-ses="${s}"></td>
            `;
        }
        return cells;
    }

    function addStudentRow(student, index) {
        const tbody = document.getElementById("attendanceBody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${student.last_name}</td>
            <td>${student.first_name}</td>

            ${generateSessionCells(index)}

            <td class="abs"></td>
            <td class="par"></td>
            <td class="msg"></td>
        `;

        tbody.appendChild(tr);
    }

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

        row.querySelector(".abs").textContent = absences;
        row.querySelector(".par").textContent = participation;

        let message = "";
        if (absences > 4) {
            message = "Excluded – too many absences – You need to participate more";
        } else if (absences >= 3) {
            message = "Warning – attendance low – You need to participate more";
        } else {
            if (participation >= 4) message = "Good attendance – Excellent participation";
            else if (participation >= 2) message = "Good attendance – Good participation";
            else message = "Good attendance – You need to participate more";
        }

        row.querySelector(".msg").textContent = message;

        if (absences < 3) row.style.background = "#d4ffd4";
        else if (absences <= 4) row.style.background = "#fff4c2";
        else row.style.background = "#ffc2c2";
    }

    /* ============================================================
        1) GLOBAL VARIABLE TO SAVE ORIGINAL ORDER
    ============================================================ */
    window.originalOrder = [];

    /* ============================================================
        2) FETCH STUDENTS FROM DATABASE
    ============================================================ */
    fetch("php/list_students.php")
        .then(res => res.json())
        .then(data => {
            if (data.status !== "success") {
                alert("Failed to load students.");
                return;
            }

            const students = data.data;
            const tbody = document.getElementById("attendanceBody");
            tbody.innerHTML = "";

            students.forEach((student, index) => {
                addStudentRow(student, index);
            });

            linkCheckboxes();
            recalcAllRows();

            // SAVE ORIGINAL ORDER AFTER TABLE IS READY
            window.originalOrder = $("#attendanceBody").children().get();
        });

    /* ============================================================
        3) LINK CHECKBOXES TO LOCALSTORAGE
    ============================================================ */
    function linkCheckboxes() {
        const checkboxes = document.querySelectorAll("#attendanceBody input[type=checkbox]");

        checkboxes.forEach((ch, index) => {
            const uniqueID = "checkbox_" + index;
            ch.dataset.id = uniqueID;

            const saved = localStorage.getItem(uniqueID);
            if (saved === "true") ch.checked = true;
            if (saved === "false") ch.checked = false;

            ch.addEventListener("change", () => {
                localStorage.setItem(uniqueID, ch.checked);
                updateRow(ch.closest("tr"));
            });
        });
    }

    /* ============================================================
        4) RECALCULATE ALL ROWS
    ============================================================ */
    function recalcAllRows() {
        const rows = document.querySelectorAll("#attendanceBody tr");
        rows.forEach(row => updateRow(row));
    }

}); // END DOMContentLoaded



/* ============================================================
   5) jQUERY FEATURES 
============================================================ */
$(document).ready(function () {

    const $tbody = $("#attendanceBody");

    // Hover effect
    $tbody.on("mouseenter", "tr", function () { $(this).addClass("tr-hover"); });
    $tbody.on("mouseleave", "tr", function () { $(this).removeClass("tr-hover"); });

    // Click row alert
    $tbody.on("click", "tr", function (event) {
        if ($(event.target).is("input[type=checkbox]")) return;
        const last = $(this).find("td").eq(0).text().trim();
        const first = $(this).find("td").eq(1).text().trim();
        alert("Student: " + first + " " + last);
    });

    // Highlight excellent
    $("#highlightExcellentBtn").on("click", function () {
        $("#attendanceBody tr").removeClass("excellent-anim");
        $("#attendanceBody tr").each(function () {
            const abs = parseInt($(this).find(".abs").text()) || 0;
            if (abs < 3) $(this).addClass("excellent-anim");
        });
    });

    $("#resetColorsBtn").on("click", function () {
        $("#attendanceBody tr").removeClass("excellent-anim");
    });

    // Search
    $("#searchInput").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $("#attendanceBody tr").filter(function () {
            const last = $(this).find("td").eq(0).text().toLowerCase();
            const first = $(this).find("td").eq(1).text().toLowerCase();
            $(this).toggle(last.includes(value) || first.includes(value));
        });
    });

    // Sort absences
    $("#sortAbsBtn").on("click", function () {
        const rows = $("#attendanceBody tr").get();
        rows.sort((a, b) => (parseInt($(a).find(".abs").text()) || 0) - (parseInt($(b).find(".abs").text()) || 0));
        $("#attendanceBody").empty().append(rows);
        $("#sortMessage").text("Sorted by absences (ASC)");
    });

    // Sort participation
    $("#sortParBtn").on("click", function () {
        const rows = $("#attendanceBody tr").get();
        rows.sort((a, b) => (parseInt($(b).find(".par").text()) || 0) - (parseInt($(a).find(".par").text()) || 0));
        $("#attendanceBody").empty().append(rows);
        $("#sortMessage").text("Sorted by participation (DESC)");
    });

    // Reset sorting
    $("#resetSortBtn").on("click", function () {
        $("#attendanceBody").empty().append(window.originalOrder);
        $("#sortMessage").text("Sorting reset — original order restored.");
    });

});




/* ============================================================
   5) REPORT BUTTON (unchanged)
============================================================ */

document.getElementById("showReportBtn").addEventListener("click", () => {

    const container = document.getElementById("reportContainer");
    const btn = document.getElementById("showReportBtn");

    if (container.style.display === "block") {
        container.style.display = "none";
        btn.textContent = "Show Report";
        return;
    }

    container.style.display = "block";
    btn.textContent = "Hide Report";

    const rows = document.querySelectorAll("#attendanceBody tr");

    let total = rows.length;
    let presentCount = 0;
    let participateCount = 0;

    rows.forEach(row => {
        const presentBoxes = row.querySelectorAll(".present");
        const participateBoxes = row.querySelectorAll(".participate");

        if ([...presentBoxes].some(cb => cb.checked)) presentCount++;
        if ([...participateBoxes].some(cb => cb.checked)) participateCount++;
    });

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("presentStudents").textContent = presentCount;
    document.getElementById("participatingStudents").textContent = participateCount;

    const ctx = document.getElementById("attendanceChart");

    if (window.attendanceChartInstance)
        window.attendanceChartInstance.destroy();

    window.attendanceChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Total", "Present", "Participating"],
            datasets: [{
                label: "Students",
                data: [total, presentCount, participateCount],
                backgroundColor: ["#3498db", "#2ecc71", "#f1c40f"]
            }]
        }
    });

});






