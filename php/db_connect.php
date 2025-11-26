<?php
require_once __DIR__ . "/config.php";

function db_connect() {
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

    try {
        $dsn = "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4";
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        return $pdo;

    } catch (PDOException $e) {
        file_put_contents(__DIR__ . "/db_errors.log",
            date("c") . " - " . $e->getMessage() . PHP_EOL,
            FILE_APPEND
        );
        return false;
    }
}

// ---------- TEST CONNECTION ----------
if (basename($_SERVER['PHP_SELF']) === 'db_connect.php') {

    $conn = db_connect();

    if ($conn) {
        echo "<h2 style='color:green;'>Connection successful!</h2>";
    } else {
        echo "<h2 style='color:red;'>Connection failed!</h2>";
        echo "<p>Check db_errors.log for details.</p>";
    }
}
?>