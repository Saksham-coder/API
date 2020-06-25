/* eslint-disable */
// console.log('hi from the mapbox script for single');
const locations = JSON.parse(document.getElementById('map').dataset.livelocation);
// console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoic2Frc2hhbTAzNCIsImEiOiJjazl5dGQwcGUwMGFlM21wbXZ6N3c4NWRqIn0.0rD-qn4KZewFbSLyV2ur_Q';

const long = locations.coordinates[0];
const lat = locations.coordinates[1];

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/saksham034/ckbjwu6qw07da1ir1aiwioup2',
	center: [ long, lat ],
	zoom: 10,
	interactive: false
});

var marker = new mapboxgl.Marker().setLngLat(locations.coordinates).addTo(map);
// console.log(locations.coordinates);

var popup = new mapboxgl.Popup({ offset: 30, className: 'my-class' })
	.setLngLat(locations.coordinates)
	.setHTML(`<p> ${locations.address} </p>`)
	.setMaxWidth('300px')
	.addTo(map);

// const bounds = new mapboxgl.LngLatBounds();

//locations.forEach((loc) => {
// for (var i = 0; i < 1; i++) {
// Create marker
// const el = document.createElement('div');
// el.className = 'marker';

// // Add marker
// new mapboxgl.Marker({
// 	element: el,
// 	anchor: 'bottom'
// })
// 	.setLngLat(locations.coordinates)
// 	.addTo(map);

// 		// Add popup
// 		new mapboxgl.Popup({
// 			offset: 30
// 		})
// 			.setLngLat(loc.coordinates)
// 			.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
// 			.addTo(map);

// Extend map bounds to include current location
// 	bounds.extend(locations.coordinates);
// }

// map.fitBounds(bounds, {
// 	padding: {
// 		top: 200,
// 		bottom: 150,
// 		left: 100,
// 		right: 100
// 	}
// });
