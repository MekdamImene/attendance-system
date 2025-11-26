<?php
require_once __DIR__ . "/db_connect.php";

header("Content-Type: application/json");

// Use GET for manual testing
if (!isset($_GET['session_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing session_id"]);
    exit;
}

$session_id = intval($_GET['session_id']);

$pdo = db_connect();

try {
    $stmt = $pdo->prepare("UPDATE attendance_sessions SET status='closed' WHERE id=?");
    $stmt->execute([$session_id]);

    echo json_encode(["status" => "success", "message" => "Session closed"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
