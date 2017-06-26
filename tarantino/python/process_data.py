import pandas as pd
import numpy as np 
import json


data = pd.read_csv('tarantino.csv')

movies = ['Reservoir Dogs','Pulp Fiction', 'Jackie Brown',
          'Kill Bill: Vol. 1', 'Kill Bill: Vol. 2',
          'Inglorious Basterds', 'Django Unchained'
          ]

# Convert minutes to integer
data.minutes_in = data.minutes_in.astype(np.int64)

profanities = data[data['type'] == 'word']
deaths = data[data['type'] == 'death']

output_profanities = []
output_deaths = []

for movie in movies:
    sel_profanities = profanities[profanities['movie'] == movie]
    sel_deaths = deaths[deaths['movie'] == movie]
    
    # Profanities
    # Group by minute and get the list of profanities
    gb_w = sel_profanities.groupby('minutes_in')['word'].apply(list)
    df_w = pd.DataFrame(gb_w)
    df_w['minute'] = df_w.index
    df_w = df_w[['minute', 'word']].apply(tuple, axis=1)
    output_profanities.append({'movie': movie.replace(':', '').replace('.', ''), 'data': list(df_w)})

    # Deaths
    # Group by minute and get the number of deaths
    gb_d = sel_deaths.groupby('minutes_in')['type'].count().apply(str)
    df_d = pd.DataFrame(gb_d)
    df_d['minute'] = df_d.index
    df_d = df_d[['minute', 'type']].apply(tuple, axis=1)
    output_deaths.append({'movie': movie.replace(':', '').replace('.', ''), 'data': list(df_d)})

# Save as JSON files
with open('profanities_per_movies.json', 'w') as f:
    f.write(json.dumps(output_profanities))

with open('deaths_per_movies.json', 'w') as f:
    f.write(json.dumps(output_deaths))


