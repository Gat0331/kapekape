<?php
header('Content-Type: application/json');

file_put_contents('php://stderr', print_r(file_get_contents("php://input"), true));

error_log(file_get_contents("php://input"));


$conn = new mysqli("localhost", "root", "", "metung");
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['items']) || !isset($data['total'])) {
    echo json_encode(["success" => false, "error" => "No data received."]);
    $conn->close();
    exit;
}

$items = $conn->real_escape_string(json_encode($data['items']));
$total = intval($data['total']);

$sql = "INSERT INTO orders (items, total) VALUES ('$items', $total)";
if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "orderId" => $conn->insert_id]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
$conn->close();
?>