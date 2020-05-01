import csv
import sys
import time
from datetime import datetime

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

if len(sys.argv) > 1:
    file = sys.argv[1]
else:
    file = 'earthquake.csv'

if len(sys.argv) > 2:
    out_file = sys.argv[2]
else:
    out_file = '../data/earthquakes.csv'



data = []
with open(file, mode='r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
            header = row
        else:
            if (float(row[header.index('mag')]) >= 4.5):
                data.append(row)
                line_count += 1

for el in data:
    for field in el:
        if field == '':
            i = data.index(el)
            j = el.index(field)
            data[i][j] = 0.0


def mapMagType(mT):
    if mT == "mb":
        return 0
    elif mT == "mwc":
        return 1
    elif mT == "mwb":
        return 2
    elif mT == "ml":
        return 3
    elif mT == "ms":
        return 4
    elif mT == "mwr":
        return 5
    elif mT == "md":
        return 6
    elif mT == "mww":
        return 2
    else:
        return 7


data_for_pca = []
for el in data:
    eq_time = el[header.index('time')]
    pca_time = int(eq_time[0:2]) * 60  +  int(eq_time[3:5])  #hours + minutes
    pca_date = time.mktime(datetime.strptime(el[header.index('date')], "%Y-%m-%d").timetuple())
    data_for_pca.append(
        [float(el[header.index('latitude')]), 
        float(el[header.index('depth')]), 
        float(el[header.index('mag')]),
        #float(el[header.index('nst')]),
        float(el[header.index('rms')]),
        pca_time, 
        pca_date]
        )
scaled_data_for_pca = StandardScaler().fit_transform(data_for_pca)
pca = PCA(n_components=2)
principalComponents = pca.fit_transform(scaled_data_for_pca)
max_x, max_y, min_x, min_y = None, None, None, None
first_iteration = True
for component in principalComponents:
    if first_iteration:
        min_x = component[0]
        min_y = component[1]
        first_iteration = False
    else:
        if component[0] < min_x:
            min_x = component[0]
        if component[1] < min_y:
            min_y = component[1]

for component in principalComponents:
    component[0] = component[0] + abs(min_x)
    component[1] = component[1] + abs(min_y)
    
with open(out_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    lenComponents = len(principalComponents)
    index = 0
    for el in data:
        if (el[header.index('place')] != "Egypt" and el[header.index('place')] != "North Atlantic Ocean" and el[header.index('place')] != "Lebanon"):
            if index == 0:
                header.extend(["PCA_component1", "PCA_component2"])
                writer.writerow(header)
            el.extend(principalComponents[index])
            writer.writerow(el)
            index += 1
