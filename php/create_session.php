<?php
require_once __DIR__ . "/db_connect.php";

header("Content-Type: application/json");

$course_id = $_POST['course_id'] ?? $_GET['course_id'] ?? null;
$group_id  = $_POST['group_id']  ?? $_GET['group_id']  ?? null;
$opened_by = $_POST['opened_by'] ?? $_GET['opened_by'] ?? null;

if (!$course_id || !$group_id || !$opened_by) {
    echo json_encode(["status" => "error", "message" => "Missing required parameters"]);
    exit;
}

$pdo = db_connect();

try {
    $stmt = $pdo->prepare("
        INSERT INTO attendance_sessions (course_id, group_id, date, opened_by, status)
        VALUES (?, ?, NOW(), ?, 'open')
    ");
    $stmt->execute([$course_id, $group_id, $opened_by]);

    echo json_encode([
        "status" => "success",
        "session_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
