import pandas as pd
import os

# Read the files into two dataframes.

for filename in os.listdir('./data/dutch_energy/Electricity'):
    print('Processing: ' + filename);

    df1 = pd.read_csv('./data/dutch_energy/Electricity/' + filename, error_bad_lines=False, delimiter=',')
    df2 = pd.read_csv('./data/vertaaltabel.csv', error_bad_lines=False, delimiter=',')
    df2.drop(df2.filter(regex="Huisnummer"),axis=1, inplace=True)
    df2.drop(df2.filter(regex="Unname"),axis=1, inplace=True)
    newname = filename.replace('.csv', '_final.csv')

    # Merge the two dataframes, using a column as key
    df3 = pd.merge(df1, df2, on = 'zipcode_from')

    # Drop duplicates
    df4 = df3.drop_duplicates(subset=None, keep="first", inplace=False)
    # Write it to a new CSV file
    df4.to_csv(newname, index=False)


print('finished! :)')