<?php
require_once __DIR__ . "/db_connect.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Get values
    $first = trim($_POST["first_name"] ?? "");
    $last  = trim($_POST["last_name"] ?? "");
    $sid   = trim($_POST["matricule"] ?? "");
    $email = trim($_POST["email"] ?? "");

    // Validate required fields
    if ($first === "" || $last === "" || $sid === "" || $email === "") {
        echo "ERROR: All fields are required.";
        exit;
    }

    // Connect to DB
    $pdo = db_connect();
    if (!$pdo) {
        echo "ERROR: Could not connect to database.";
        exit;
    }

    // Prepare INSERT query
    $sql = "INSERT INTO students (first_name, last_name, matricule, email, created_at)
            VALUES (:first, :last, :sid, :email, NOW())";

    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([
            ":first" => $first,
            ":last"  => $last,
            ":sid"   => $sid,
            ":email" => $email
        ]);

        echo "SUCCESS: Student added.";

    } catch (PDOException $e) {
        echo "DB ERROR: " . $e->getMessage();
    }

} else {
    echo "Invalid request.";
}
?>

