<?php
require_once __DIR__ . "/db_connect.php";

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// Collect fields
$first = trim($_POST["first_name"] ?? "");
$last  = trim($_POST["last_name"] ?? "");
$matricule = trim($_POST["matricule"] ?? "");
$email = trim($_POST["email"] ?? "");

// Validate required fields
if ($first === "" || $last === "" || $matricule === "" || $email === "") {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// Connect to DB
$pdo = db_connect();
if (!$pdo) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit;
}

// Insert query
$sql = "INSERT INTO students (first_name, last_name, matricule, email, created_at)
        VALUES (:first, :last, :matricule, :email, NOW())";

$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        ":first" => $first,
        ":last" => $last,
        ":matricule" => $matricule,
        ":email" => $email
    ]);

    echo json_encode(["status" => "success", "message" => "Student added successfully"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>

