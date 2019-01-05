<?php
$approved_keys = [
  'butterfield'
];
if (in_array($_GET['key'], $approved_keys)) {
  echo '<!DOCTYPE html>
<html>
<head>
  <title>JV Stats</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Open+Sans">
  <link rel="stylesheet" href="https://smith2021.github.io/hermes/w3.css">
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous"/>
</head>
<body>
  <div class="w3-bar roboto">
    <div class="navbutton special">JV Stats</div>
    <a href="/?key=butterfield">
      <div class="navbutton">Stats by Player</div>
    </a>
    <a href="/games/?key=butterfield">
      <div class="navbutton">Stats by Game</div></div>
    </a>
  <div class="tabbar main roboto">
    <div class="ripple tabbutton">
      Radar View
    </div>
    <div class="ripple tabbutton selected">
      Table View
    </div>
    <div class="ripple tabbutton">
      Graph View
    </div>
  </div>
  <div class="w3-padding roboto">
    <h2>Stats By Player</h2>
    <h6>Only players with at least one goal or one assist are shown.</h6>
    <div class="tab" id="radarviewSection" hidden>
      <div id="statsContainer"></div>
    </div>
    <div class="tab" id="tableviewSection"></div>
    <div class="tab" id="graphviewSection" hidden>
      <div id="graphContainer"></div>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js"></script>
  <script src="stat-display.js"></script>
</body>
</html>';
} else {
  header('Location: enter/?failed=true');
}
?>
