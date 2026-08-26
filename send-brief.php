<?php
// ================================================================
//  send-brief.php – Forwards campaign brief to info@brandrepublicug.com
// ================================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// Sanitize and collect form data
$company   = trim($_POST['company_name'] ?? '');
$email     = trim($_POST['email'] ?? '');
$phone     = trim($_POST['telephone'] ?? '');
$objective = trim($_POST['objective'] ?? '');
$locations = trim($_POST['locations'] ?? '');
$startDate = trim($_POST['start_date'] ?? '');
$endDate   = trim($_POST['end_date'] ?? '');
$budget    = trim($_POST['budget'] ?? '');
$services  = trim($_POST['services'] ?? '');
$contactName = trim($_POST['contact_name'] ?? '');

// Validate required fields
if (empty($company) || empty($email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Company name and email are required.']);
    exit;
}

// Build email body
$subject = "New Campaign Brief from $company";

$body = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "  NEW CAMPAIGN BRIEF – Brand Republic\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "Company       : $company\n";
$body .= "Email         : $email\n";
$body .= "Phone         : $phone\n";
$body .= "Services      : $services\n";
$body .= "Locations     : $locations\n";
$body .= "Start Date    : $startDate\n";
$body .= "End Date      : $endDate\n";
$body .= "Budget        : $budget\n";
$body .= "─────────────────────────────────────\n";
$body .= "Campaign Brief:\n$objective\n";
$body .= "─────────────────────────────────────\n";

$body = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "  NEW CAMPAIGN BRIEF – Brand Republic\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "Contact Name  : $contactName\n";   // <-- new line
$body .= "Company       : $company\n";
$body .= "Email         : $email\n";
// ... rest as before

// Email headers – DreamHost requires "From" to be a domain address
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