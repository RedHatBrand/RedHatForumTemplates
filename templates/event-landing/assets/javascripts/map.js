(function () {
  var baseUrl = '//open.mapquestapi.com/geocoding/v1/address';
  var params = {
    key: 'Fmjtd%7Cluurn96z2l%2Cr2%3Do5-9w8agr',
    outFormat: 'json',
    location:  window.encodeURIComponent(mapSettings.address)
  };

  function queryString (params) {
    return Object.keys(params).map(function (key) {
      return key + '=' + params[key];
    }).join('&');
  }

  var url = baseUrl + '?' + queryString(params);

  $.ajax({
    type: 'get',
    url: url,
    success: function (res) {
      var loc = res.results[0].locations[0]
      var latLng = (loc && loc.latLng) || { lat: 27.4679, lng: 153.0278 };
      var lat = latLng.lat;
      var lon = latLng.lng;

      initMap([lat, lon]);
    }
  });

  function initMap (loc) {
    var zoom = parseInt(mapSettings.zoom);
    var map = L.map('map', {
      scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
        markerZoomAnimation: false
    });
    map.dragging.disable();

    var tiles = L.tileLayer('http://{s}.tile.stamen.com/{style}/{z}/{x}/{y}@2x.png', {style: 'toner-background'});
    tiles.addTo(map);

    var icon =  L.divIcon({
      className: 'marker-icon'
    });

    var marker = L.marker(loc, { icon: icon }).addTo(map);

    map.setView(loc, zoom);

    return map;
  }
})()
