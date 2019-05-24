const data = require('./data.json')

const lut = {}
for (let k of Object.keys(data)) {
  for (let iso3cd of data[k]) {
    lut[iso3cd] = k
  }
}

const labels = {
  conflict: 'Sexual violence in conflict-affected settings',
  'post-conflict': 'Sexual violence in post-conflict settings',
  other: 'Other situations of concern'
}

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

const overlay = document.getElementById('overlay')
const country = document.getElementById('country')
const description = document.getElementById('description')

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
    }
  }
  const map = new mapboxgl.Map({
    container: 'map',
    maxZoom: 2,
    style: style,
    attributionControl: true,
    hash: true,
    renderWorldCopies: false
  })

  map.on('mousemove', (e) => {
    const f = map.queryRenderedFeatures(e.point)[0]
    if (f) {
      overlay.classList.remove('default', 'conflict', 'post-conflict', 'other')
      const state = lut[f.properties.iso3cd]
      if (state) {
        const label = labels[state]
        overlay.classList.add(state)
        country.textContent = f.properties.maplab
        description.textContent = label
        console.log(`${f.properties.maplab}: ${label} ${overlay.classList}`)
      } else {
        overlay.classList.add('default')
        country.textContent = ''
        description.textContent = ''
      }
    }
  })

  map.on('load', () => {
  })
})
