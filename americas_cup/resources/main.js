var map = L.map('map', { 
      center: [37.8175, -122.43], 
      zoom: 14 
  });

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var button_animation = L.control( { position: 'topright' } );
button_animation.onAdd = function(map) {
  var button = L.DomUtil.create("button", "play btn btn-default");
  $(button).append( '<span class="glyphicon glyphicon-play" aria-hidden="true"></span>');
  return button
}
button_animation.addTo(map); 

var button_tracker = L.control( { position: 'topright' } );
button_tracker.onAdd = function(map) {
  var tracker = L.DomUtil.create("button", "track btn btn-default");
  $(tracker).append( '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>');

  L.DomEvent.addListener(tracker, 'click', function(e) { 
    var $this = $(this);
    if ($this.html() == '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>') {
         $this.html( '<span class="glyphicon glyphicon-globe" aria-hidden="true"></span>');
         bounds = L.latLngBounds(positionUS._latlng, positionNZ._latlng);
         map.setView(bounds.getCenter(), 15);
    } 
    else {
         $this.html( '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>');
          map.setView([37.8175, -122.43], 14);
    };
  });
  return tracker
}
button_tracker.addTo(map); 

var wind = L.control({position: 'bottomleft'});
wind.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'wind');
  return div;
};
wind.addTo(map);

var info = L.control({position: 'bottomright'});
info.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info');
  div.innerHTML = '<p id="chrono"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> Warm up</p><br><p><span id="winner" style="color:#d7301f;">US</span><div class="bar"><div id="us"></div></div></p><br><p><span style="color:#0570b0;">NZ</span><div id="nz"></div></p>';
  return div;
};
info.addTo(map);

var lines = [{
  "type": "LineString",
  "coordinates": [[-122.45682, 37.82033], [-122.455, 37.81762]]
  }, {
      "type": "LineString",
      "coordinates": [[-122.455, 37.81762], [-122.45037, 37.81807]]
  }, {
      "type": "LineString",
      "coordinates": [[-122.4625, 37.8128], [-122.46287, 37.81443]]
  }, {
      "type": "LineString",
      "coordinates": [[-122.40079, 37.82382], [-122.40056, 37.82226]]
  }, {
      "type": "LineString",
      "coordinates": [[-122.40149, 37.81023], [-122.39897, 37.81027]]
}];

var lineStyle = {
    "color": "black",
    "dashArray": "5 4",
    "weight": 1,
    "opacity": 1
};

L.geoJSON(lines, {
    style: lineStyle
}).addTo(map);

var styleFloats = {
  radius: 3,
  fillColor: "white",
  color: "#000",
  weight: 0.5,
  opacity: 1,
  fillOpacity: 0.8
};

L.geoJSON(floats, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, styleFloats);
  }
}).addTo(map);

var entry = L.geoJSON(lines[0], {
  stroke: false
}).addTo(map);

entry.bindTooltip("Entry", {
  permanent: true, 
  direction: 'left',
  opacity: 1
});

var start = L.geoJSON(lines[1], {
  stroke: false
}).addTo(map);

start.bindTooltip("Start", {
  permanent: true, 
  direction: 'left',
  opacity: 1,
  offset: L.point(50,10)
});

var finish = L.geoJSON(lines[4], {
  stroke: false
}).addTo(map);

finish.bindTooltip("Finish", {
  permanent: true, 
  direction: 'left',
  opacity: 1,
  offset: L.point(60,-10)
});

var styleBoatUS = {
  radius: 30,
  fillColor: "#d7301f",
  fillOpacity: 1,
  color: "#d7301f"
};

var styleBoatNZ = {
  radius: 30,
  fillColor: "#0570b0",
  fillOpacity: 1,
  color: "#0570b0"
};

var point_1_us = new L.LatLng(boat_us.features[0].geometry.coordinates[1], boat_us.features[0].geometry.coordinates[0]);
var point_2_us = new L.LatLng(boat_us.features[1].geometry.coordinates[1], boat_us.features[1].geometry.coordinates[0]);
var pointList_us = [point_1_us, point_2_us];

var polyline_us = L.polyline(pointList_us, {color: '#d7301f',weight: 2.5}).addTo(map);

var positionUS = L.circle([boat_us.features[0].geometry.coordinates[1], boat_us.features[0].geometry.coordinates[0]], styleBoatUS).addTo(map);

var point_1_nz = new L.LatLng(boat_nz.features[0].geometry.coordinates[1], boat_nz.features[0].geometry.coordinates[0]);
var point_2_nz = new L.LatLng(boat_nz.features[1].geometry.coordinates[1], boat_nz.features[1].geometry.coordinates[0]);
var pointList_nz = [point_1_nz, point_2_nz];

var polyline_nz = L.polyline(pointList_nz, {color: '#0570b0',weight: 2.5}).addTo(map);

var positionNZ = L.circle([boat_nz.features[0].geometry.coordinates[1], boat_nz.features[0].geometry.coordinates[0]], styleBoatNZ).addTo(map);

var i = 2;
isRunning = false;

function str_pad_left(string,pad,length) {
  // Source: https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  return (new Array(length+1).join(pad)+string).slice(-length);
}

function draw(layer, polyline, position) {
  position._latlng.lat = layer.features[i].geometry.coordinates[1];
  position._latlng.lng = layer.features[i].geometry.coordinates[0];
  position.redraw();

  var point_n = new L.LatLng(layer.features[i].geometry.coordinates[1], layer.features[i].geometry.coordinates[0]);
  if (polyline._latlngs.length <11) {
      polyline.addLatLng(point_n);
  }
  else {
    polyline.getLatLngs().splice(0, 1);
    polyline.addLatLng(point_n);
  }

  if ($("button.track").html() !== '<span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span>') {
    bounds = L.latLngBounds(positionUS._latlng, positionNZ._latlng);
    map.setView(bounds.getCenter(), 15);
  }
}

function addSegment() {
  if (i++ < boat_us.features.length - 1)  {
    draw(boat_us, polyline_us, positionUS);
    draw(boat_nz, polyline_nz, positionNZ);
    
    if (i%6==0) {
      // Source of arrow image: https://thenounproject.com/search/?q=arrow&i=33038
      $(".wind").html('<img id="arrow" src="resources/arrow.svg" width="6" height="25"><br><p>' + boat_us.features[i].properties.wind_speed + ' knots</p>');

      $("img#arrow").css({ transform: 'rotate(' + String(boat_us.features[i].properties.wind_dir - 180) + 'deg)'});

      if (boat_us.features[i].properties.time >= 864 & boat_us.features[i].properties.time <= 2313) {
        var minutes = Math.floor((boat_us.features[i].properties.time - 864)/60);
        var seconds = (boat_us.features[i].properties.time - 864) - minutes * 60;

        $("p#chrono").html('<span class="glyphicon glyphicon-time" aria-hidden="true"></span> ' + str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2));

        $('div#us').width(boat_us.features[i].properties.run + '%');
        $('div#nz').width(boat_nz.features[i].properties.run + '%');
      }
    }

    if (boat_us.features[i].properties.time == 2271) {
      $("span#winner").text('US - Winner!')
    }  
  }
  else {
    isRunning = false;
    $("button.play").html('<span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>');
    polyline_us.getLatLngs().splice(0, 11);
    polyline_nz.getLatLngs().splice(0, 11);
  }

  if(isRunning){ 
    window.requestAnimationFrame(addSegment);
  }
}

$("button.play").click( function () {
  // Play
  if ($(this).html() == '<span class="glyphicon glyphicon-play" aria-hidden="true"></span>') {
    $(this).html('<span class="glyphicon glyphicon-pause" aria-hidden="true"></span>');
    isRunning = true;
    window.requestAnimationFrame(addSegment);
  }
  // Pause
  else if ($(this).html() == '<span class="glyphicon glyphicon-pause" aria-hidden="true"></span>') {
    $(this).html('<span class="glyphicon glyphicon-play" aria-hidden="true"></span>');
    isRunning = false;
  }
  // Replay
  else {
    $(this).html('<span class="glyphicon glyphicon-pause" aria-hidden="true"></span>');
    isRunning = true;
    i = 2;
    window.requestAnimationFrame(addSegment);

    $(".info").html('<p id="chrono"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> Warm up</p><br><p><span id="winner" style="color:#d7301f;">US</span><div class="bar"><div id="us"></div></div></p><br><p><span style="color:#0570b0;">NZ</span><div id="nz"></div></p>');
  }
});

$(function () {
  $(".play").tooltip({placement : 'auto', title: 'Start, pause or replay the animation', container: 'body'});  
});

$(function () { 
  $(".track").tooltip({placement : 'bottom', title: 'Click to track the boats. Click again to zoom out to full view', container: 'body'});  
});