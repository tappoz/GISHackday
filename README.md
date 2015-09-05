# Earth paths visualised

This project comes from a one day GIS hackathon I've been at in September 2015.
It uses the ArcGIS ESRI API to plot on a 3D earth representation a path that could be an aircraft path with points.
It shows also a point, near the path, representing a potential thunderstorm.
The idea was to provide information regarding air proximity with meteorological events like thunderstorms.
It could be also used in realtime getting the coordinates from the Inmarsat API.

The code is written in javascript. 
The coordinates/earth spatial reference is WGS84 (World Geodetic System). 

# Run the code

You can run the project using python serving the static HTML / javascript with:
```
python -m SimpleHTTPServer 8888
```
then visiting: ``http://localhost:8888/web_app.html`

After loading the page you should see:
![ESRI 3D example 1](/doc/2015-09-05_18:47:39_Simple3DMap-GoogleChrome.png)

The API from ESRI is pretty cool (still in beta at the time of writing), as a 3D earth you could zoom out and see the earth shape:
![ESRI 3D example 2](/doc/2015-09-05_18:49:04_Simple3DMap-GoogleChrome.png)
