<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enter Stats Page</title>
    <link rel="stylesheet" href="https://smith2021.github.io/hermes/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="main.css">
  </head>
  <body>
<?php
if ($_GET['failed'] == 'true') {
  echo '<p class="w3-text-red">Incorrect key. Please try again.</p>';
}
?>
    <input type="text" class="w3-input roboto" id="keyInput" placeholder="Access key"/>
    <button class="raised roboto w3-blue" id="submitKey">Submit</button>
    <script type="text/javascript">
document.getElementById('submitKey').addEventListener('click', function () {
  const userKey = document.getElementById('keyInput').value;
  location.replace('https://stat-display.herokuapp.com/?key=' + userKey);
});
    </script>
  </body>
</html>