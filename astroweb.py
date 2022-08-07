import os, time, math, subprocess, shutil, csv


def download_fits(mission, id, sector=None):

    fits_dir = os.path.join(os.getcwd(), "fits", id) # where the fits files will be downloaded to
    img_dir = os.path.join(os.getcwd(), "web\\src\\assets\\download\\" + str(math.floor(time.time())) + ".png")
    os.makedirs(fits_dir, exist_ok = True)
    
    # use mission and id to create a wget command, and execute it in a subprocess
    # fits data is available from archive.stsci.edu
    if mission == "kepler":
        url = "http://archive.stsci.edu/pub/kepler/lightcurves/" + id[0:4] + "/" + id
        command = "wget -nH --cut-dirs=6 -r -l0 -c -N -np -erobots=off -R 'index*' -A _llc.fits -P " \
            + fits_dir + " " + url + "/"
        subprocess.run(command, shell=True, check=True)


    # slightly funkier logic. id and corresponding url path found in a prebuilt manifest
    # manifest is built from sha256 files available from archive.stsci.edu
    if mission == "k2":
        with open(os.path.join(os.getcwd(), "Astronet\\k2\\manifest\\manifest.csv")) as manifest:
            reader = csv.reader(manifest, delimiter=',')
            for row in reader:
                if row[0] == id:
                    path = row[1]
                    url = "http://archive.stsci.edu/pub/k2/lightcurves/" + path
                    command = "wget -nH --cut-dirs=6 -r -l0 -c -N -np -erobots=off -R 'index*' -A *" \
                        + id + "* -P " + fits_dir + " " + url + "/"
                    subprocess.run(command, shell=True, check=True)

    # even funkier logic. indices for entire sectors available from archive.stsci.edu.
    # download index, look for id and url path to build the wget command
    if mission == "tess":
        url = "https://archive.stsci.edu/missions/tess/download_scripts/sector/tesscurl_sector_" \
            + sector + "_lc.sh"
        command = "wget -O " + os.path.join(fits_dir, "index.sh") + " " + url
        subprocess.run(command, shell=True, check=True)

        index = open(os.path.join(fits_dir, "index.sh"))
        lines = index.readlines()
        for line in lines:
            if id in line:
                values = line.split(" ")
                values[5] = fits_dir + "\\tess" + id + ".fits"
                new_command = " ".join(values)
                print(new_command)
                subprocess.run(new_command, shell=True, check=True)
                index.close()

    return fits_dir, img_dir

# construct astronet command
def build_command(mission, id, period, duration, t0, fits_dir, img_dir):
    telescope = mission
    if telescope == "k2":
        telescope = "kepler"
    args = {
        "model" : "AstroCNNModel",
        "config_name" : "local_global",
        "model_dir" : os.path.join(os.getcwd(), "Astronet", mission, "Astronet\\model"),
        telescope + "_data_dir" : fits_dir,
        telescope + "_id" : id,
        "period" : period,
        "duration" : duration,
        "t0" : t0,
        "output_image_file" : img_dir
    }

    # returns a literal powershell command to run astronet with the specified parameters
    # this requires python 3.7 to be installed and added to PATH
    command = "py -3.7 " + os.path.join(os.getcwd(), "Astronet", mission, "Astronet\\predict.py") + " " + " ".join('--{}={}'.format(k,v) for k,v in args.items()), img_dir.split("\\")[-1]
    print(command)
    return command        

# execute final command in a subprocess
# capture the STOUT and parse the prediction value
def run_command(command):
    print("Making prediction...")
    prediction = str(round(float(str((subprocess.run(command, shell=True, check=True, capture_output=True).stdout)).split(" ")[1][:-5])*100, 2)) + "%"
    print(prediction)
    return prediction


# clean up. note, this will fail if server.py isn't run as administrator
def tidy(fits_dir):

    # delete fits dir
    shutil.rmtree(fits_dir)

    # delete any old fits dirs that may not have been tidied properly
    path = 'fits'
    for folder in os.listdir(path):
        mod_date = os.stat(os.path.join(path, folder)).st_mtime
        if(time.time() - mod_date > 86400):
            shutil.rmtree(os.path.join(path, folder))

    # delete images from download folder if older than 1 day
    path = 'web\\src\\assets\\download'
    for file in os.listdir(path):
        name = file.split('.')[0]
        if time.time() - float(name) > 86400:
            os.remove(os.path.join(path, file))

