<?php
// ================================================================
//  send-contact.php – Forwards contact form to info@brandrepublicug.com
// ================================================================

// 1. Allow CORS (Required for Next.js/React frontend)
header("Access-Control-Allow-Origin: https://brandrepublicug.com"); // Change '*' to 'https://brandrepublicug.com' in production
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// 2. Parse JSON payload OR standard form data
$json = file_get_contents('php://input');
$data = json_decode($json, true) ?: $_POST;

// Sanitize and collect form data
$first_name = trim($data['first_name'] ?? '');
$last_name  = trim($data['last_name'] ?? '');
$email      = trim($data['email'] ?? '');
$interest   = trim($data['interest'] ?? '');
$message    = trim($data['message'] ?? '');

// Validate required fields
if (empty($first_name) || empty($last_name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit();
}

$full_name = "$first_name $last_name";
$subject   = "Contact Form: $full_name – $interest";

// Build email body
$body = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "  NEW CONTACT – Brand Republic\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "Name         : $full_name\n";
$body .= "Email        : $email\n";
$body .= "Interest     : $interest\n";
$body .= "─────────────────────────────────────\n";
$body .= "Message:\n$message\n";
$body .= "─────────────────────────────────────\n";

// Headers (DreamHost requires "From" to be your domain address)
$to      = 'info@brandrepublicug.com';
$headers = "From: info@brandrepublicug.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$success = mail($to, $subject, $body, $headers);

if ($success) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail delivery failed. Please contact us directly.']);
}
?>