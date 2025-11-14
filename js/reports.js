document.addEventListener("DOMContentLoaded", () => {

  const tbody = document.getElementById("reportsBody");

  // 1) Load students
  let students = JSON.parse(localStorage.getItem("students")) || [];

  // If no students → no report
  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:12px;">
          No students to display.
        </td>
      </tr>`;
    return;
  }

  // 2) Helper to compute absences and participation for each student
  function computeStudentStats(studentIndex) {

    // كل طالب لديه 12 checkbox:
    // 6 present + 6 participate
    // لكن ترتيبهم في الذاكرة يعتمد على ترتيب إضافتهم في Attendance

    let absences = 0;
    let participation = 0;

    // نحسب 12 قيمة: P1,Pa1 ... P6,Pa6
    for (let session = 0; session < 6; session++) {

      const presentID = "checkbox_" + (studentIndex * 12 + session * 2);
      const participateID = "checkbox_" + (studentIndex * 12 + session * 2 + 1);

      const present = localStorage.getItem(presentID) === "true";
      const participate = localStorage.getItem(participateID) === "true";

      if (!present) absences++;
      if (participate) participation++;
    }

    return { absences, participation };
  }

  // 3) Helper to generate final message
  function generateMessage(abs, par) {

    if (abs > 4) {
      return "Excluded – too many absences – You need to participate more";
    }
    else if (abs >= 3) {
      return "Warning – attendance low – You need to participate more";
    }
    else {
      if (par >= 4) return "Good attendance – Excellent participation";
      if (par >= 2) return "Good attendance – Good participation";
      return "Good attendance – You need to participate more";
    }
  }

  // 4) Build table rows
  students.forEach((student, index) => {

    const stats = computeStudentStats(index);
    const message = generateMessage(stats.absences, stats.participation);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${student.last}</td>
      <td>${student.first}</td>
      <td>${stats.absences}</td>
      <td>${stats.participation}</td>
      <td>${message}</td>
    `;

    tbody.appendChild(tr);
  });

});
