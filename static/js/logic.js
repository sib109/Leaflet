function createMarkers(response) {
  var locs = response.features;

  for (var i=0; i < locs.length; i++){

    var long = locs[i].geometry.coordinates[0];
    var lat = locs[i].geometry.coordinates[1];
    var mag = locs[i].properties.mag;

    // Determining the color of the circle

    var fillcolor = "";

    if (mag > 5) {
      fillColour = "Red";
    }
    else if (mag > 4) {
      fillColour = "Tomato";
    }
    else if (mag > 3) {
      fillColour = "Coral";
    }
    else if (mag > 2) {
      fillColour = "Gold";
    }
    else if (mag > 1) {
      fillColour = "Yellow";
    }
    else{
      fillColour = "GreenYellow";
    };

    // Creating the marker as circle with diameter of the circle proportionate to magnitude
    var newCircle = L.circle([lat, long], {
      				color: "Black",
      				fillColor: fillColour,
      				fillOpacity: 0.85,
      				weight: 1,
      				radius: mag*20000
    				})
    				.bindPopup("<h3>Place: " + locs[i].properties.place + "</h3><h3>Magnitude: " + mag + "</h3>");

    // Adding the marker to the layer group
	  newCircle.addTo(quakeLayer);

  };
};

// Creating tile layer - satellite
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// Creating tile layer - grayscale
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.light",
    accessToken: API_KEY
});

// Creating tile layer - Outdoors
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

// Layer group for the markers
var quakeLayer = L.layerGroup();

// API call to get quake information. Calling createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", createMarkers);

// Creating base map with initial tile and layer group
var map = L.map("map-id", {
  center: [40, -100],
  zoom: 4.25,
  layers: [satellite, quakeLayer]
});

// Creating base map group
var baseMaps = {
	"Satellite": satellite,
	"Grayscale": lightmap,
	"Outdoors": outdoors};

// Creating overlay map
var overlayMaps = {
    "Earthquakes": quakeLayer
};


L.control.layers(baseMaps, overlayMaps).addTo(map);


var legend = L.control({position: 'bottomleft'});


legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend'),
            grades = [0, 1, 2, 3, 4, 5],
            c_palette = ["#ADFF2F", "#FFFF00", "#FFD700", "#FF7F50", "#FF6347", "#FF4500"],
            labels = [];

            // loop through our grades and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML += '<i style="background:' + c_palette[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;'
                               + grades[i + 1] + '<br>' : '+');
            }
            return div;
    };
// Adding the legend to map
legend.addTo(map);
