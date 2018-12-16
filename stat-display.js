const http = new XMLHttpRequest();

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

function buildPage () {
  const statsContainer = document.getElementById('statsContainer');
  for (let i = 0; i < playerData.length; i++) {
    if (i % 3 === 0) {
      statsContainer.innerHTML += '<div class="w3-row">';
    }
    statsContainer.innerHTML += '<div class="w3-col l4 m12">' +
          '<h4 class="w3-center">' + playerData[i].playerName + '</h4>' +
          '<canvas class="playerDisplay"></canvas>' +
        '</div>';
    if ((i + 1) % 3 === 0) {
      statsContainer.innerHTML += '</div>'
    }
  }
  const playerDisplays = document.getElementsByClassName('playerDisplay');
  for (let i = 0; i < playerData.length; i++) {
    let ctx = playerDisplays[i].getContext('2d');
    let playerChart = new Chart(ctx, {
      type: 'radar',
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

http.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const allData = JSON.parse(this.responseText);
    playerData = allData.player_data;
    gamesPlayed = allData.games_played;
    playerCount = allData.player_count;
    findTotals();
    buildPage();
  }
};
http.open('GET', 'player_stats.json');
http.send();
