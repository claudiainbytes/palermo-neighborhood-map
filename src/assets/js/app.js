function Location(data) {

    var self = this;

    self.id = data.id;
    self.title = data.title;
    self.location = data.location;
    self.category = data.category;
    self.address = data.address;
    self.desc = data.desc;
    self.imgvenue = data.imgvenue;
    self.website = data.website;
    self.icon = self.setIcon(self.category);
    self.display = true;

}

Location.prototype.setIcon = function(category) {

      var icons = [];
      icons['gallery'] = 'gallery-ico.png';
      icons['dance'] = 'dance-ico.png';
      icons['theater'] = 'theater-ico.png';
      icons['bookstore'] = 'bookstore-ico.png';
      icons['music'] = 'music-ico.png';
      icons['museum'] = 'museum-ico.png';

      return "assets/img/map-icons/" + icons[category];

}

function AppViewModel() {

      var self = this;

      // This variable refers to the map
      self.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 4.635258, lng: -74.071839},
            zoom: 17,
            mapTypeControl: true,
            mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: google.maps.ControlPosition.TOP_RIGHT
            }
      });

      // This array represents all markers
      self.markers = [];

      // Locations observable array
      self.locations = ko.observableArray([]);

      // This observable represents the filter input text
      self.filter = ko.observable();

      self.largeInfowindow = new google.maps.InfoWindow();
      self.bounds = new google.maps.LatLngBounds();

      // Setting Google streetViewService
      self.streetViewService = new google.maps.StreetViewService();
      self.radius = 50;

      // Loading data from Firebase database server and save mappedLocations in locations observable array
      $.getJSON("https://palermoneighborhoodmap.firebaseio.com/locations.json", function(allData) {
            var mappedLocations = $.map(allData, function(item) { return new Location(item) });
            self.locations(mappedLocations);
      }).error( function(e) {
            $(".venue-list").hide();
            $(".locationsErrorHandling").show();
      });

      // Scrolling the locations/venues list
      ko.bindingHandlers.scrollLocations = {
            update: function(element, valueAccessor) {
                 var ps = new PerfectScrollbar('#venue-list');
                 ps.update();
            }
      };

      // This function allows to create a marker
      self.createMarker = function(location){
            var marker = new google.maps.Marker({
                              map: self.map,
                              position: location.location,
                              title: location.title,
                              category: location.category,
                              icon: location.icon,
                              animation: google.maps.Animation.DROP,
                              id: location.id,
                              address: location.address,
                              desc: location.desc,
                              website: location.website,
                              imgvenue: 'assets/img/venues/' + location.imgvenue,
                              display: location.display
                        });
            return marker;
      };

      // This custom binding show the infoWindow over a specific location link in nav bar
      self.clickLocation = function(location) {
            self.populateInfoWindow(self.createMarker(location), self.largeInfowindow);
      };

      //This function compares a string with the first tokens of another string
      self.stringStartsWith = function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
      };

      // This function will loop through the markers array and display them all.
      self.showLocations = function (markers) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(self.map);
          self.bounds.extend(markers[i].position);
        }
        self.map.fitBounds(self.bounds);
      };

      // This function will loop through the locations and hide them all.
      self.hideLocations = function (markers) {
        if ( markers.length > 0 ) {
              for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
              }
        }
      };

      //Filter the items using the filter text
      self.filteredLocations = ko.computed( function() {
          var filter = self.filter();
          var startsWith = false;
          if (!filter) {
              return self.locations();
          } else {
              return ko.utils.arrayFilter(self.locations(), function(location) {
                   startsWith = self.stringStartsWith(location.title.toLowerCase(), filter.toLowerCase());
                   location.display = startsWith;
                   return startsWith;
              });
          }
      }, self);

      // This function allows to show the infoWindow
      // According to the marker position, when it is clicked, this function shows the infoWindow
      self.populateInfoWindow = function(marker, infowindow) {

            //This listener allows inject jquery plugins, slick.js, to slide basic info and the streetview panorama
            google.maps.event.addListener(infowindow, 'domready', function() {
                  $('.iw-carousel').not('.slick-initialized').slick({ dots: true, prevArrow: false, nextArrow: false, infinite: true, speed: 500, fade: true, cssEase: 'linear'});
            });

            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                  // Clear the infowindow content to give the streetview time to load.
                  infowindow.setContent('');
                  infowindow.marker = marker;
                  // Make sure the marker property is cleared if the infowindow is closed.
                  infowindow.addListener('closeclick', function() {
                        infowindow.marker = null;
                  });

                  var contentString = '<div class="iw">' +
                                          '<div class="iw-row">' +
                                          '<div class="iw-col-12">' +
                                          '<div class="info-category ' + marker.category + '"><img src="' + marker.icon + '"/><span>' + marker.category + '</span></div>'+
                                          '</div>' +
                                          '</div>' +
                                          '<div class="iw-row">' +
                                          '<div class="iw-col-12">' +
                                          '<h2 class="info-title">' + marker.title + '</h2>'+
                                          '</div>' +
                                          '</div>' +
                                          '<div class="iw-carousel">' +
                                          '<div>' +
                                          '<div class="iw-row item">' +
                                          '<div class="iw-col-4 iw-col-4">' +
                                          '<img class="imgvenue" src="' + marker.imgvenue + '"/>'+
                                          '</div>' +
                                          '<div class="iw-col-8 iw-col-8 info-content">' +
                                          '<p>' + marker.desc + '</p>'+
                                          '<p>' + marker.address + '</p>'+
                                          '<hr>' +
                                          '<a target="_blank" href="' + marker.website + '"><i class="fa fa-facebook-square" aria-hidden="true"></i></a>'+
                                          '</div>' +
                                          '</div>' +
                                          '</div>' +
                                          '<div>' +
                                          '<div class="iw-row item">' +
                                          '<div class="iw-col-12">' +
                                          '<div id="pano"></div>'+
                                          '</div>' +
                                          '</div>' +
                                          '</div>' +
                                          '</div>';

                  //This function gets the streetview image according to the position
                  function getStreetView( data, status ) {
                    infowindow.setContent(contentString);
                    if (status == google.maps.StreetViewStatus.OK) {
                      var nearStreetViewLocation = data.location.latLng;
                      var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                      var panoramaOptions = {
                          position: nearStreetViewLocation,
                          pov: { heading: heading, pitch: 30 }
                      };
                      var panorama = new google.maps.StreetViewPanorama(
                      document.getElementById('pano'), panoramaOptions);
                    } else {
                      document.getElementById('pano').innerHTML = '<div>No Street View Found</div>';
                    }
                  }
                  // Get the closest streetViewService near a 50m of radius
                  self.streetViewService.getPanoramaByLocation(marker.position, self.radius, getStreetView);

                  // Open the infowindow on the correct marker
                  infowindow.open(self.map, marker);

            }

      };

      // This function allows to initialize the map,
      // It was neccesary to use a computed function to work with observables
      self.loadMap = ko.computed( function () {

            var locations = self.locations();

            var largeInfowindow = self.largeInfowindow;
            var bounds = self.bounds;

            // The following group uses the location array to create an array of markers on initialize.
            for (var i = 0; i < locations.length; i++) {

                  // Create a marker per location, and put into markers array.
                  var marker = self.createMarker(locations[i]);
                  // Push the marker to our array of markers.
                  self.markers.push(marker);
                  // Create an onclick event to open an infowindow at each marker.
                  marker.addListener('click', function() {
                        self.populateInfoWindow(this, largeInfowindow);
                  });
                  bounds.extend(self.markers[i].position);

            }//End for

            // Extend the boundaries of the map for each marker
            self.map.fitBounds(bounds);

      }, self);

      self.loadMap();

}

// Handling the navigation menu left bar
$(function() {
      var $menu = $('#menu');
      var $foldOut = $('#fold-out');

      $menu.click(function(e){
            e.stopPropagation();
            $foldOut.toggleClass('open');
            var icon = $(this).find("i");
            icon.toggleClass("fa-bars fa-times");
      });
});

// To reload the page
$('.btnErrorHandling').click(function() {
    location.reload();
});

//We create the callback function initMap
function initMap(){
      ko.applyBindings( new AppViewModel() );
}

//Google Maps error handling
function mapErrorHandling() {
      $(".mapErrorHandling").show();
}