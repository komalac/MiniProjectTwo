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
  
    var newleague = d3.select("#select-league").property("value")
    snames(newleague) 
    lgdetails(newleague)
    countrymap()
  });  
};

function snames(newleague)
{
  var lselect = d3.select("#select-season");
  var url = "/snames/" + newleague;

  d3.json(url).then((snnames) => {
    
    snnames.forEach((snname) => {
      
      lselect
        .append("option")
        .text(snname)
        .property("value", snname);
    });
  });
}

function leagueChanged(newleague) {
  // Fetch new data each time a new sample is selected
  snames(newleague)
}

function countrymap()
{
      // Create a map object
    var myMap = L.map("country-map", { 
      center: [48, 4],
      zoom: 4
    });

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      container:'country-map',
      maxZoom: 18,
      id: "mapbox.streets-basic",
      accessToken: API_KEY
    }).addTo(myMap);
    
    // const countries=[];

    d3.json("/clist").then((clist) => {  
      
        var countries = []
        
        clist.forEach(function(d) {
          countries.push({
            "country": d.country,
            "location": d.location,
            "count":d.count
          })
        })

      
        // Loop through the cities array and create one marker for each city object
        for (var i = 0; i < countries.length; i++) {

          // Conditionals for countries points
          var color = "";
          if (countries[i].count > 100) {
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

      
          L.circle(countries[i].location, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // Adjust radius
            // radius: parseint(countries[i].matches) * 1500
            radius: 50  * 1500
          }).bindPopup("<h4 text-align: center>" + countries[i].country + "</h4> Number of matches: " + countries[i].count).addTo(myMap);
        }
          
      });  

}


function lgdetails(newleague)
{   
  var imgselect = d3.select("#leaguelogo");
  var lgtext = d3.select("#lgtext");

  var url = "/lgdetails/" + newleague;

  d3.json(url).then((lgtext) => {        
        imgsrc= "/static/images/" + lgtext[9]         
        imgselect.attr('src', imgsrc)        
        d3.select("#lgtext")                  
          .html(lgtext[10])
  });

}

function optionChanged() {
  // Fetch new data each time a new sample is selected
  var newleague = d3.select("#select-league").property("value")
  snames(newleague) 
  lgdetails(newleague)
}

// Initialize the dashboard
init();
