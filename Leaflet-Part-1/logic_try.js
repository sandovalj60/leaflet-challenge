// // Store our API endpoint as queryUrl.
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// // Perform a GET request to the query URL/
// d3.json(queryUrl).then(function (data) {
//   // Once we get a response, send the data.features object to the createFeatures function.
//   createFeatures(data.features);
// });


// function createFeatures(earthquakeData) {

//   // Define a function that we want to run once for each feature in the features array.
//   // Give each feature a popup that describes the place and time of the earthquake.
//   function onEachFeature(feature, L) {
//     L.circle(feature, {
//         fillOpacity: 0.75,
//         color: 'white',
//         fillColor: 'green',
//         radius: Math.sqrt(feature.properties.mag) * 500
//       })
//          .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
//   }


// //   // ------------------------------------------------
// //   for (let i = 0; i < cities.length; i++) {
// //     L.circle(cities[i].location, {
// //       fillOpacity: 0.75,
// //       color: "white",
// //       fillColor: "purple",
// //       // Setting our circle's radius to equal the output of our markerSize() function:
// //       // This will make our marker's size proportionate to its population.
// //       radius: markerSize(cities[i].population)
// //     }).bindPopup(`<h1>${cities[i].name}</h1> <hr> <h3>Population: ${cities[i].population.toLocaleString()}</h3>`).addTo(myMap);
// //   }
// //   // -----------------------------------------




//   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
//   // Run the onEachFeature function once for each piece of data in the array.
//   let earthquakes = L.geoJSON(earthquakeData, {
//     onEachFeature: onEachFeature
//   });

//   // Send our earthquakes layer to the createMap function/
//   createMap(earthquakes);
// }

// function createMap(earthquakes) {

//   // Create the base layers.
//   let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   })

//   let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//   });

//   // Create a baseMaps object.
//   let baseMaps = {
//     "Street Map": street,
//     "Topographic Map": topo
//   };

//   // Create an overlay object to hold our overlay.
//   let overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load.
//   let myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [street, earthquakes]
//   });

//   // Create a layer control.
//   // Pass it our baseMaps and overlayMaps.
//   // Add the layer control to the map.
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

// }




// ----------------------------------------------------------------------------------------------------------------




// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

// "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);

  function createFeatures(earthquakeData) {
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, location and time of the earthquake.
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

    // Define function to set the circle color based on the depth of epicentre, earthquakes with greater depth from surface (elevation) should appear darker in colour
    function circleColor(depthFromSurface) {
      if (depthFromSurface > 90) {
        return "rgb(62,0,0)"; 
      } else if (depthFromSurface > 70) {
        return "rgb(100,19,16)"; 
      } else if (depthFromSurface > 50) {
        return "rgb(138,34,31)";
      } else if (depthFromSurface > 30) {
        return "rgb(176,49,46)";
      } else if (depthFromSurface > 10) {
        return "rgb(214,64,61)";
      } else {
        return "rgb(252,79,76)";
      }
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (earthquakeData, latlng) {
        return L.circle(latlng, {
          radius: radiusSize(earthquakeData.properties.mag),
          //color: circleColor(earthquakeData.properties.mag), //circleColor(earthquakeData.properties.mag),
          fillColor: circleColor(earthquakeData.geometry.coordinates[2]),
          fillOpacity: 0.65,
          stroke: false,
        });
      },
      onEachFeature: onEachFeature,
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }

  function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      // "Topographic Map": topo,
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes,
      // Tectonic_Plates: tectonicPlates, // This is only for Part 2
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [0, 20.0],
      zoom: 2.5,
      layers: [street, earthquakes],
    });

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend"),
        legendScale = ["-10", "10", "30", "50", "70", "90"],

        labels = ["rgb(252,79,76)", 
                  "rgb(214,64,61)", 
                  "rgb(176,49,46)", 
                  "rgb(138,34,31)",
                  "rgb(100,19,16)",
                  "rgb(62,0,0)",
                ];


      for (let i = 0; i < legendScale.length; i++) {
        div.innerHTML +=
        // "<h1> Depth from Surface </h1>"
          "<i style='background:" +

          labels[i] + "'></i> " + legendScale[i] +
          (legendScale[i + 1] ? "&ndash;" + legendScale[i + 1] + "<br>" : "+");
      }
      return div;

    };
    legend.addTo(myMap);
  }
});
    // -----------------------------------------------------------------

//     const legend = L.control({position: 'bottomright'});

//     legend.onAdd = function (myMap) {
  
//       const div = L.DomUtil.create('div', 'info legend');
//       const legendScale = ["-10", "10", "30", "50", "70", "90"];
//       const labels = [];
//       let from, to;
  
//       for (let i = 0; i < legendScale.length; i++) {
//         from = legendScale[i];
//         to = legendScale[i + 1];
  
//         labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
//       }
  
//       div.innerHTML = labels.join('<br>');
//       return div;
//     };
  
//     legend.addTo(myMap);
//   }
// });
