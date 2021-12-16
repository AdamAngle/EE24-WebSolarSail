from astroquery.jplhorizons import Horizons
from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route('/get_orbit_data/<int:id>')
def index(id):
    """
    Get data from JPL Horizons
    """
    # Get data from JPL Horizons
    eph = dict(Horizons(id).ephemerides())


    # Return data
    return jsonify(eph)

app.run()