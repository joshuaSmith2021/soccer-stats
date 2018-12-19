var playerData = [];
var gamesPlayed = 0;
var playerCount = 0;

var totalGoals = 0;
var totalAssists = 0;
var totalPoints = 0;

function findTotals () {
  totalGoals = (function () {
    let goalCount = 0;
    for (let i = 0; i < playerData.length; i++) {
      goalCount += playerData[i].goals;
    }
    return goalCount;
  })();

  totalAssists = (function () {
    let assistCount = 0;
    for (let i = 0; i < playerData.length; i++) {
      assistCount += playerData[i].assists;
    }
    return assistCount;
  })();

  totalPoints = (function () {
    let pointCount = 0;
    for (let i = 0; i < playerData.length; i++) {
      pointCount += playerData[i].points;
    }
    return pointCount;
  })();
}

function getLeaders () {
  var highestGoals = 0;
  var highestAssists = 0;
  for (let i = 0; i < playerData.length; i++) {
    if (playerData[i].goals >= highestGoals) {
      highestGoals = playerData[i].goals;
    }
    if (playerData[i].assists >= highestAssists) {
      highestAssists = playerData[i].assists;
    }
  }
  for (let i = 0; i < playerData.length; i++) {
    if (playerData[i].goals === highestGoals) {
      playerData[i].mostGoals = true;
    }
    if (playerData[i].assists === highestAssists) {
      playerData[i].mostAssists = true;
    }
  }
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

function radarSetup () {
  const statsContainer = document.getElementById('statsContainer');
  var containerString = '';
  var i = 0;
  for (i = 0; i < playerData.length; i++) {
    if (i % 3 === 0) {
      containerString += '<div class="w3-row">';
    }
    containerString += '<div class="w3-col l4 m12">' +
          '<h4 class="w3-center">' + playerData[i].playerName + (function () {
      if (playerData[i].mostGoals && playerData[i].mostAssists) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Top Scorer (' + playerData[i].goals + ')</li><li>Most Assists (' + playerData[i].assists + ')</li></ul></i>';
      } else if (playerData[i].mostGoals) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Top Scorer (' + playerData[i].goals + ')</li></ul></i>';
      } else if (playerData[i].mostAssists) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Most Assists (' + playerData[i].assists + ')</li></ul></i>';
      } else {
        return '';
      }
    })() + '</h4>' +
          '<canvas class="playerDisplay"></canvas>' +
        '</div>';
    if ((i + 1) % 3 === 0 || i + 1 === playerData.length) {
      containerString += '</div>'
    }
  }
  statsContainer.innerHTML = containerString;
  const playerDisplays = document.getElementsByClassName('playerDisplay');
  for (let i = 0; i < playerData.length; i++) {
    let ctx = playerDisplays[i].getContext('2d');
    let playerChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Goals', 'Assists', 'Points', 'Goals per Game', 'Assists per Game', 'Points per Game'],
        datasets: [
          {//#d01717
            label: playerData[i].playerName,
            backgroundColor: 'rgba(224, 23, 23, 0.2)',
            borderColor: 'rgb(224, 23, 23)',
            data: (function () {
              let current = [];
              current.push(playerData[i].goals);
              current.push(playerData[i].assists);
              current.push(playerData[i].points);
              current.push(playerData[i].goals / gamesPlayed);
              current.push(playerData[i].assists / gamesPlayed);
              current.push(playerData[i].points / gamesPlayed);
              return current;
            })()
          },
          {
            label: 'Average Player',
            backgroundColor: 'rgb(23, 43, 208, 0.2)',
            borderColor: 'rgb(23, 43, 208)',
            data: (function () {
              let current = [];
              current.push(totalGoals / playerCount);
              current.push(totalAssists / playerCount);
              current.push(totalPoints / playerCount);
              current.push(totalGoals / playerCount / gamesPlayed);
              current.push(totalAssists / playerCount / gamesPlayed);
              current.push(totalPoints / playerCount / gamesPlayed);
              return current;
            })()
          }
        ]
      }
    });
  }
}

function buildTable (newData) {
  const tableDisplay = document.getElementById('tableDisplay');
  for (let i = 0; i < newData.length; i++) {
    tableDisplay.innerHTML += '<tr>' +
      '<td>' + newData[i].playerName + (function () {
      if (newData[i].mostGoals && newData[i].mostAssists) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Top Scorer (' + newData[i].goals + ')</li><li>Most Assists (' + newData[i].assists + ')</li></ul></i>';
      } else if (newData[i].mostGoals) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Top Scorer (' + newData[i].goals + ')</li></ul></i>';
      } else if (newData[i].mostAssists) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Most Assists (' + newData[i].assists + ')</li></ul></i>';
      } else {
        return '';
      }
    })() + '</td>' +
      '<td>' + newData[i].goals + '</td>' +
      '<td>' + newData[i].assists + '</td>' +
      '<td>' + newData[i].points + '</td>' +
      '<td>' + Math.round(newData[i].goals / gamesPlayed * 1000) / 1000 + '</td>' +
      '<td>' + Math.round(newData[i].assists / gamesPlayed * 1000) / 1000 + '</td>' +
      '<td>' + Math.round(newData[i].points / gamesPlayed * 1000) / 1000 + '</td>';
  }
  tableDisplay.innerHTML += '<tr>' +
    '<td><b>Total</b></td>' +
    '<td><b>' + totalGoals + '</b></td>' +
    '<td><b>' + totalAssists + '</b></td>' +
    '<td><b>' + totalPoints + '</b></td>' +
    '<td>---</td>' +
    '<td>---</td>' +
    '<td>---</td>' +
    '</tr>';
}

function tableSetup () {
  buildTable(playerData);
  const triggers = document.getElementsByClassName('dataCol');
  const categories = {
    'player': false,
    'goals': 'goals',
    'assists': 'assists',
    'points': 'points',
    'goalsgame': 'goals',
    'assistsgame': 'assists',
    'pointsgame': 'points'
  };
  for (let i = 0; i < triggers.length; i++) {
    triggers[i].addEventListener('click', function () {
      if (categories[this.innerText.toLowerCase().replace('/', '')]) {
        sortTable(categories[this.innerText.toLowerCase().replace('/', '')]);
      }
    });
  }
}

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  }).reverse();
}

function sortTable (category) {
  let table = document.getElementById('tableDisplay');
  table.innerHTML = '';
  const ordered = sortByKey(playerData, category);
  buildTable(ordered);
}

function graphSetup () {
  var containerString = '';
  for (let i = 0; i < playerData.length; i++) {
    if (i % 3 === 0) {
      containerString += '<div class="w3-row">'
    }
    containerString += '<div class="w3-col l4 m12"><h4 class="w3-center">' + playerData[i].playerName + (function () {
      if (playerData[i].mostGoals && playerData[i].mostAssists) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Top Scorer (' + playerData[i].goals + ')</li><li>Most Assists (' + playerData[i].assists + ')</li></ul></i>';
      } else if (playerData[i].mostGoals) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Top Scorer (' + playerData[i].goals + ')</li></ul></i>';
      } else if (playerData[i].mostAssists) {
        return ' <i class="fa fa-trophy w3-text-yellow hover-container"><ul><li>Most Assists (' + playerData[i].assists + ')</li></ul></i>';
      } else {
        return '';
      }
    })() + '</h4><canvas id="graph' + i + '"></canvas></div>';
    if ((i + 1) % 3 === 0 || (i + 1) === playerData.length) {
      containerString += '</div>';
    }
  }
  document.getElementById('graphContainer').innerHTML = containerString;
  for (let i = 0; i < playerData.length; i++) {
    let ctx = document.getElementById('graph' + i).getContext('2d');
    let playerChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Goals', 'Assists', 'Points', 'Goals per Game', 'Assists per Game', 'Points per Game'],
        datasets: [
          {
            label: playerData[i].playerName,
            backgroundColor: 'rgba(224, 23, 23, 0.2)',
            borderColor: 'rgb(224, 23, 23)',
            data: (function () {
              let current = [];
              current.push(playerData[i].goals);
              current.push(playerData[i].assists);
              current.push(playerData[i].points);
              current.push(playerData[i].goals / gamesPlayed);
              current.push(playerData[i].assists / gamesPlayed);
              current.push(playerData[i].points / gamesPlayed);
              return current;
            })()
          },
          {
            label: 'Average Player',
            backgroundColor: 'rgb(23, 43, 208, 0.2)',
            borderColor: 'rgb(23, 43, 208)',
            data: (function () {
              let current = [];
              current.push(totalGoals / playerCount);
              current.push(totalAssists / playerCount);
              current.push(totalPoints / playerCount);
              current.push(totalGoals / playerCount / gamesPlayed);
              current.push(totalAssists / playerCount / gamesPlayed);
              current.push(totalPoints / playerCount / gamesPlayed);
              return current;
            })()
          }
        ]
      }
    });
  }
}

const http = new XMLHttpRequest();

http.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const allData = JSON.parse(this.responseText);
    playerData = allData.player_data;
    gamesPlayed = allData.games_played;
    playerCount = allData.player_count;
    findTotals();
    getLeaders();
    setupTabs();
    radarSetup();
    tableSetup();
    graphSetup();
  }
};
http.open('GET', 'player_stats.json');
http.send();
