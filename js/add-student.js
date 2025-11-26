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
    const nameRe = /^[A-Za-z]+$/;              
    const idRe = /^[0-9]+$/;                   
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear error function
    function clearError(input, errorField) {
        input.classList.remove("invalid");
        errorField.textContent = "";
        formMsg.textContent = "";
    }

    // Clear input when typing
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

        // ---- VALIDATION ----

        // FIRST NAME
        if (first === "") {
            firstErr.textContent = "First name is required.";
            firstInput.classList.add("invalid");
            valid = false;
        } else if (!nameRe.test(first)) {
            firstErr.textContent = "First name must contain only letters.";
            firstInput.classList.add("invalid");
            valid = false;
        }

        // LAST NAME
        if (last === "") {
            lastErr.textContent = "Last name is required.";
            lastInput.classList.add("invalid");
            valid = false;
        } else if (!nameRe.test(last)) {
            lastErr.textContent = "Last name must contain only letters.";
            lastInput.classList.add("invalid");
            valid = false;
        }

        // STUDENT ID
        if (id === "") {
            idErr.textContent = "Student ID is required.";
            idInput.classList.add("invalid");
            valid = false;
        } else if (!idRe.test(id)) {
            idErr.textContent = "Student ID must contain only numbers.";
            idInput.classList.add("invalid");
            valid = false;
        }

        // EMAIL
        if (email === "") {
            emailErr.textContent = "Email is required.";
            emailInput.classList.add("invalid");
            valid = false;
        } else if (!emailRe.test(email)) {
            emailErr.textContent = "Please enter a valid email address.";
            emailInput.classList.add("invalid");
            valid = false;
        }

        // STOP if invalid
        if (!valid) {
            formMsg.style.color = "red";
            formMsg.textContent = "Please fix the errors above.";
            return;
        }

        // ---- SEND DATA TO PHP USING AJAX ----
        const formData = new FormData();
        formData.append("first_name", first);
        formData.append("last_name", last);
        formData.append("matricule", id);
        formData.append("email", email);

        formMsg.style.color = "#444";
        formMsg.textContent = "Saving...";

        fetch("php/add_student.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                formMsg.style.color = "green";
                formMsg.textContent = "Student added successfully!";
                form.reset();
            } else {
                formMsg.style.color = "red";
                formMsg.textContent = data.message;
            }
        })
        .catch(() => {
            formMsg.style.color = "red";
            formMsg.textContent = "Network error. Try again.";
        });
    });

});

