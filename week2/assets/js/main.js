const googleMapsSearch = (function(){
	const API_KEY = 'AIzaSyBAmT4PgcNfyLYOLPIVJkg2fjCo1Z1_0Hs',
	$searchForm = document.querySelector('.search-form'), 
	startingLocation = new google.maps.LatLng(33.813245, -84.362171);
	let markers = [];

	const init = function() {
		const $map = document.getElementById('map');
		const mapStyles = [
		  {
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#1e1e2f"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#746855"
		      }
		    ]
		  },
		  {
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#242f3e"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.land_parcel",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.locality",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#d59563"
		      }
		    ]
		  },
		  {
		    "featureType": "administrative.neighborhood",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "poi",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#d59563"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#263c3f"
		      }
		    ]
		  },
		  {
		    "featureType": "poi.park",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#6b9a76"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#38414e"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#212a37"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "labels",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "labels.icon",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#9ca5b3"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#746855"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "geometry.stroke",
		    "stylers": [
		      {
		        "color": "#1f2835"
		      }
		    ]
		  },
		  {
		    "featureType": "road.highway",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#f3d19c"
		      }
		    ]
		  },
		  {
		    "featureType": "transit",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "transit",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#2f3948"
		      }
		    ]
		  },
		  {
		    "featureType": "transit.station",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#d59563"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "geometry",
		    "stylers": [
		      {
		        "color": "#17263c"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text",
		    "stylers": [
		      {
		        "visibility": "off"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text.fill",
		    "stylers": [
		      {
		        "color": "#515c6d"
		      }
		    ]
		  },
		  {
		    "featureType": "water",
		    "elementType": "labels.text.stroke",
		    "stylers": [
		      {
		        "color": "#17263c"
		      }
		    ]
		  }
		];
  	
	  	const map = new google.maps.Map($map,{
	  		center: startingLocation,
	  		zoom: 12,
	  		styles: mapStyles
	  	});

	  	function resetMarkers() {
	  		markers.forEach( (marker) => {
	  			marker.setMap(null);
	  		});
	  	}
  		 
		$searchForm.addEventListener('submit', (e) => {
			e.preventDefault();  
			resetMarkers(); 
			const $input = document.querySelector('#query');
			let inputVal = $input.value;
			inputVal.trim();
			if (inputVal.length > 0) {
				let request = {
					location: startingLocation,
					radius: '5000',
					openNow: true,
					query: `${inputVal}`
				}
				service = new google.maps.places.PlacesService(map);
				service.textSearch(request, callback);
				function callback(results, status) {
				  if (status == google.maps.places.PlacesServiceStatus.OK) {
				    for (let i = 0; i < results.length; i++) {
				      createMarkers(results[i]);
				    }
				  }
				}			

				function createMarkers(results) {

					let img = {
						url: results.icon,
					  size: new google.maps.Size(71, 71),
					  origin: new google.maps.Point(0, 0),
					  anchor: new google.maps.Point(17, 34),
					  scaledSize: new google.maps.Size(25, 25)
					}

					//console.log(img);
					//console.log(results);			
					let infowindow = new google.maps.InfoWindow({
						content: `
							<h6>${results.name}</h6>
	  					<p>${results.formatted_address}</p>
	  					<p>price: ${results.price_level ? results.price_level : 'not available'}</p>
	  					<p>rating: ${results.rating}</p>
					  `
					});
					
					let marker = new google.maps.Marker({
					  position: results.geometry.location,
					  animation: google.maps.Animation.BOUNCE,
					  icon: img,
					  map: $map
					});
					
					markers.push(marker);
					
					marker.addListener('click', function() {
					  infowindow.open(map, marker);
					});


				}
			} else {
				$searchForm.focus();
			}
			$input.value = '';    
		});
	}
	return {
	  init: init
	}
})();
window.onload = function() {

  googleMapsSearch.init();
  console.log('googleMapsSearch.init()');	
};