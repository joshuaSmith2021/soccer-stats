print('Beginning imports')

import os
import json

print('Importing requests')
from requests import post
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


if __name__ == '__main__':
    # When running locally, disable OAuthlib's HTTPs verification. When
    # running in production *do not* leave this option enabled.
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    
    service = get_authenticated_service()
    
    # get list of sheets
    sheets = get_sheets(service, spreadsheet_id)
    jsoned = json.dumps(sheets)
    
    update = post('https://stat-display.herokuapp.com/update-games.php?key=' + UPDATE_KEY, data={'json': jsoned})
    print(update.status_code)
    print(update.text)