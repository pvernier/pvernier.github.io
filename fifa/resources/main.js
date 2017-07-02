"use strict";

var dataset;
function show(arg) {
    d3.queue()
      .defer(d3.csv, "data.csv")
      .await(ready)

    function ready(error, data) {
      dataset = data
      var values = data.map(function(i){return parseInt(i[arg])})

      scale.domain([d3.min(values), d3.max(values)]).nice();

      var circles = svg.selectAll(".player")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "player")
          .attr("r", 6)

          .attr('cy', height/3)
          .attr("fill", "#969696")
          .on("click", function(d) {
              // to unhighlight
              if(d3.select(this).classed("highlight")) {
                 d3.selectAll('circle').style('opacity', 1)
                 d3.selectAll('circle.highlight').classed("highlight", false)
              } else { // to highlight
                  var classifier = d3.select("select#classify").node().value

                  var toHighlight = d[classifier]
                  
                  d3.selectAll('circle').each(function(d) {
                    if (d[classifier] !== toHighlight) {
                      d3.select(this).style('opacity', 0.3)
                      d3.select(this).classed("highlight", false)
                    }
                    else {
                      d3.select(this).style('opacity', 1)
                      d3.select(this).classed("highlight", true)
                    }
                  })
                  d3.select(this).classed("highlight", true)
              }
          })
          .on("mouseover", function(d) {
              d3.select(this).style("stroke-width", 2)
              d3.select("img").attr('src', 'img/' + d.Name + '.png')
              d3.select("#player_name").html(d.Name)

              d3.select("#position").html('Position: <span>' + d.Position + '</span>')
              d3.select("#position span").style("color", positions[d.Position])
              d3.select("#position span").style("font-weight", "bold")

              d3.select("#club").html('Club: <span>' + d.Club + '</span>')
              d3.select("#club span").style("color", clubs[d.Club])
              d3.select("#club span").style("font-weight", "bold")

              d3.select("#nationality").html('Nationality: <span>' + d.Nationality + '</span>')
              d3.select("#nationality span").style("color", nationalities[d.Nationality])
              d3.select("#nationality span").style("font-weight", "bold")

              d3.select("#age").html('Age: <span>' + d.Age + '</span>')
              d3.select("#weight").html('Weight: <span>' + d.Weight + '</span>')
              d3.select("#height").html('Height: <span>' + d.Height + '</span>')

              d3.select("#variable").html('Rating: <span>' + d['Rating'] + '</span>')
        })
        .on('mouseout', function(d) {
            d3.select(this).style('stroke-width', 0.5)
         })

      simulation.nodes(data)
          .on("tick", ticked)

      function ticked() {
        circles
         .attr("cx", function(d) {
            return d.x
         })
         .attr("cy", function(d) {
            return d.y
         })
      }
    }
}; 

function onClick(d) {
  // to unhighlight
  if(d3.select(this).classed("highlight")) {
     d3.selectAll('circle').style('opacity', 1)
     d3.selectAll('circle.highlight').classed("highlight", false)
  } else { // to highlight
    var classifier = d3.select("select#classify").node().value

    var toHighlight = d[classifier]
    
    d3.selectAll('circle').each(function(d) {
      if (d[classifier] !== toHighlight) {
        d3.select(this).style('opacity', 0.3)
        d3.select(this).classed("highlight", false)
      }
      else {
        d3.select(this).style('opacity', 1)
        d3.select(this).classed("highlight", true)
      }
    })
    d3.select(this).classed("highlight", true)
  }
} 

var width = 1300,
    height = 150;

var svg = d3.select("#chart")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g")
            .attr("transform", "translate(50, 0)")

var forceXVar = d3.forceX(function(d) {
        return scale(d['Rating'])
    }).strength(0.05)

var simulation = d3.forceSimulation()
        .force("x", forceXVar)
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(7))

// On page load shoa 'Rating' variable
show('Rating');

var scale = d3.scaleLinear().range([0, width - 60]);

var menu = d3.select("select#variables");
menu.on("change", function() {
  var variable = this.value
  var values = dataset.map(function(i){return parseInt(i[variable])})

  scale.domain([d3.min(values), d3.max(values)]).nice();

  var forceXVar = d3.forceX(function(d) {
      return scale(d[variable])
  }).strength(0.05)

  simulation.force("x", forceXVar)
                    .alphaTarget(0.25)
                    .restart()

  svg.selectAll(".player")
      .on("click", function(d) {
        // to unhighlight
        if(d3.select(this).classed("highlight")) {
           d3.selectAll('circle').style('opacity', 1)
           d3.selectAll('circle.highlight').classed("highlight", false)
        } else { // to highlight
            var classifier = d3.select("select#classify").node().value

            var toHighlight = d[classifier]
            
            d3.selectAll('circle').each(function(d) {
              if (d[classifier] !== toHighlight) {
                d3.select(this).style('opacity', 0.3)
                d3.select(this).classed("highlight", false)
              }
              else {
                d3.select(this).style('opacity', 1)
                d3.select(this).classed("highlight", true)
              }
            })
          d3.select(this).classed("highlight", true)
        }
      })
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", 2)
        d3.select("img").attr('src', 'img/' + d.Name + '.png')
        d3.select("#player_name").html(d.Name)

        d3.select("#position").html('Position: <span>' + d.Position + '</span>')
        d3.select("#position span").style("color", positions[d.Position])
        d3.select("#position span").style("font-weight", "bold")

        d3.select("#club").html('Club: <span>' + d.Club + '</span>')
        d3.select("#club span").style("color", clubs[d.Club])
        d3.select("#club span").style("font-weight", "bold")

        d3.select("#nationality").html('Nationality: <span>' + d.Nationality + '</span>')
        d3.select("#nationality span").style("color", nationalities[d.Nationality])
        d3.select("#nationality span").style("font-weight", "bold")

        d3.select("#age").html('Age: <span>' + d.Age + '</span>')
        d3.select("#weight").html('Weight: <span>' + d.Weight + '</span>')
        d3.select("#height").html('Height: <span>' + d.Height + '</span>')

        d3.select("#variable").html(variable.replace('_', ' ') + ': <span>' + d[variable] + '</span>')
        })
      .on('mouseout', function(d) {
          d3.select(this).style('stroke-width', 0.5)
       })
})

var classify = d3.select("select#classify");
classify.on("change", function() {
  var classifier = this.value
  var circles = svg.selectAll(".player")
  if (classifier == 'Position') {
    circles.style("fill", function(d) {
              return positions[d.Position]
            })
  } else if (classifier == 'Nationality') {
      circles.style("fill", function(d) {
              return nationalities[d.Nationality]
            })
  } else if (classifier == 'Club') {
      circles.style("fill", function(d) {
              return clubs[d.Club]
            })
  } else {
    circles.style("fill", "#969696")
  }
  circles.style('opacity', 1)
  circles.classed("highlight", false)
})

// Arrays of colors for the different classifiers
var clubs = {'Arsenal': '#EF0107', 'AS Monaco': '#E61B23', 'AS Saint-Étienne': '#006A32', 'Athletic Bilbao': '#EE2523',
         'Atlético Madrid': '#2D315F', 'Bayer 04': '#E32221', 'Bor. Dortmund': '#FDE100', 'Chelsea': '#034694',
         'Everton': '#274488', 'FC Barcelona': '#004D98', 'FC Bayern': '#EE0A46', 'Inter': '#1266AB', 'Juventus': '#000000',
         'Leicester City': '#0053A0', 'Liverpool': '#D00027', 'Manchester City': '#97C1E7', 'Manchester Utd': '#DA020E',
         'Napoli': '#65B8E7', 'Olym. Lyonnais': '#DA001A', 'Olym. Marseille': '#009DDC', 'PSG': '#004078',
         'Real Madrid': '#FFFFFF', 'Roma': '#F89728', 'Spurs': '#001C58'}

var nationalities = {'Algeria': '#006233', 'Argentina': '#74ACDF', 'Armenia': '#F2A800', 'Austria': '#ED2939', 'Belgium': '#000000',
                     'Bosnia Herzegovina': '#002395', 'Brazil': '#FCF005', 'Chile': '#D52B1E', 'Colombia': '#FCD116', 'Costa Rica': '#002B7F',
                     'Croatia': '#FF0000', 'Czech Republic': '#11457E', 'Denmark': '#C60C30', 'England': '#FFFFFF', 'France': '#143CFF', 'Gabon': '#009E60',
                     'Germany': '#666666', 'Greece': '#0D5EAF', 'Italy': '#083CD8', 'Netherlands': '#F68B32', 'Poland': '#DC143C', 'Portugal': '#007366',
                     'Serbia': '#B72E3E', 'Slovakia': '#2447D5', 'Slovenia': '#B4FC8A', 'Spain': '#F10E0E', 'Sweden': '#0E6FE4', 'Uruguay': '#81A2FF', 'Wales': '#FF0000'}

var positions = {'Goal keeper': '#bebada', 'Defender': '#fb8072', 'Midfielder': '#80b1d3', 'Withdrawn striker': '#fdb462', 'Striker': '#b3de69'}
