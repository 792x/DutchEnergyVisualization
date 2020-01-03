import pandas as pd
import os

# Read the files into two dataframes.

for filename in os.listdir('./data/dutch_energy_extended/Gas'):
    print('Processing: ' + filename)

    df1 = pd.read_csv('./data/dutch_energy_extended/Gas/' + filename, error_bad_lines=False, delimiter=',')

    if '2019' in filename:
        year = 2019
    elif '2018' in filename:
         year = 2018
    elif '2017' in filename:
         year = 2017
    elif '2016' in filename:
         year = 2016
    elif '2015' in filename:
         year = 2015
    elif '2014' in filename:
         year = 2014
    elif '2013' in filename:
         year = 2013
    elif '2012' in filename:
         year = 2012
    elif '2011' in filename:
         year = 2011
    elif '2010' in filename:
         year = 2010
    
    df1.insert(0, "year", year)


    newname = filename.replace('.csv', '_updated.csv')

    # Write it to a new CSV file
    df1.to_csv(newname, index=False)


print('finished! :)')