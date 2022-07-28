wget -nH --cut-dirs=6 -r -l0 -c -N -np -erobots=off -R 'index*' -A _llc.fits -P fits \
http://archive.stsci.edu/pub/kepler/lightcurves/0114/011442793/

py -3.7 .\predict.py \
--model=AstroCNNModel \
--config_name=local_global \
--model_dir=model \
--kepler_data_dir=fits \
--kepler_id=011442793 \
--period=14.44912 \
--t0=2.2 --duration=0.11267 \
--output_image_file=kepler90i.png