-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE events
ADD COLUMN location geography(Point, 4326);

UPDATE events
SET location = ST_MakePoint(longitude, latitude)::geography
WHERE latitude IS NOT NULL
  AND longitude IS NOT NULL;

CREATE INDEX events_location_gist
ON events
USING GIST (location);
