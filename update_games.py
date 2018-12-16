from json import loads, dumps
from requests import post, get

# get update stats key
UPDATE_KEY = json.loads(open('../update_key.json').read())['key']

data = loads(get('https://stat-display.herokuapp.com/player_stats.json').text)

print('How many games have been played?')
data['games_played'] = int(raw_input())

request_string = dumps(data)

update_request = post('https://stat-display.herokuapp.com/update-stats.php?key=' + UPDATE_KEY, data=request_string)
print(update_request.status_code)
print(update_request.text)
