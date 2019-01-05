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
spreadsheet_id = '1oF3lCVupGU_zSNX2gZv2IeeDQ05r3ttxFPyx5VYpT9Y'

def isfloat(x):
    try:
        a = float(x)
    except ValueError:
        return False
    else:
        return True

def isint(x):
    try:
        a = float(x)
        b = int(a)
    except ValueError:
        return False
    else:
        return a == b


def get_sheets(service, spreadsheet_id):
    # Get names of spreadsheets
    sheets = []

    request = service.spreadsheets().get(
        spreadsheetId = spreadsheet_id
    )
    response = request.execute()
    for sheet in response['sheets']:
        sheets.append(sheet['properties']['title'])
    return sheets


def get_all_data(service, sheets):
    get_letter = lambda x: chr(ord('a') + x).upper()
    all_data = {}
    for sheet in sheets:
        current_row = 1
        current_data = {}
        if sheet[0] == '@' or sheet[0] == 'v':
            pass
        elif sheet == 'Record' :
            pass
        else:
            # first get column names
            current_dataset = []
            column_names = []
            current_column = 0
            while True:
                current_cell = get_letter(current_column) + str(current_row)
                print('Getting cell ' + current_cell)
                result = service.spreadsheets().values().get(
                    spreadsheetId=spreadsheet_id,
                    range=sheet + '!' + current_cell + ':' + current_cell).execute()
                print('Cell received')
                data_present = result.get('values') if result.get('values') is not None else None
                if data_present:
                    column_names.append(result['values'][0][0])
                    current_column += 1
                else:
                    current_row += 1
                    break

            while True:
                print('Getting row ' + str(current_row))
                result = service.spreadsheets().values().get(
                    spreadsheetId=spreadsheet_id,
                    range=sheet + '!' + str(current_row) + ':' + str(current_row)).execute()
                print('Row received')
                data_present = result.get('values') if result.get('values') is not None else None
                if data_present:
                    current_player = {}
                    for i in range(len(column_names)):
                        if isint(result['values'][0][i]):
                            current_player[column_names[i]] = int(result['values'][0][i])
                        elif isfloat(result['values'][0][i]):
                            current_player[column_names[i]] = float(result['values'][0][i])
                        else:
                            current_player[column_names[i]] = result['values'][0][i]
                    current_dataset.append(current_player)
                    current_row += 1
                else:
                    break
            all_data[sheet] = current_dataset
    return all_data


def get_data(service, spreadsheet_id, sheet_name, start_row):
    get_letter = lambda x: chr(ord('a') + x).upper()
    current_row = start_row
    all_data = []
    # First get column names
    column_names = []
    current_column = 0
    while True:
        current_cell = get_letter(current_column) + str(current_row)
        print('Getting cell ' + current_cell)
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=sheet_name + '!' + current_cell + ':' + current_cell).execute()

        print('Cell received')
        data_present = result.get('values') if result.get('values') is not None else None
        if data_present:
            column_names.append(result['values'][0][0])
            current_column += 1
        else:
            current_row += 1
            break

    while True:
        print('Getting row ' + str(current_row))
        result = service.spreadsheets().values().get(
            spreadsheetId=spreadsheet_id,
            range=sheet_name + '!' + str(current_row) + ':' + str(current_row)).execute()
        data_present = result.get('values') if result.get('values') is not None else None
        if data_present:
            current_player = {}
            for i in range(len(column_names)):
                current_player[column_names[i]] = result['values'][0][i]
            all_data.append(current_player)
            current_row += 1
        else:
            break
    return all_data


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
            range='goalsandassists!' + str(current_row) + ':' + str(current_row)).execute()
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

    print('How many games have been played?')
    games_played = int(input())
    print('How many players are on the team?')
    player_count = int(input())

    service = get_authenticated_service()

    data = json.loads(requests.get('https://stat-display.herokuapp.com/player_stats.json').text)
    data['data_sets'] = get_all_data(service, get_sheets(service, spreadsheet_id))
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
