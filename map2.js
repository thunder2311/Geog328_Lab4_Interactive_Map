mapboxgl.accessToken = 'pk.eyJ1IjoibmF0dHkyMzEiLCJhIjoiY2x5bnh1eW5xMGI3dDJucHM3NjI0eHNwbiJ9._LJlwcP7KCglB3slqo-vDA';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 6, // starting zoom
    center: [-120.7401, 47.7511] // center over Washington State
});

async function geojsonFetch() {
    let response = await fetch('assets/wa-covid-data-102521.geojson');
    let covidData = await response.json();

    map.on('load', function loadingData() {
        map.addSource('covidData', {
            type: 'geojson',
            data: covidData
        });

        map.addLayer({
            'id': 'covidData-layer',
            'type': 'fill',
            'source': 'covidData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'casePer10k'],
                    '#FFEDA0', // stop_output_0
                    100, '#FED976', // stop_input_0, stop_output_1
                    200, '#FEB24C', // stop_input_1, stop_output_2
                    300, '#FD8D3C', // stop_input_2, stop_output_3
                    400, '#FC4E2A', // stop_input_3, stop_output_4
                    500, '#E31A1C', // stop_input_4, stop_output_5
                    600, '#BD0026', // stop_input_5, stop_output_6
                    700, '#800026' // stop_input_6, stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });

        const layers = ['0-100', '100-200', '200-300', '300-400', '400-500', '500-600', '600-700', '700+'];
        const colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>WA Covid-19 Cases<br>(people/sq.mi.)</b><br><br>";


        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mousemove', 'covidData-layer', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features.length > 0) {
                const properties = e.features[0].properties;
                const popupContent = `<strong>${properties.name}</strong><br>Case Rate: ${properties.casePer10k}`;
                popup
                    .setLngLat(e.lngLat)
                    .setHTML(popupContent)
                    .addTo(map);
            }
        });

        map.on('mouseleave', 'covidData-layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });
}

geojsonFetch();
