import os, time, shutil

path = 'web\\src\\assets\\download'
for file in os.listdir(path):
    name = file.split('.')[0]
    if time.time() - float(name) > 86400:
        os.remove(os.path.join(path, file))

path = 'fits'
for folder in os.listdir(path):
    mod_date = os.stat(os.path.join(path, folder)).st_mtime
    if(time.time() - mod_date > 86400):
        shutil.rmtree(os.path.join(path, folder))