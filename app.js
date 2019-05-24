const data = require('./data.json')

const colors = {
  conflict: [
    'rgb',
    255,
    142,
    0
  ],
  'post-conflict': [
    'rgb',
    255,
    0,
    139
  ],
  other: [
    'rgb',
    113,
    1,
    149
  ]
}

fetch(
  window.confirm('Are you using TabularMaps?')
    ? 'https://tabularmaps.github.io/8bit-tile/style.json'
    : 'https://un-vector-tile-toolkit.github.io/tentatiles/style.json'
).then((response) => response.json()).then(style => {
  for (let layer of style.layers) {
    if (layer.id === 'bnda') {
      layer.paint['fill-color'] = [
        'match',
        ['get', 'iso3cd'],
        data.conflict,
        colors.conflict,
        data['post-conflict'],
        colors['post-conflict'],
        data.other,
        colors.other,
        ['rgb', 250, 250, 250]
      ]
      console.log(layer.paint['fill-color'])
    }
  }
  const map = new mapboxgl.Map({
    container: 'map',
    maxZoom: 2,
    style: style,
    attributionControl: true,
    hash: true
  })

  map.on('load', () => {
    map.addControl(new mapboxgl.NavigationControl())

  })
})
