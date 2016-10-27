# HACK4NO 2016 - "Journalistkurs"

Dette repoet inneholder eksempelkode for journalistkurs om "3d kart" og "statistikk i kart" under Hack4no 2016.

## Oppstart
-1. Klon prosjektet med git (bash)
0. Sørg for å ha node og npm installert
1. npm install
2. npm run dev-server
3. Åpne http://localhost:8080 i en nettleser


## Innhold

- http://localhost:8080/wxs.html Eksempelkode med WXS3Map
- http://localhost:8080/cesium.html Eksempelkode med Cesium.js
- http://localhost:8080/leaflet-flickr.html Eksempelkode Leaflet og GeoJSON fra Flickr-API
- http://localhost:8080/leaflet-carto.html Eksempelkode Leaflet med kart fra Carto(db)
- http://localhost:8080/d3.html Eksempelkode d3js med topojson og data fra SSB

## Kode

De forskjellige demoene ligger i

- src/wxs.js
- src/cesium
- src/leaflet-flickr
- src/leaflet-carto
- src/d3

Samt noen util-funksjoner i utils/

- convert_gpx.js: Konverter gpx-spor til GeoJSON
- parse_kommuner.js: Parse kommunedata (SOSI) til GeoJSON (og topojson med magi)
- parse_valgkretser.
