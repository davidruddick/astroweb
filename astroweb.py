import os, subprocess, shutil, csv


def download_fits(mission, id, sector=None):

    # create wget commands based on mission and id.
    # fits data is available from archive.stsci.edu.
    #test

    fits_dir = os.path.join(os.getcwd(), "Astronet", mission, "Astronet\\fits\\" + id) # where the fits files will be downloaded to
    
    if mission == "kepler":
        url = "http://archive.stsci.edu/pub/kepler/lightcurves/" + id[0:4] + "/" + id
        command = "wget -nH --cut-dirs=6 -r -l0 -c -N -np -erobots=off -R 'index*' -A _llc.fits -P " + fits_dir + " " + url + "/"
        subprocess.run(command, shell=True, check=True)

    if mission == "k2":
        with open(os.path.join(os.getcwd(), "Astronet\\k2\\manifest\\manifest.csv")) as manifest:
            reader = csv.reader(manifest, delimiter=',')
            for row in reader:
                if row[0] == id:
                    path = row[1]
                    url = "http://archive.stsci.edu/pub/k2/lightcurves/" + path
                    command = "wget -nH --cut-dirs=6 -r -l0 -c -N -np -erobots=off -R 'index*' -A *" + id + "* -P " + fits_dir + " " + url + "/"
                    subprocess.run(command, shell=True, check=True)

    if mission == "tess":
        os.makedirs(fits_dir, exist_ok = True)
        url = "https://archive.stsci.edu/missions/tess/download_scripts/sector/tesscurl_sector_" + sector + "_lc.sh"
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

    return fits_dir


def build_command(mission, id, period, duration, t0, fits_dir):
    telescope = mission
    if telescope == "k2":
        telescope = "kepler"
    img = os.path.join(os.getcwd(), "images\\" + id + ".png")
    args = {
        "model" : "AstroCNNModel",
        "config_name" : "local_global",
        "model_dir" : os.path.join(os.getcwd(), "Astronet", mission, "Astronet\\model"),
        telescope + "_data_dir" : fits_dir,
        telescope + "_id" : id,
        "period" : period,
        "duration" : duration,
        "t0" : t0,
        "output_image_file" : img
    }

    return "py -3.7 " + os.path.join(os.getcwd(), "Astronet", mission, "Astronet\\predict.py") + " " + " ".join('--{}={}'.format(k,v) for k,v in args.items()), img
            

def run_command(command):
    print("Making prediction...")
    return str(round(float(str((subprocess.run(command, shell=True, check=True, capture_output=True).stdout)).split(" ")[1][:-5])*100, 2)) + "%"


def tidy(fits_dir):
    shutil.rmtree(os.path.join(fits_dir))  
