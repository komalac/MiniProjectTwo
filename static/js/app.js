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
    // const selLeague = lgnames[1];
    // sname(selLeague)
    mlist();
  });  
};

function mlist()
{
  var sselect = d3.select('#match-list');
  
  d3.json("/matchlist").then((mlists) => {
    mlists.forEach((mlist) => {
      console.log(mlist)
      // sselect
      //   .append("option")
      //   .text(lname)
      //   .property("value", sname);
    });
  });
}

// Initialize the dashboard
init();
