<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $request_body = file_get_contents('php://input');
} else {
  echo 'Method not allowed.';
}
?>
