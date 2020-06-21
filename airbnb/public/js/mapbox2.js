/* eslint-disable */
console.log('hi from the mapbox script for so many map plot in overview');
const locations = JSON.parse(document.getElementById('mainmap').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Frc2hhbTAzNCIsImEiOiJjazl5dGQwcGUwMGFlM21wbXZ6N3c4NWRqIn0.0rD-qn4KZewFbSLyV2ur_Q';

var map = new mapboxgl.Map({
	container: 'mainmap',
	style: 'mapbox://styles/saksham034/ckbjwu6qw07da1ir1aiwioup2'
	// center: [ long, lat ],
	// zoom: 10,
	// interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
	for (var i = 0; i < 1; i++) {
		// Create marker
		const el = document.createElement('div');
		el.className = 'marker';

		// Add marker
		new mapboxgl.Marker({
			element: el,
			anchor: 'bottom'
		})
			.setLngLat(loc.coordinates)
			.addTo(map);

		// Add popup
		new mapboxgl.Popup({
			offset: 30
		})
			.setLngLat(loc.coordinates)
			.setHTML(`<p>${loc.description}</p>`)
			.addTo(map);

		// Extend map bounds to include current location
		bounds.extend(loc.coordinates);
	}

	map.fitBounds(bounds, {
		padding: {
			top: 200,
			bottom: 150,
			left: 100,
			right: 100
		}
	});
});
