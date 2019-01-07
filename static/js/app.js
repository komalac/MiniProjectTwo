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
    // sname(selLeague)
  });  
};

function sname(selLeague)
{
  var sselect = d3.select('#select-season');
  var url = "/snames/" + selLeague;

  d3.json(url).then((snames) => {
    snames.forEach((sname) => {
      sselect
        .append("option")
        .text(lname)
        .property("value", sname);
    });
  });
}

// Initialize the dashboard
init();
