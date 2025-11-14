document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("studentForm");
    
    // Inputs
    const firstInput = document.getElementById("firstName");
    const lastInput = document.getElementById("lastName");
    const idInput = document.getElementById("studentId");
    const emailInput = document.getElementById("email");

    // Error fields under each input
    const firstErr = document.getElementById("firstNameError");
    const lastErr = document.getElementById("lastNameError");
    const idErr = document.getElementById("studentIdError");
    const emailErr = document.getElementById("emailError");
    const formMsg = document.getElementById("formMessage");
    // Regex rules
    const nameRe = /^[A-Za-z]+$/;              // letters only
    const idRe = /^[0-9]+$/;                   // numbers only
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // valid email

    // Function to clear error when typing
    function clearError(input, errorField) {
        input.classList.remove("invalid");
        errorField.textContent = "";
        formMsg.textContent = "";
    }

    // Clear on input
    [firstInput, lastInput, idInput, emailInput].forEach(input => {
        input.addEventListener("input", () => {
            clearError(input, document.getElementById(input.id + "Error"));
        });
    });

    // SUBMIT EVENT
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let valid = true;

        const first = firstInput.value.trim();
        const last = lastInput.value.trim();
        const id = idInput.value.trim();
        const email = emailInput.value.trim();

         formMsg.textContent = "";

        // --- FIRST NAME ---
        if (first === "") {
            firstErr.textContent = "First name is required.";
            firstInput.classList.add("invalid");
            valid = false;
        } 
        else if (!nameRe.test(first)) {
            firstErr.textContent = "First name must contain only letters.";
            firstInput.classList.add("invalid");
            valid = false;
        }

        // --- LAST NAME ---
        if (last === "") {
            lastErr.textContent = "Last name is required.";
            lastInput.classList.add("invalid");
            valid = false;
        } 
        else if (!nameRe.test(last)) {
            lastErr.textContent = "Last name must contain only letters.";
            lastInput.classList.add("invalid");
            valid = false;
        }

        // --- STUDENT ID ---
        if (id === "") {
            idErr.textContent = "Student ID is required.";
            idInput.classList.add("invalid");
            valid = false;
        } 
        else if (!idRe.test(id)) {
            idErr.textContent = "Student ID must contain only numbers.";
            idInput.classList.add("invalid");
            valid = false;
        }

        // --- EMAIL ---
        if (email === "") {
            emailErr.textContent = "Email is required.";
            emailInput.classList.add("invalid");
            valid = false;
        } 
        else if (!emailRe.test(email)) {
            emailErr.textContent = "Please enter a valid email address.";
            emailInput.classList.add("invalid");
            valid = false;
        }

        // If there are errors → stop
        if (!valid) {
         formMsg.style.color = "red";
         formMsg.textContent = "Please fix the errors above.";
        return;
       }

        // If valid → save student
        const student = { first, last, id, email };

        let students = JSON.parse(localStorage.getItem("students")) || [];
        students.push(student);
        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("newStudentAdded", "true");


         formMsg.style.color = "green";
         formMsg.textContent = "Student added successfully!";

        //alert("Student added successfully!");
        form.reset();
    });

});
