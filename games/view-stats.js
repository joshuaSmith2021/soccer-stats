var gameList = [];

function buildDropDown (games) {
  const dropdown = document.createElement('SELECT');
  
  const info = document.createElement('OPTION');
  info.appendChild(document.createTextNode('Select Game'));
  info.selected = true;
  info.hidden = true;
  dropdown.appendChild(info);
  
  for (let i = 0; i < games.length; i++) {
    let option = document.createElement('OPTION');
    option.value = games[i];
    option.className += ' gameOption';
    let text = document.createTextNode(games[i]);
    option.appendChild(text);
    dropdown.appendChild(option);
  }
  return dropdown;
}

function viewStats (selected, games) {
  if (selected !== 'Select Game' && games.indexOf(selected) !== -1) {
    location.replace('/game?key=butterfield&gname=' + selected);
  } else if (selected === 'Select Game') {
    alert('Please select a game.');
  } else {
    alert('Invalid game selection');
  }
}

const http = new XMLHttpRequest();

http.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    console.log(this.responseText);
    gameList = JSON.parse(this.responseText);
    const dropdown = buildDropDown(gameList);
    dropdown.className += ' dropdown w3-white';
    dropdown.id = 'selected';
    document.getElementById('dropdown').appendChild(dropdown);
    document.getElementById('loadStats').addEventListener('click', function () {
      viewStats(document.getElementById('selected').value, gameList);
    });
  }
};
http.open('GET', '../games.json');
http.send();