<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $approved_keys = [
    '6f070951-0da6-4349-ac6f-4b305875a6ab'
  ];
  $request_body = file_get_contents('php://input');
  $data_file = fopen('player_stats.json', 'w') or die('Unable to open file');
  fwrite($data_file, htmlspecialchars_decode($request_body->new_data));
  fclose($data_file);
  echo   echo utf8_decode(urldecode($request_body));
($request_body);
} else {
  echo 'Method not allowed.';
}
?>
