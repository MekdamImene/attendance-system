<?php
require_once __DIR__ . "/db_connect.php";

$pdo = db_connect();

if (!$pdo) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT id, first_name, last_name, matricule, email FROM students ORDER BY last_name ASC");
    $students = $stmt->fetchAll();

    echo json_encode($students);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
