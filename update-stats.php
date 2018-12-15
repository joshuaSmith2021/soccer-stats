<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $approved_keys = [
    '6f070951-0da6-4349-ac6f-4b305875a6ab'
  ];
  $request_body = file_get_contents('php://input');
  $json = json_decode($request_body);
  $data_file = fopen('player_stats.json', 'w') or die('Unable to open file');
  fwrite($data_file, $json->new_data);
  fclose($data_file);
  echo $json->new_data;
} else {
  echo 'Method not allowed.';
}
?>
