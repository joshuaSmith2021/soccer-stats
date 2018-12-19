<?php
$approved_keys = [
  'butterfield'
];
if (in_array($_GET['key'], $approved_keys)) {
  echo '<!DOCTYPE html>
<html>
<head>
  <title>JV Stats</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <link rel="stylesheet" href="https://smith2021.github.io/hermes/w3.css">
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous"/>
</head>
<body>
  <div class="tabbar main roboto">
    <div class="ripple tabbutton selected">
      Radar View
    </div>
    <div class="ripple tabbutton">
      Table View
    </div>
    <div class="ripple tabbutton">
      Graph View
    </div>
  </div>
  <div class="w3-padding roboto">
    <h2>Stats By Player</h2>
    <h6>Only players with at least one goals or one assist are shown.</h6>
    <div class="tab" id="radarviewSection">
      <div id="statsContainer"></div>
    </div>
    <div class="tab" id="tableviewSection" hidden>
      <table class="w3-table w3-bordered w3-striped w3-hoverable w3-large">
        <thead>
          <tr>
            <th>Player</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Points</th>
            <th>Goals/Game</th>
            <th>Assists/Game</th>
            <th>Points/Game</th>
          </tr>
        </thead>
        <tbody id="tableDisplay"></tbody>
      </table>
    </div>
    <div class="tab" id="graphviewSection" hidden>
      <div id="graphContainer"></div>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js"></script>
  <script src="stat-display.js"></script>
</body>
</html>';
} else {
  header('Location: https://stat-display.herokuapp.com/enter/?failed=true');
}
?>
