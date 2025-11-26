<?php
require_once __DIR__ . "/db_connect.php";

header("Content-Type: application/json");

$pdo = db_connect();
if (!$pdo) {
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed"
    ]);
    exit;
}

try {
    $stmt = $pdo->query("SELECT * FROM students ORDER BY last_name ASC");
    $students = $stmt->fetchAll();

    echo json_encode([
        "status" => "success",
        "data" => $students
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

