/* Model */

var locations = [
    {
        title: 'Canna Cruz',
        location: {
            lat: 36.9852565,
            lng: -122.0321366
        }
    },
    {
        title: 'Santa Cruz Naturals',
        location: {
            lat: 36.9757474,
            lng: -121.8881432
        }
    },
    {
        title: 'KindPeoples Collective',
        location: {
            lat: 37.0025934,
            lng: -122.0052452
        }
    },
    {
        title: 'Granny Purps',
        location: {
            lat: 36.9851449,
            lng: -121.9680126
        }
    },
    {
        title: 'Herbal Cruz',
        location: {
            lat: 36.9814499,
            lng: -121.9855979
        }
    },
    {
        title: 'Central Coast Wellness Center',
        location: {
            lat: 37.0716919,
            lng: -122.0838439
        }
    }
];

// declaring global variables
var map;
var infoWindow;
var bounds;

function initMap() {
    var santaCruz = {
        lat: 36.9741171,
        lng: -122.0329903
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: santaCruz,
        mapTypeControl: false
    });
    infowindow = new google.maps.InfoWindow();

    bounds = new google.maps.LatLngBounds();
   
    ko.applyBindings(new ViewModel());
}

// Location model 
var LocationMarker = function(data) {
    this.title = data.title;
    this.position = data.location;

    this.visible = ko.observable(true);

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // Create a marker per location, and put into markers array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon
    });

    // set marker and extend bounds (showListings)
    this.marker.setMap(map);
    bounds.extend(this.marker.position);
    map.fitBounds(bounds);
    
    // Create an onclick even to open an indowindow at each marker
    this.marker.addListener('click', function() {
        populateInfoWindow(self, infoWindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

}

/* View Model */

var ViewModel = function() {
    var self = this;

    self.showNav = ko.observable(false);

    this.mapList = ko.observableArray([]);

    locations.forEach(function(location) {
        self.mapList.push( new LocationMarker(location) );
    });

    // document.getElementById('show-listings').addEventListener('click', showListings);
    // document.getElementById('hide-listings').addEventListener('click', function() {
    //     hideListings(markers);
    // });

    // showListings();

    self.toggleVisibility = function() {
        self.showNav(!self.showNav());
        if (self.showNav()) {
            document.getElementById("mySidenav").style.width = "250px";
            document.getElementById("main").style.marginLeft = "250px";
            document.getElementById("map").style.left = "250px";
        } else {
            document.getElementById("mySidenav").style.width = "0";
            document.getElementById("main").style.marginLeft= "0";
            document.getElementById("map").style.left= "0";
        }
    };

};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

// // This function will loop through the markers array and display them all.
// function showListings() {
//     var bounds = new google.maps.LatLngBounds();
//     // Extend the boundaries of the map for each marker and display the marker
//     for (var i = 0; i < markers.length; i++) {
//         markers[i].setMap(map);
//         bounds.extend(markers[i].position);
//     }
//     map.fitBounds(bounds);
// }

// // This function will loop through the listings and hide them all.
// function hideListings(markers) {
//     for (var i = 0; i < markers.length; i++) {
//         markers[i].setMap(null);
//     }
// }