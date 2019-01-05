<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $approved_keys = [
    '4ef04b98-df5e-4165-840f-10a01df45eea'
  ];
  if (in_array($_GET['key'], $approved_keys)) {
    $new_data = $_POST['json'];
    $data_file = fopen('games.json', 'w') or die('no se puede abrir la data');
    fwrite($data_file, $new_data) or die('no se puede escribir la data');
    fclose($data_file);
    echo $new_data;
  } else {
    echo 'Invalid key';
  }
} else {
  echo 'Method not allowed.';
}
?>
