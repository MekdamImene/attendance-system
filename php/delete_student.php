<?php
require_once __DIR__ . "/db_connect.php";

$id = $_GET["id"] ?? null;

if ($id === null) {
    die("No student ID provided.");
}

$pdo = db_connect();

try {
    $stmt = $pdo->prepare("DELETE FROM students WHERE id = :id");
    $stmt->execute([":id" => $id]);

    echo "Student deleted successfully.";

} catch (PDOException $e) {
    echo "Error deleting student: " . $e->getMessage();
}
?>
