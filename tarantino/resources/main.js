function create_axis(id) {
    xAxis = d3.axisTop(movieScale)
    var ax = d3.select("#" + id)
               .append("svg")
               .attr("height", 40)
               .attr("width", width)
    ax.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(50, 40)")
            .call(xAxis);

    ax.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "start")
      .attr("x", width / 2 + 5)
      .attr("y", height - 45)
      .text("minutes")
      .style('font', '10px Century Gothic, sans-serif')
}

function create_svg(file, element) {
  d3.json(file, function(json){
    create_axis(element)
    for (var i = 0; i < json.length; i++) {
        var movie_name = d3.select("#" + element)
                           .append("div")
                           .attr("id", element + "_movie_" + i)
                           .attr("class", "row")
                           .attr("height", height)
                           .attr("width", 1200)

        d3.select("#" + element + "_movie_" + i)
          .append("img")
          .attr("src", "img/" + json[i].movie + ".jpg")
          .attr("title", json[i].movie)
          .attr("height", height)

        var svg = d3.select("#" + element + "_movie_" + i)
                    .append("svg")
                    .style("background", "#f1f1f1")
                    .attr("height", height)
                    .attr("width", movieScale(duration_movies[i]))
                    .append("g")
                    .attr("transform", "translate(10, 0)")

        var circles = svg.selectAll("." + element)
                         .data(json[i].data)
                         .enter()
                         .append("circle")
                         .attr("class", element)
                         .attr("cx", function(d) {
                            return movieScale(d[0]);
                         })
                         .attr("cy", height / 2)
                         .on("mouseover", function(d) {
                            tooltip.transition()
                                   .style('opacity', 1)

                            if (element === 'profanities') {
                                tooltip.html('minute ' + d[0] + ': ' + d[1].length + ' ' + element  + '</br> - ' + d[1].join("</br> - "))
                              .style('left', ((d3.event.pageX + 15) + 'px'))
                              .style('top', ((d3.event.pageY - 35) + 'px'))
                            } else {
                                tooltip.html('minute ' + d[0] + ': ' + d[1] + ' ' + element)
                              .style('left', ((d3.event.pageX + 15) + 'px'))
                              .style('top', ((d3.event.pageY - 35) + 'px'))
                            }

                            d3.select(this).style('stroke-width', 1.5)
                            d3.select(this).style('opacity', 0.8)
                            d3.select(this).style('stroke', 'black')
                        })
                        .on('mouseout', function(d) {
                            d3.select(this).style('stroke-width', 0)
                            d3.select(this).style('opacity', 0.4)

                            tooltip.transition()
                                   .style('opacity', 0)
                         })
        var total = 0
        if (element === 'profanities') {
            circles.attr("r", function(d) {
                total = total + d[1].length
            return parseInt(d[1].length) + 1.5;
            })
        } else {
            circles.attr("r", function(d) {
            total = total + parseInt(d[1])
            return parseInt(d[1]) + 1.5;
            })
        }

        d3.select("#" + element + "_movie_" + i)
          .append("div")
          .attr("height", height)
          .html('<p class="total">Total: ' + total + '</p>')
    }
  })
}

var tooltip = d3.select('body')
            .append('div')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('padding', '2px 2px 2px 2px')
            .style('border', '1px #333 solid')
            .style('opacity', '0')
            .style('font', '12px Century Gothic, sans-serif')

// Duration of each movies in minutes
var duration_movies = [99, 154, 154, 111, 137, 153, 165]

var width = 1000,
    height = 60;

// 165 is the duration in minutes
// of the longest movie (Django Unchained)
var movieScale = d3.scaleLinear().range([0, 950])
                                   .domain([0, 165])
                    
create_svg("resources/words_per_movies.json", "profanities")
create_svg("resources/deaths_per_movies.json", "deaths")