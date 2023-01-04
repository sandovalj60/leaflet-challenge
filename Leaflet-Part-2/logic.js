
// Store our API endpoint as queryUrl and platesUrl (Tectonic Plates).
// let queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
let platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"



// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

  function createFeatures(earthquakeData) {
    // Define a function  to run once for each feature in the array of features.
    // Give each feature a popup that describes the place, mag, time and location of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3> 
    Magnitude: ${feature.properties.mag} <br /> 
    Date Time: ${new Date(feature.properties.time)}<br />
    Long,Lat,Depth: ${feature.geometry.coordinates}</h4>` ) ;
    }

    // Define function to create the circle radius based on the magnitude
    function radiusSize(magnitude) {
      return magnitude * 50000;
    }

    // Define function to set the circle color based on the depth of epicentre, earthquakes with greater depth from surface should appear darker in colour.
    function circleColor(depthFromSurface) {
      if (depthFromSurface > 90) {
        return "#ffffd4"; 
      } else if (depthFromSurface > 70) {
        return "#fee391"; 
      } else if (depthFromSurface > 50) {
        return "#fec44f";
      } else if (depthFromSurface > 30) {
        return "#fe9929";
      } else if (depthFromSurface > 10) {
        return "#d95f0e";
      } else {
        return "#993404";
      }
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (earthquakeData, latlng) {
        return L.circle(latlng, {
          radius: radiusSize(earthquakeData.properties.mag),
          fillColor: circleColor(earthquakeData.geometry.coordinates[2]),
          fillOpacity: 0.75,
          stroke: false,
        });
      },
      onEachFeature: onEachFeature,
    });

    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
  };

  function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    let topo = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
       attribution: 
       'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }
    );

    let tectonicPlates = new L.LayerGroup(); 

    // Retrieve platesURL (Tectonic Plates GeoJSON Data) with D3
    d3.json(platesUrl).then (function(plateData) {
      // Create a GeoJSON Layer the plateData
      L.geoJson(plateData, {
        color: "#dc1414",
        weight: 2})
        // Add plateData to tectonicPlates LayerGroups 
        .addTo(tectonicPlates);
        // Add tectonicPlates Layer to the Map
        tectonicPlates.addTo(myMap);
        });

 

    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topoghrapic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates" : tectonicPlates
    };
    

    // Create map, adding the street and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [0, 20.0],
      zoom: 2.5,
      layers: [street, earthquakes],
    });

    // Create a layer control.
    L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend"),
        legendScale = ["-10", "10", "30", "50", "70", "90"],

        labels = ["#ffffd4", 
                  "#fee391", 
                  "#fec44f", 
                  "#fe9929",
                  "#d95f0e",
                  "#993404",
                ];


      for (let i = 0; i < legendScale.length; i++) {
        div.innerHTML +=
          "<i style='background:" +

          labels[i] + "'></i> " + legendScale[i] +
          (legendScale[i + 1] ? "&ndash;" + legendScale[i + 1] + "<br>" : "+");
      }
      return div;
   };
  // Add legend to map
   legend.addTo(myMap);
  }
});