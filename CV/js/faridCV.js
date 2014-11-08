$(function(){
//Canibalized from: http://bl.ocks.org/mbostock/4339083:: THANKS!

var margin = {top: 100, right: 120, bottom: 20, left: 120},
width = 1000 - margin.right - margin.left,
height = 550 - margin.top - margin.bottom;

var i = 0,
duration = 750,
root;

var tree = d3.layout.tree()
.size([width, height]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.x, d.y]; });


var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var infoBox = d3.select("#info-container");

d3.json("data.json", function(error, data) {
  root = data;
  root.y0 = 0;
  root.x0 = width/2;
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);
  updateInfo(root);
});

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  // var nodes = tree.nodes(root).reverse(),

  var nodes = tree.nodes(root),
  links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {d.y = d.depth * 180; });

   // Update the nodes…
   var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
  .attr("class", "node")
  .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
  .on("click", function(d){click(d);});

  nodeEnter.append("circle")
  .attr("r", 1e-6)
  .attr("id", function(d) {return "node"+d.id; })     
  .style("fill", function(d) { return d._children ? "#c98b8e" : "#fff"; })

  nodeEnter.append("text")
  .attr("font-family", "'Antic Slab', Helvetica, Arial, sans-serif")
  .attr("font-size","1.25em")
  .attr("x",function(d){return d.id==1?"2":"0"})
  .attr("dy", function(d){return d.id==1?"1em":"-.75em"})
  .attr("text-anchor", function(d){return d.id==1?"middle":"middle"})
  .text(function(d) { return d.name; })
  .style("fill-opacity", 1e-6);

  nodeEnter.append("svg:image")
  .attr("id",function(d){return "node"+d.id+"img"})
  .attr("xlink:href",function(d){return (d.image==null)?"":d.image})
  .attr("width",function(d){
    if (d.id==1){
      return (d.image==null)?"1e-6":"100"
    }
    else 
      return (d.image==null)?"1e-6":"16"
    })
  .attr("height",function(d){
    if (d.id==1){
      return (d.image==null)?"1e-6":"100"
    }
    else 
      return (d.image==null)?"1e-6":"16"
    })
  .attr("x",function(d){
    if (d.id==1){
      return (d.image==null)?"1e-6":"-50"
    }
    else 
      return (d.image==null)?"1e-6":"-8"
    })
  .attr("y",function(d){
    if (d.id==1){
      return (d.image==null)?"1e-6":"-100"
    }
    else 
      return (d.image==null)?"1e-6":"-8"
    })
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
  .attr("r", function(d){return d.image!=null?1e-6:4.5})
  .style("fill", function(d) { return (d._children) ? "#c98b8e" : "#fff"; });

  nodeUpdate.select("text")
  .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
  .duration(duration)
  .attr("transform", function(d) { return "translate(" + d.parent.x + "," + d.parent.y + ")"; })
  .remove();

  nodeExit.select("circle")
  .attr("r", 1e-6);

  nodeExit.select("text")
  .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
  .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
  .attr("class", "link")
  .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
  });

  // Transition links to their new position.
  link.transition()
  .duration(duration)
  .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {x: d.source.x, y: d.source.y};
    return diagonal({source: o, target: o});
  })
  .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });  

}

function updateInfo(x){
  var infoData = infoBox.selectAll(".infoBox").data((x.info!=null)?[x.info]:[]);
  var infoEnter = infoData.enter()
  .append("div")
  .attr("class","infoBox")
  .style("opacity","0")

  infoEnter.append("div").attr("class","infoAvatar").html(function(d){return "<img src="+d.avatar+"></img>"});
  infoEnter.append("div").attr("class","infoTitle").html(function(d){return d.title});
  infoEnter.append("div").attr("class","infoSubhead").html(function(d){return d.subhead});
  infoEnter.append("div").attr("class","infoText").html(function(d){return d.text})

  var infoUpdate = infoData.transition().duration(duration/2).style("opacity","0");
  infoUpdate.each("end",function(){
  infoData.select(".infoAvatar").html(function(d){return "<img src="+d.avatar+"></img>"});
  infoData.select(".infoTitle").html(function(d){return d.title});
  infoData.select(".infoSubhead").html(function(d){return d.subhead});
  infoData.select(".infoText").html(function(d){return d.text});
  })
  infoUpdate.transition().duration(duration/2).style("opacity","1");



  infoData.exit()
  .transition()
  .duration(duration)
  .style("opacity","0")
  .remove();


  //We also want a line from the dot to the infoBox
  var infoLink = svg.selectAll("path.infolink")
  .data((x.info!=null)?[x]:[]);

  infoLink.enter().insert("path", "g")
  .attr("class", "infolink")
  .attr("d", function(d) {
    var o = {x: d.x, y: d.y};
    var targ = {x: width/2,y: height+30};
    return diagonal({source: o, target: o});
  }); 

  infoLink.transition()
  .duration(duration)
  .attr("d", function(d) {
    var o = {x: d.x, y: d.y};
    var targ = {x: width/2,y: height+30};
    return diagonal({source: o, target: targ});
  });
  
  // Transition exiting nodes to the parent's new position.
  infoLink.exit().transition()
  .duration(duration)
  .attr("d", function(d) {
    var targ = {x: width/2,y: height+30};
    var o = {x: x.x, y: x.y};
    return diagonal({source: targ, target: targ});
  })
  .remove();

}

// Toggle children on click.
function click(d) {
//This collapses all of the siblings, becomes like a radio button
if(d.parent!=undefined){//if this not the top
  for (var i=0;i<d.parent.children.length;i++){
    if (d.parent.children[i].id!=d.id){//don't collapse the one we want to show
      if (d.parent.children[i].children) {//children are showing
      d.parent.children[i]._children = d.parent.children[i].children;//hide them
      d.parent.children[i].children = null;//delete the children
    }
    }
  }
    if (d.children) {//there are no children hidden
    d._children = d.children;//hide them
    d.children = null;//delete the children
  } else {//show hidden children
    d.children = d._children;//show them
    d._children = null;//delete the hidden children
  }
}
  update(d);
  updateInfo(d);
}

});