var allData = {};
var totals = {};
var averages = {};
var playerCount = 0;

function getTotals (allData) {
  var total = {};
  const dataSets = Object.keys(allData);
  for (var i = 0; i < dataSets.length; i++) {
    var currentPlayerCount = allData[dataSets[i]].length;
    var eligiblePlayers = currentPlayerCount;
    var substats = Object.keys(allData[dataSets[i]][0]);
    if (dataSets[i] !== 'Goalkeeping') {
      eligiblePlayers = playerCount;
    }
    for (var j = 0; j < substats.length; j++) {
      total[substats[j]] = 0;
      for (var k = 0; k < currentPlayerCount; k++) {
        var currentVal = allData[dataSets[i]][k][substats[j]];
        if (!isNaN(currentVal)) {
          total[substats[j]] += allData[dataSets[i]][k][substats[j]];
        }
      }
    }
  }
  delete total.Player;
  return total;
}

function getAverages (allData) {
  var total = {};
  const dataSets = Object.keys(allData);
  for (var i = 0; i < dataSets.length; i++) {
    var currentPlayerCount = allData[dataSets[i]].length;
    var eligiblePlayers = currentPlayerCount;
    var substats = Object.keys(allData[dataSets[i]][0]);
    if (dataSets[i] !== 'Goalkeeping') {
      eligiblePlayers = playerCount;
    }
    for (var j = 0; j < substats.length; j++) {
      total[substats[j]] = 0;
      for (var k = 0; k < currentPlayerCount; k++) {
        var currentVal = allData[dataSets[i]][k][substats[j]];
        if (!isNaN(currentVal)) {
          total[substats[j]] += allData[dataSets[i]][k][substats[j]];
        }
      }
      total[substats[j]] /= eligiblePlayers;
    }
  }
  delete total.Player;
  return total;
}

function setupTabs () {
  for (let i = 0; i < document.getElementsByClassName('tabbutton').length; i++) {
    document.getElementsByClassName('tabbutton')[i].addEventListener('click', function (element) {
      for (let j = 0; j < document.getElementsByClassName('tabbutton').length; j++) {
        document.getElementsByClassName('tabbutton')[j].classList.remove('selected');
      }
      this.classList.add('selected');
      for (let k = 0; k < document.getElementsByClassName('tab').length; k++) {
        document.getElementsByClassName('tab')[k].style.display = 'none';
      }
      document.getElementById(this.innerText.replace(/\s+/g, '').toLowerCase() + 'Section').style.display = 'block';
    });
  }
}
// Creates a table from data
function makeTable (targetId, name, dataSet, cols) {
  const table = document.createElement('TABLE');
  const thead = document.createElement('THEAD');
  const tbody = document.createElement('TBODY');
  const title = document.createElement('H4');
  
  title.appendChild(document.createTextNode(name));
  
  table.className += 'w3-table w3-bordered w3-striped w3-hoverable w3-large';
  
  const headers = document.createElement('TR');
  // For each column name, add a column to the table
  for (let i = 0; i < cols.length; i++) {
    let current = document.createElement('TH');
    current.appendChild(document.createTextNode(cols[i]));
    headers.appendChild(current);
  }
  thead.appendChild(headers);
  table.appendChild(thead);
  
  for (let i = 0; i < dataSet.length; i++) {
    let current = document.createElement('TR');
    for (let j = 0; j < cols.length; j++) {
      let cell = document.createElement('TD');
      var value = dataSet[i][cols[j]];
      if (cols[j] !== 'Player') {
        value = String(Math.round(dataSet[i][cols[j]] / 0.0001) * 0.0001).substring(0, 6);
      }
      cell.appendChild(document.createTextNode(value));
      current.appendChild(cell);
    }
    tbody.appendChild(current);
  }
  table.appendChild(tbody);
  
  // Call this last, it adds the table to the document
  document.getElementById(targetId).appendChild(title);
  document.getElementById(targetId).appendChild(table);
}
// Creates a single radar chart for a player
function makeRadar (playerData, cols) {
  const canvas = document.createElement('CANVAS');
  const ctx = canvas.getContext('2d');
  let playerChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: cols,
      datasets: [
        {
          label: playerData.Player,
          backgroundColor: 'rgba(224, 23, 23, 0.2)',
          borderColor: 'rgb(224, 23, 23)',
          data: (function () {
            let current = [];
            for (let i = 0; i < cols.length; i++) {
              current.push(playerData[cols[i]]);
            }
            return current;
          })()
        },
        {
          label: 'Average Player',
          backgroundColor: 'rgb(23, 43, 208, 0.2)',
          borderColor: 'rgb(23, 43, 208)',
          data: (function () {
            let current = [];
            for (let i = 0; i < cols.length; i++) {
              current.push(averages[cols[i]]);
            }
            return current;
          })()
        }
      ]
    }
  });
  return canvas;
}

function createRadars () {
  for (let i = 0; i < Object.keys(allData).length; i++) {
    var row = document.createElement('DIV');
    row.className += 'w3-row';
    for (let j = 0; j < allData[Object.keys(allData)[i]].length; j++) {
      if (j % 3 === 0 || j + 1 >= allData[Object.keys(allData)[i]].length) {
        // Reset row
        row.innerHTML;
        document.getElementById('radarviewSection').appendChild(row);
        row = document.createElement('DIV');
        row.className += 'w3-row';
      }
      var cell = document.createElement('DIV');
      cell.className += 'w3-col l4 m12';
      if (Object.keys(allData)[i] === 'Goals and Assists') {
        var playerName = document.createElement('H4');
        playerName.className += 'w3-center';
        var nameText = document.createTextNode(allData['Goals and Assists'][j].Player);
        playerName.appendChild(nameText);
        cell.appendChild(playerName);
        cell.appendChild(makeRadar(allData['Goals and Assists'][j], ['Goals', 'Assists', 'Points', 'Goals per Game', 'Assists per Game', 'Points per Game']));
      } else if (Object.keys(allData)[i] === 'Goalkeeping') {
        // The radars for keepers are pretty boring, so they are not created
        // cell.appendChild(makeRadar(allData['Goalkeeping'][j], ['Shots faced', 'Goals allowed', 'GAA']));
      }
      row.appendChild(cell);
    }
  }
}

function makeGraph (playerData, cols) {
  const canvas = document.createElement('CANVAS');
  const ctx = canvas.getContext('2d');
  let playerChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cols,
      datasets: [
        {
          label: playerData.Player,
          backgroundColor: 'rgba(224, 23, 23, 0.2)',
          borderColor: 'rgb(224, 23, 23)',
          data: (function () {
            let current = [];
            for (let i = 0; i < cols.length; i++) {
              current.push(playerData[cols[i]]);
            }
            return current;
          })()
        },
        {
          label: 'Average Player',
          backgroundColor: 'rgb(23, 43, 208, 0.2)',
          borderColor: 'rgb(23, 43, 208)',
          data: (function () {
            let current = [];
            for (let i = 0; i < cols.length; i++) {
              current.push(averages[cols[i]]);
            }
            return current;
          })()
        }
      ]
    }
  });
  return canvas;
}

function createGraphs () {
  for (let i = 0; i < Object.keys(allData).length; i++) {
    var row = document.createElement('DIV');
    row.className += 'w3-row';
    for (let j = 0; j < allData[Object.keys(allData)[i]].length; j++) {
      if (j % 3 === 0 || j + 1 >= allData[Object.keys(allData)[i]].length) {
        // Reset row
        row.innerHTML;
        document.getElementById('graphviewSection').appendChild(row);
        row = document.createElement('DIV');
        row.className += 'w3-row';
      }
      var cell = document.createElement('DIV');
      cell.className += 'w3-col l4 m12';
      if (Object.keys(allData)[i] === 'Goals and Assists') {
        var playerName = document.createElement('H4');
        playerName.className += 'w3-center';
        var nameText = document.createTextNode(allData['Goals and Assists'][j].Player);
        playerName.appendChild(nameText);
        cell.appendChild(playerName);
        cell.appendChild(makeGraph(allData['Goals and Assists'][j], ['Goals', 'Assists', 'Points', 'Goals per Game', 'Assists per Game', 'Points per Game']));
      } else if (Object.keys(allData)[i] === 'Goalkeeping') {
        // The radars for keepers are pretty boring, so they are not created
        // cell.appendChild(makeRadar(allData['Goalkeeping'][j], ['Shots faced', 'Goals allowed', 'GAA']));
      }
      row.appendChild(cell);
    }
  }
}

const http = new XMLHttpRequest();

http.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    console.log(this.responseText);
    allData = JSON.parse(this.responseText).data_sets;
    playerCount = JSON.parse(this.responseText).player_count;
    setupTabs();
    totals = getTotals(allData);
    averages = getAverages(allData);
    makeTable('tableviewSection', 'Goals and Assists', allData['Goals and Assists'], ['Player', 'Goals', 'Assists', 'Points', 'Goals per Game', 'Assists per Game', 'Points per Game']);
    document.getElementById('tableviewSection').innerHTML += '<hr/>';
    makeTable('tableviewSection', 'Goalkeeping', allData.Goalkeeping, ['Player', 'Minutes', 'Shots faced', 'Goals allowed', 'GAA']);
    createRadars();
    createGraphs();
  }
};
http.open('GET', 'player_stats.json');
http.send();
