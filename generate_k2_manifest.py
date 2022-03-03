import os, re, csv

stars = []
dir = os.path.join(os.getcwd(), "Astronet\\k2\\manifest")


for file in os.listdir(dir):
    if file.endswith(".sha256"):
        text_file = open(os.path.join(dir, file))
        lines = text_file.readlines()
        for line in lines:
            values = re.split(' |/|-', line)
            path = values[2] + "/" + values[3] + "/" + values[4]
            id = values[5][4:]
            star = [id, path]
            stars.append(star)

print(stars)


with open(os.path.join(dir, 'manifest.csv'), 'w', newline='') as csv_file:
    writer = csv.writer(csv_file, delimiter=',')
    writer.writerows(stars)