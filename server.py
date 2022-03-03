from flask import Flask, jsonify, request
from flask_cors import CORS
from astroweb import download_fits, build_command, run_command, tidy


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def get_prediction():
    data = request.args
    if "sector" in data:
        fits_dir = download_fits(data["mission"], data["id"], data["sector"])
    else:
        fits_dir = download_fits(data["mission"], data["id"])

    command, img = build_command(data["mission"], data["id"], data["period"], data["duration"], data["t0"], fits_dir)
    prediction = run_command(command)
    tidy(fits_dir)
    return jsonify({"prediction" : prediction, "image" : img})

if __name__ == '__main__':
     app.run(port=4201)