function init()
{
  var lselect = d3.select("#select-league");
  
  d3.json("/lnames").then((lgnames) => {
    
    lgnames.forEach((lname) => {
      
      lselect
        .append("option")
        .text(lname)
        .property("value", lname);
    });
    const selLeague = lgnames[1];
    
    countrymap()
  });  
};


function countrymap()
{
      // Create a map object
    var myMap = L.map("map", {
      center: [15.5994, -28.6731],
      zoom: 3
    });

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      container:'country-map',
      maxZoom: 18,
      id: "mapbox.streets-basic",
      accessToken: API_KEY
    }).addTo(myMap);
    

    d3.json("/clist").then((clist) => {    
      var countries = clist
    });

    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < countries.length; i++) {

      // Conditionals for countries points
      var color = "";
      if (countries[i].count > 100 {
        color = "yellow";
      }
      else if (countries[i].count > 200) {
        color = "blue";
      }
      else if (countries[i].count > 300) {
        color = "green";
      }
      else {
        color = "red";
      }

      // Add circles to map
      L.circle(countries[i].location, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: color,
        // Adjust radius
        radius: countries[i].points * 1500
      }).bindPopup("<h1>" + countries[i].country_name + "</h1> <hr> <h3>Number of matches: " + countries[i].count + "</h3>").addTo(myMap);
    }

}


// Initialize the dashboard
init();
