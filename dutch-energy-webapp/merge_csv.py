import pandas as pd

# Read the files into two dataframes.
df1 = pd.read_csv('./merged2.csv', error_bad_lines=False, delimiter=',')
df2 = pd.read_csv('./testinput/buurt2019.csv', error_bad_lines=False, delimiter=';')

# Merge the two dataframes, using a column as key
df3 = pd.merge(df1, df2, on = 'Buurt2019')

# Write it to a new CSV file
df3.to_csv('finalmerged.csv')

print('finished! :)')