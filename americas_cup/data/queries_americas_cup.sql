-- 1) Create and import data
CREATE TABLE data.data_us
 (
  secs NUMERIC(6, 1),
  lat NUMERIC,
  long NUMERIC,
  wind_dir NUMERIC,
  wind_speed NUMERIC
 );
COPY data.data_us FROM 'C:\path\us.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE data.data_nz
 (
 secs NUMERIC(6, 1),
 time time,
 lat NUMERIC,
 long NUMERIC,
 wind_dir NUMERIC,
 wind_speed NUMERIC
 );

COPY data.data_nz FROM 'C:\path\NZ.csv' DELIMITER ',' CSV HEADER;

-- 2) Add and fill in the 'section' column
ALTER TABLE data.data_us add column section varchar;
-- Race starts at 13:15:00 so before that time it's warm up
UPDATE data.data_us SET section = 'warm up' WHERE secs <= 47699.800;
UPDATE data.data_us SET section = 'race' WHERE secs > 47699.800;
-- US finishes race at 13:38:24.077 which is = to 49104.000
UPDATE data.data_us SET section = 'finish' WHERE secs > 49104.000;

ALTER TABLE data.data_nz add column section varchar;
-- Race starts at 13:15:00 so before that time it's warm up
UPDATE data.data_nz SET section = 'warm up' WHERE secs <= 47699.800;
UPDATE data.data_nz SET section = 'race' WHERE secs > 47699.800;
-- NZ finishes race at 13:39:08.271 which is = to 49148.2
UPDATE data.data_nz SET section = 'finish' WHERE secs > 49148.2;

-- 3) Create the final tables to convert later to GeoJSON format
-- US boat
CREATE TABLE  data.boat_us AS (
 SELECT secs::INTEGER - 46833 as time, (cumul/22106.229818404 * 100)::NUMERIC(5, 2) AS run, wind_dir, wind_speed, geog
  FROM (
   SELECT secs, wind_dir, wind_speed, section, geog, distance, sum(CASE WHEN section='race' THEN  distance ELSE 0 END) OVER (PARTITION BY section ORDER BY secs) AS cumul 
    FROM (
     SELECT secs, wind_dir, wind_speed, section, geog, COALESCE(ST_Distance(geog, geog_before), 0) AS distance
      FROM (
       SELECT secs, wind_dir, wind_speed, section, geog, lag(geog) OVER (ORDER BY secs) AS geog_before
        FROM (
         SELECT secs, wind_dir, wind_speed, section, ST_GeogFromText('POINT(' || long || ' ' || lat || ')') AS geog FROM data.data_us WHERE secs % 3 = 0
        ) SEL_1
      ) SEL_2
    ) SEL_3 ORDER BY secs
  ) SEL_4
);

UPDATE data.boat_us SET run = 100 where time >= 2274;

-- NZ boat
CREATE TABLE  data.boat_nz AS (
	SELECT secs::INTEGER - 46833 as time, (cumul/22766.524924026 * 100)::NUMERIC(5, 2) as run, geog
	FROM (
		SELECT secs, section, geog, distance, sum(case when section='race' then  distance else 0 end) OVER (PARTITION BY section ORDER BY secs) AS cumul 
		FROM (
			SELECT secs, section, geog, COALESCE(ST_Distance(geog, geog_before), 0) AS distance
			 FROM (
			  SELECT secs, section, geog, lag(geog) OVER (ORDER BY secs) AS geog_before
			   FROM (
			    SELECT secs, section, ST_GeogFromText('POINT(' || long || ' ' || lat || ')') AS geog FROM data.data_nz WHERE secs % 3 = 0
			   ) SEL_1
			 ) SEL_2
		) SEL_3 order by secs
	) SEL_4
);

UPDATE data.boat_nz SET run = 100 where time >= 2316;
-- Don't need the 'time' column
ALTER TABLE data.boat_nz DROP COLUMN time;



