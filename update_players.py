from json import dumps, loads
from requests import post, get

# get update stats key
UPDATE_KEY = json.loads(open('../update_key.json').read())['key']

data = loads(get('https://stat-display.herokuapp.com/player_stats.json').text)

print('How many players are on the team?')
data['player_count'] = int(raw_input())

request_string = dumps(data)

update_request = post('https://stat-display.herokuapp.com/update-stats.php?key=' + UPDATE_KEY, data=request_string)
print(update_request.status_code)
print(update_request.text)
