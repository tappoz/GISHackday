# LDAs choropleth map

This project shows a choropleth map of England break down by Local District Authorities using D3.js as the mapping framework. 
When the mouse hover on a LDA a tooltip shows up with aggregated information about that LDA.

# Run the code

## JS dependencies

The frontend javascript dependencies are managed with bower. To install it you need node.js, then you can run:

- `npm install -g bower`
- `bower install` to install the dependencies (cfr. the file `bower.json`)

## Runtime

You can run the project using python serving the static HTML / javascript with:
```
python -m SimpleHTTPServer 8888
```
then visiting: `http://localhost:8000/englishLDAs.html`
