usamap = ->
    WIDTH = 960
    HEIGHT = 460

    projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([WIDTH / 2, HEIGHT / 2])

    path = d3.geo.path()
        .projection(projection)

    svg = d3.select('#canvas').append('svg')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)

    d3.json('assets/data/us.json', (err, us) ->
        svg.insert('path', '.graticule')
            .datum(topojson.feature(us, us.objects.land))
            .attr('class', 'land')
            .attr('d', path)

        svg.insert('path', '.graticule')
            .datum(topojson.mesh(us, us.objects.counties, (a, b) ->
                a != b && !(a.id / 1000 ^ b.id / 1000)
            ))
            .attr('class', 'county-boundary')
            .attr('d', path)

        svg.insert('path', '.graticule')
            .datum(topojson.mesh(us, us.objects.states, (a, b) ->
                a != b
            ))
            .attr('class', 'state-boundary')
            .attr('d', path)
    )

    d3.select(self.frameElement).style('height', HEIGHT+'px')
