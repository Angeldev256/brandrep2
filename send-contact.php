<?php
// ================================================================
//  send-contact.php – Forwards contact form to info@brandrepublicug.com
// ================================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Sanitize and collect form data
$first_name = trim($_POST['first_name'] ?? '');
$last_name  = trim($_POST['last_name'] ?? '');
$email      = trim($_POST['email'] ?? '');
$interest   = trim($_POST['interest'] ?? '');
$message    = trim($_POST['message'] ?? '');

// Validate required fields
if (empty($first_name) || empty($last_name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
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
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail delivery failed. Please contact us directly.']);
}
?>