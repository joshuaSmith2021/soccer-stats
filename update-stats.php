<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $approved_keys = [
    '4ef04b98-df5e-4165-840f-10a01df45eea'
  ];
  if (in_array($_GET['key'], $approved_keys)) {
    $request_body = file_get_contents('php://input');
    $new_data = utf8_decode(urldecode($request_body));
    $data_file = fopen('player_stats.json', 'w') or die('Unable to open file');
    fwrite($data_file, $new_data) or die('Unable to write to file');
    fclose($data_file);
    echo $new_data;
  } else {
    echo 'Invalid key';
  }
} else {
  echo 'Method not allowed.';
}
?>
