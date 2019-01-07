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
    <h2>Select a Game</h2>
    <div id="dropdown"></div>
    <br>
    <button class="raised main" id="loadStats">View Stats</button>
  </div>
  <script src="view-stats.js"></script>
</body>
</html>';
} else {
  header('Location: enter/?failed=true');
}
?>
