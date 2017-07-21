# America's Cup 2013 Finale: An animated map

Original data accessible [here](https://drive.google.com/file/d/0B2CUun8QUAMsUDJydWw2YTBzMUE/edit).

The file AC.zip (101 Mo) contains all the data of the 2013 competition. I only used the data of finale between New Zealand and USA (file 130925.zip).
Once unzip the data are located insid ethe "csv" folder. I worked with teh 2 following files:
*20130925130025-NAV-NZL.csv
*20130925130025-NAV-USA.csv

They both have the same structure and contain 24 columns. I only kept 5:
*Secs (column 3 - time in seconds, every 0.2 seconds)
*Lat (column 6 - latitud)
*Lon (column 7 - longitud)
*CourseWindDirection (column 13 - wind direction in degree)
*CourseWindSpeed (column 14 - wind speed in knot)

I save the 2 files under:
*us.csv
*nz.csv

They are accesible [here](https://github.com/pvernier/pvernier.github.io/tree/master/americas_cup/data)

I manually removed a few lines that were not in both files to have exactly the same (number of) lines in both files. 

I transformed the data with PostgreSQL/PostGIS (versions 9.3 y 2.1.1). The SQL query is accessible [here](https://github.com/pvernier/pvernier.github.io/blob/master/americas_cup/data/queries_americas_cup.sql). I am just keeping data every 3 seconds. The results are 2 spatial tables "boat_us" and "boat_nz". They both contain the same 3 columns:
*time: time in seconds since the beginning of the race (warm up included)
*run: percentage of the race done (0% during warm up)
*geog: coordinates of the current location

The table "boat_us" contains 2 more columns:
*wind_dir: wind direction
*wind_speed: wind speed

I only included them in 1 table as I consider them as the same for both boats.

Then with QGIS, I converted the 2 tables as GeoJSON files. Theya re available [here](https://github.com/pvernier/pvernier.github.io/tree/master/americas_cup/resources/layers) (with the floats layer).

