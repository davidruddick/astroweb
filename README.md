# Astroweb: An Angular web app for Astronet

![figure41](https://user-images.githubusercontent.com/69145275/181589398-dd0851ef-b1c0-4cba-809f-f60ed819cd92.png)

Code Author
---
David Ruddick: [@davidruddick](https://github.com/davidruddick)

Background
---
This project is part of a Computer Science BSc(Hons) dissertation project through the University of Highlands and Islands (UHI). A web app has been built using the Angular framework, and a server to host Astronet models has been built in Python (with Flask).

References
---
Kepler model [exoplanet-ml](https://github.com/google-research/exoplanet-ml/blob/master/exoplanet-ml/astronet/README.md)

K2 model [models_k2](https://github.com/aedattilo/models_K2/blob/master/README.md)

TESS model [astronet-triage](https://github.com/yuliang419/Astronet-Triage/blob/master/README.md)

TESS fork (adding compatability with fits data) [astronetTESS](https://github.com/B1ack2un/AstronetTESS/blob/main/README.md)

---

## Walkthrough

Dependencies
---
 - Python 3.7 (Available [here](https://www.python.org/downloads/release/python-379/))
   - Tensorflow 1.15
   - Tensorboard 1.15.0
   - Tensorflow-estimator 1.15.1
   - Tensorflow-gpu 1.15.0
   - Tensorflow-probability 0.8.0
   - Pandas 1.3.4
   - Numpy 1.21.4
   - Astropy 4.3.1
   - Pdyl 0.7.0
   - Statsmodels 0.13.2
   - Flask 2.0.3
   - Flask-jsonpify 1.5.0
   - Flask-sqlalchemy 2.5.1
   - Flask-restful 0.3.9
   - Flask-cors 3.0.10
   - Wget 3.2
- Node.JS 17.5 (LTS 16.16.0 should also work. Available [here](https://nodejs.org/en/download/))
  - Angular/cli 13.2.4
- CUDA 10.0 (Available [here](https://developer.nvidia.com/cuda-10.0-download-archive))
- Cudnn 9.2 (Available [here](https://developer.nvidia.com/cudnn). Requires registeration (free))

#### Notes:
- The PYTHONPATH environment variable must be set to the Astronet directory. For example "D:\Astroweb\Astronet".
- Astroweb.py calls Python 3.7 (line 72) with PyLauncher using `py -3.7 `. You may need to adjust this command depending on how Python is installed on your machine.
- All Python modules are installed using pip. Ie `py -3.7 -m pip install tensorflow==1.15`.
- Angular is installed using `npm install -g @angular/cli`.


Using a pre-trained model
---
Pre-trained model available [here](https://drive.google.com/file/d/1dd6c3P1OWykrQgn2quQS7eV1S0qv_qAk/view?usp=sharing).
Extract the files to ..\astroweb\astronet\kepler\astronet\model (overwrite if neccessary).

Training a model
---
1. Open PowerShell and navigate to ..\astroweb\astronet\kepler\astronet
2. `py -3.7 train.py --model=AstroCNNModel --config-name=local_global --train_files=train/train* --eval_files=train/val* --model_dir=model`

Hosting
---
Note: I use Windows Terminal for this so I can tile multiple PowerShell instances in one window. But each to their own...
1. Open PowerShell and navigate to ..\astroweb
2. Run `serv.ps1`
3. Open new PowerShell instance (as Administrator) and navigate to ..\astroweb\web
4. Run `ng serve`. This will take some time initially as it installs the neccessary Node packages.
5. Once running, open a browser and navigate to http://localhost:4200.

Instructions on how to use the application are included in the "help" menu.
