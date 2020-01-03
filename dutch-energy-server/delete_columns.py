import pandas as pd
import os

# Remove unnamed columns leftover after merge

for filename in os.listdir('./data/dutch_energy_extended/Electricity'):
    print('Processing: ' + filename);

    # Remove columns without name
    df1 = pd.read_csv('./data/dutch_energy_extended/Electricity/' + filename, error_bad_lines=False, delimiter=',', index_col=[0])
    df1.drop(df1.filter(regex="Unname"),axis=1, inplace=True)
    
    newname = filename.replace('.csv', '_fixed.csv')

    # Write it to a new CSV file
    df1.to_csv(newname, index=False)

print('finished! :)')

