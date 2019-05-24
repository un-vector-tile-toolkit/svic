var style = window.confirm('Are you using TabularMaps?') ? 
  'https://tabularmaps.github.io/8bit-tile/style.json' :
  'https://un-vector-tile-toolkit.github.io/tentatiles/style.json'
  
map = new mapboxgl.Map({
  container: 'map', maxZoom: 2,
  style: style, 
  attributionControl: true, hash: true
})

map.on('load', function() {
  map.addControl(new mapboxgl.NavigationControl())
})
