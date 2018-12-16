import json
import requests

data = json.loads(requests.get('https://stat-display.herokuapp.com/player_stats.json').text)

print('How many players are on the team?')
data['player_count'] = int(raw_input())

request_string = json.dumps(data)

update_request = requests.post('https://stat-display.herokuapp.com/update-stats.php?key=6f070951-0da6-4349-ac6f-4b305875a6ab', data=request_string)
print(update_request.status_code)
print(update_request.text)
