print('How many games have been played?')
games_played = raw_input()
print('How many players are on the team?')
player_count = raw_input()

print('Beginning imports')

import os
import json

print('Importing requests')
import requests
print('Requests imported')

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow

# The CLIENT_SECRETS_FILE variable specifies the name of a file that contains
# the OAuth 2.0 information for this application, including its client_id and
# client_secret.
CLIENT_SECRETS_FILE = "../client_secret.json"
SECRET_DATA = json.loads(open(CLIENT_SECRETS_FILE).read())['installed']

# Get refresh tokens for OAuth
OAUTH_TOKENS_FILE = '../oauth.json'
OAUTH_TOKENS = json.loads(open(OAUTH_TOKENS_FILE).read())

# get update stats key
UPDATE_KEY = json.loads(open('../update_key.json').read())['key']

# This OAuth 2.0 access scope allows for full read/write access to the
# authenticated user's account and requires requests to use an SSL connection.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
API_SERVICE_NAME = 'sheets'
API_VERSION = 'v4'

# Spreadsheet data
spreadsheet_id = '14rF_MvfDqSpk5C_lifOZqlOjvmdrJkxM4K2RgNaErB4'

def get_authenticated_service():
    print('Getting Google service')
    g_credentials = Credentials(
        OAUTH_TOKENS['token'],
        refresh_token = OAUTH_TOKENS['refresh_token'],
        token_uri = SECRET_DATA['token_uri'],
        client_id = SECRET_DATA['client_id'],
        client_secret = SECRET_DATA['client_secret']
    )
    return build(API_SERVICE_NAME, API_VERSION, credentials = g_credentials)

def get_player_data(service):
    current_row = 2
    player_data = []
    print('Getting data')
    while True:
        print('Iteration #' + str(current_row - 1))
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range='Sheet1!' + str(current_row) + ':' + str(current_row)).execute()
        print('Row received')
        numRows = result.get('values') if result.get('values') is not None else None
        if numRows:
            row = result['values'][0]
            player_data.append({
                'playerName': row[0],
                'goals': int(row[1]),
                'assists': int(row[2]),
                'points': int(row[3])
            })
            current_row += 1
        else:
            break
    return player_data


if __name__ == '__main__':
    # When running locally, disable OAuthlib's HTTPs verification. When
    # running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    service = get_authenticated_service()

    data = json.loads(requests.get('https://stat-display.herokuapp.com/player_stats.json').text)
    data['player_data'] = get_player_data(service)
    data['player_count'] = player_count
    data['games_played'] = games_played
    request_string = json.dumps(data)

    print('Sending request')
    update_request = requests.post('https://stat-display.herokuapp.com/update-stats.php?key=' + UPDATE_KEY, data=request_string)
    print('Reponse code:')
    print(update_request.status_code)
    print('=' * 20)
    print('Response:')
    print(update_request.text)
