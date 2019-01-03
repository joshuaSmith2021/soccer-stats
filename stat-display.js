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

function makeTable (targetId, name, data, cols) {
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
  
  for (let i = 0; i < data.length; i++) {
    let current = document.createElement('TR');
    for (let j = 0; j < cols.length; j++) {
      let cell = document.createElement('TD');
      cell.appendChild(document.createTextNode(data[i][cols[j]]));
      current.appendChild(cell);
    }
    tbody.appendChild(current);
  }
  table.appendChild(tbody);
  
  // Call this last, it adds the table to the document
  document.getElementById(targetId).appendChild(title);
  document.getElementById(targetId).appendChild(table);
}

const http = new XMLHttpRequest();

http.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const allData = JSON.parse(this.responseText).data_sets;
    setupTabs();
    makeTable('tableviewSection', 'Goals and Assists', allData['Goals and Assists'], ['Player', 'Goals', 'Assists', 'Points', 'Goals per Game', 'Assists per Game', 'Points per Game']);
    document.getElementById('tableviewSection').innerHTML += '<hr/>';
    makeTable('tableviewSection', 'Goalkeeping', allData.Goalkeeping, ['Player', 'Minutes', 'Shots faced', 'Goals allowed', 'GAA']);
  }
};
http.open('GET', 'player_stats.json');
http.send();
