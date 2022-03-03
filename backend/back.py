#Imports
import requests
import json
import flask
from flask import request, jsonify
from datetime import datetime
import dateutil.relativedelta

app = flask.Flask(__name__)
app.config["DEBUG"] = True
today = datetime.today().strftime('%Y-%m-%d')
past = datetime.now() + dateutil.relativedelta.relativedelta(months=-6)
lastM = datetime.today().strftime('%Y-%m-%d')
past = past.strftime('%Y-%m-%d')
latitude = 0
longitude = 0

#Aceita GET, retorna dados do ultimo mês no brasil.
@app.route('/lastMonth', methods=['GET'])

def lastMonth():
    req = requests.get('https://api.covid19api.com/country/brazil?from='+lastM+'T00:00:00Z&to='+today+'T00:00:00Z')
    json_response = json.loads(req.content)
    response = app.response_class(
        response=json.dumps(json_response),
        status=200,
        mimetype='application/json'
    )
    for val in json_response:
        print(val['Deaths'])
    return response

#Aceita GET, retorna ultimos seis mêses no brasil
@app.route('/', methods=['GET'])

def main():
    req = requests.get('https://api.covid19api.com/country/brazil?from='+past+'T00:00:00Z&to='+today+'T00:00:00Z')
    json_response = json.loads(req.content)
    response = app.response_class(
        response=json.dumps(json_response),
        status=200,
        mimetype='application/json'
    )
    return response

#Aceita POST, retorna JSON enviado pelo front-end e salva dados em arquivo.
@app.route('/post', methods=['POST'])

def post():
    data = {}
    data['localization'] = []
    lat = request.args.get('lat')
    long = request.args.get('long')
    data['localization'].append({
    'lat': lat,
    'long': long,
    'when': datetime.today().strftime('%Y-%m-%d-%H:%M:%S'),
    'lasMonth' : [request.get_json()]
    })
    response = app.response_class(
        response=json.dumps(request.get_json()),
        status=200,
        mimetype='application/json'
    )    
    with open('data.json', 'w') as outfile:
        json.dump(data, outfile, indent=4, sort_keys=True)  
    return response
    #print(json_response)

if __name__ == '__main__':
    main()



app.run()