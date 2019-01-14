<?php
$approved_keys = [
  'butterfield'
];
if (in_array($_GET['key'], $approved_keys)) {
  echo '<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JV Stats</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Open+Sans">
  <link rel="stylesheet" href="https://smith2021.github.io/hermes/w3.css">
  <link rel="stylesheet" href="../main.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous"/>
</head>
<body>
  <div class="w3-bar roboto">
    <div class="navbutton special">JV Stats</div>
    <a href="/?key=butterfield">
      <div class="navbutton">Stats by Player</div>
    </a>
    <a href="/games/?key=butterfield">
      <div class="navbutton">Stats by Game</div>
    </a>
  </div>
  <div class="w3-padding roboto">
    <h2 id="gameName"></h2>
    <div id="ponlaAca"></div>
  </div>
  <script>
var gameData = ';

# All of this prints out the needed JSON data
require_once('../Requests/library/Requests.php');
Requests::register_autoloader();

# check that a valid game is being requested
$available_games = json_decode(file_get_contents('../games.json'));
$game = html_entity_decode($_GET['gname']);
if (!in_array($game, $available_games)) {
  die('Invalid game requested');
}

# get refresh token
$data = array(
  'refresh_token' => '1/-Id4L97BavH44WTml9cG9SR9qJcB9f_DvED8w9-UJCo',
  'client_id' => '28407943286-2633kuv4qiv1aob1etfphidn5j60omr9.apps.googleusercontent.com',
  'client_secret' => 'lW7V6MT-OSbk-FJUqsvR8dMe',
  'grant_type' => 'refresh_token'
);

$response = Requests::post('https://www.googleapis.com/oauth2/v4/token', array(), $data);
$token = json_decode($response->body)->access_token;

$headers = array(
  'Authorization' => 'Bearer ' . $token
);

class Player {
  function Player ($subs, $data) {
    foreach ($subs as $cat) {
      $this->$cat = 0;
    }
    for ($i = 0; $i < count($subs); $i++) {
      $ojala = $subs[$i];
      $this->$ojala = $data[$i];
    }
  }
}

$final = array('Goals and Assists' => array(), 'Goalkeeping' => array(), 'Result' => '', 'Score' => '', 'Game' => $game);
$current_row = 1;
$keys = array();
while (true) {
  $sheets = Requests::get('https://sheets.googleapis.com/v4/spreadsheets/1oF3lCVupGU_zSNX2gZv2IeeDQ05r3ttxFPyx5VYpT9Y/values/' . $game . '!A' . $current_row . ':D' . $current_row, $headers);
  $data = json_decode($sheets->body);

  if (array_key_exists('values', $data)) {
    if ($current_row === 1) {
      foreach ($data->values[0] as $value) {
        array_push($keys, $value);
      }
    } else {
      $current_player = new Player($keys, $data->values[0]);
      array_push($final['Goals and Assists'], $current_player);
    }
  } else {
    $current_row += 1;
    break;
  }
  $current_row += 1;
}

$start = $current_row;
$keys = array();
while (true) {
  $sheets = Requests::get('https://sheets.googleapis.com/v4/spreadsheets/1oF3lCVupGU_zSNX2gZv2IeeDQ05r3ttxFPyx5VYpT9Y/values/' . $game . '!A' . $current_row . ':D' . $current_row, $headers);
  $data = json_decode($sheets->body);
  
  if (array_key_exists('values', $data)) {
    if ($current_row === $start) {
      foreach ($data->values[0] as $value) {
        array_push($keys, $value);
      }
    } else {
      $current_player = new Player($keys, $data->values[0]);
      array_push($final['Goalkeeping'], $current_player);
    }
  } else {
    break;
  }
  $current_row += 1;
}

$metadata = Requests::get('https://sheets.googleapis.com/v4/spreadsheets/1oF3lCVupGU_zSNX2gZv2IeeDQ05r3ttxFPyx5VYpT9Y/values/' . $game . '!E1:E2', $headers);
$ladata = json_decode($metadata->body);
$result = $ladata->values[0][0];
$score = $ladata->values[1][0];

$final['Result'] = $result;
$final['Score'] = $score;

echo json_encode($final);

echo ';function prettifyName (g) {
  let final = \'\';
  if (g.charAt(0) === \'@\') {
    final = \'At \';
  } else {
    final = \'Vs \';
  }
  final += g.substr(1);
  return final;
}

function makeTable (targetElement, name, dataSet, cols) {
  const table = document.createElement(\'TABLE\');
  const thead = document.createElement(\'THEAD\');
  const tbody = document.createElement(\'TBODY\');
  const title = document.createElement(\'H4\');
  
  title.appendChild(document.createTextNode(name));
  
  table.className += \'w3-table w3-bordered w3-striped w3-hoverable w3-large\';
  
  const headers = document.createElement(\'TR\');
  // For each column name, add a column to the table
  for (let i = 0; i < cols.length; i++) {
    let current = document.createElement(\'TH\');
    current.appendChild(document.createTextNode(cols[i]));
    headers.appendChild(current);
  }
  thead.appendChild(headers);
  table.appendChild(thead);
  
  for (let i = 0; i < dataSet.length; i++) {
    let current = document.createElement(\'TR\');
    for (let j = 0; j < cols.length; j++) {
      let cell = document.createElement(\'TD\');
      var value = dataSet[i][cols[j]];
      if (cols[j] !== \'Player\') {
        value = String(Math.round(dataSet[i][cols[j]] / 0.0001) * 0.0001).substring(0, 6);
      }
      cell.appendChild(document.createTextNode(value));
      current.appendChild(cell);
    }
    tbody.appendChild(current);
  }
  table.appendChild(tbody);
  
  // Call this last, it adds the table to the document
  targetElement.appendChild(title);
  targetElement.appendChild(table);
}

(function () {
  const prettyName = prettifyName(gameData.Game);
  
  document.getElementById(\'gameName\').innerHTML = prettyName + \' (\' + gameData.Score + \' \' + gameData.Result +  \')\';
  
  const container = document.getElementById(\'ponlaAca\');
  makeTable(container, \'Goals and Assists\', gameData[\'Goals and Assists\'], [\'Player\', \'Goals\', \'Assists\', \'Points\']);
  makeTable(container, \'Goalkeeping\', gameData.Goalkeeping, [\'Player\', \'Minutes\', \'Shots faced\', \'Goals allowed\']);
})();
  </script>
</body>
</html>';
}
?>
