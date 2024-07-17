mapboxgl.accessToken = 'pk.eyJ1IjoibmF0dHkyMzEiLCJhIjoiY2x5bnh1eW5xMGI3dDJucHM3NjI0eHNwbiJ9._LJlwcP7KCglB3slqo-vDA';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 3, // starting zoom
        center: [-100, 40] // starting center
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/state_data.geojson');
    let stateData = await response.json();

    map.on('load', function loadingData() {
        map.addSource('stateData', {
            type: 'geojson',
            data: stateData
        });

        map.addLayer({
            'id': 'stateData-layer',
            'type': 'fill',
            'source': 'stateData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'density'],
                    '#FFEDA0', // stop_output_0
                    10, '#FED976', // stop_input_0, stop_output_1
                    20, '#FEB24C', // stop_input_1, stop_output_2
                    50, '#FD8D3C', // stop_input_2, stop_output_3
                    100, '#FC4E2A', // stop_input_3, stop_output_4
                    200, '#E31A1C', // stop_input_4, stop_output_5
                    500, '#BD0026', // stop_input_5, stop_output_6
                    1000, '#800026' // stop_input_6, stop_output_7
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7
            }
        });

       
        const layers = ['0-10', '10-20', '20-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
        const colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Population Density<br>(people/sq.mi.)</b><br><br>";

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

        map.on('mousemove', 'stateData-layer', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features.length > 0) {
                const properties = e.features[0].properties;
                const popupContent = `<strong>${properties.state}</strong><br>Density: ${properties.density}`;
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(popupContent)
                    .addTo(map);
            }
        });

        map.on('mouseleave', 'stateData-layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });
}

geojsonFetch();

