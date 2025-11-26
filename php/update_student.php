<?php
require_once __DIR__ . "/db_connect.php";

$pdo = db_connect();

// If no form was submitted → show update form
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    $id = $_GET["id"] ?? null;

    if (!$id) {
        die("No student ID.");
    }

    $stmt = $pdo->prepare("SELECT * FROM students WHERE id = :id");
    $stmt->execute([":id" => $id]);
    $student = $stmt->fetch();

    if (!$student) {
        die("Student not found.");
    }
?>
    <h2>Update Student</h2>
    <form method="POST">
        <input type="hidden" name="id" value="<?= $student['id'] ?>">

        Matricule: <input name="matricule" value="<?= $student['matricule'] ?>"><br><br>
        First Name: <input name="first_name" value="<?= $student['first_name'] ?>"><br><br>
        Last Name: <input name="last_name" value="<?= $student['last_name'] ?>"><br><br>
        Email: <input name="email" value="<?= $student['email'] ?>"><br><br>

        <button type="submit">Update</button>
    </form>
<?php
    exit;
}

// If form submitted → update DB
$id = $_POST["id"];
$matricule = $_POST["matricule"];
$first = $_POST["first_name"];
$last = $_POST["last_name"];
$email = $_POST["email"];

try {
    $stmt = $pdo->prepare("
        UPDATE students SET
            matricule = :matricule,
            first_name = :first,
            last_name = :last,
            email = :email
        WHERE id = :id
    ");

    $stmt->execute([
        ":matricule" => $matricule,
        ":first" => $first,
        ":last" => $last,
        ":email" => $email,
        ":id" => $id
    ]);

    echo "Student updated successfully.";

} catch (PDOException $e) {
    echo "Update error: " . $e->getMessage();
}
