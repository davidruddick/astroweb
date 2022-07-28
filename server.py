from flask import Flask, jsonify, request
from flask_cors import CORS
from astroweb import download_fits, build_command, run_command, tidy


app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:4200"}}) # allow HTTP requests from front-end only


@app.route("/", methods=['GET', 'POST'])
def get_prediction():

    data = request.args

    # Download the fits data and build the Astronet command
    try:
        if "sector" in data:
            fits_dir, img_dir = download_fits(data["mission"], data["id"], data["sector"])
        else:
            fits_dir, img_dir = download_fits(data["mission"], data["id"])
        command, img = build_command(\
            data["mission"], data["id"], data["period"], data["duration"], data["t0"], fits_dir, img_dir)
    except:
        raise Exception("DOWNLOAD_ERROR")

    # Using the downloaded fits data, test the given parameters with Astronet
    try:
        prediction = run_command(command)
    except:
        raise Exception("PREDICT_ERROR")

    # Cleanup fits data, but continue anyway if it fails
    try:
        tidy(fits_dir)
    except:
        print("Unable to cleanup fits data")
        pass

    # return the result in JSON
    return jsonify({"prediction" : prediction, "image" : img})


@app.errorhandler(Exception)
def not_found(error):
    if str(error) == "DOWNLOAD_ERROR":
        return "Error downloading fits data for given ID", 1
    if str(error) == "PREDICT_ERROR":
        return "Error while processing data with Astronet model", 2
    return "An unknown error has occurred", 0


if __name__ == '__main__':
     app.run()