<?php
require_once __DIR__ . "/db_connect.php";

$pdo = db_connect();

if (!$pdo) {
    die("Database connection failed.");
}

try {
    $stmt = $pdo->query("SELECT * FROM students ORDER BY last_name ASC");
    $students = $stmt->fetchAll();

    echo "<h2>List of Students</h2>";
    echo "<table border='1' cellpadding='8'>";
    echo "<tr>
            <th>ID</th>
            <th>Matricule</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Group</th>
          </tr>";

    foreach ($students as $s) {
        echo "<tr>";
        echo "<td>{$s['id']}</td>";
        echo "<td>{$s['matricule']}</td>";
        echo "<td>{$s['first_name']}</td>";
        echo "<td>{$s['last_name']}</td>";
        echo "<td>{$s['email']}</td>";
        echo "<td>{$s['group_id']}</td>";
        echo "</tr>";
    }

    echo "</table>";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
