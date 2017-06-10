function initMap() {
    var uluru = {
        lat: 40.7413549,
        lng: -73.9980244
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}