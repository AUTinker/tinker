usamap = ->
    size = [960, 460]
    margin =
        top: -100
        right: 0
        bottom: 0
        left: 0
    width = size[0] - margin.left - margin.right
    height = size[1] - margin.top - margin.bottom
    scale = .7

    # console.log(width, height)

    projection = d3.geo.mercator()
        .scale(width * scale)
        .translate([width / 2, height / 2])

    # zoom = d3.behavior.zoom()
    #     .scaleExtent([.7, 4])
    #     .on('zoom', redraw)

    svg = d3.select('#canvas')
        .append('svg')
        .attr('width', size[0])
        .attr('height', size[1])
        # .call(zoom)
        .append('g')

    path = d3.geo.path()

    states = svg.append('g')
        .attr('id', 'states')
    counties = svg.append('g')
        .attr('id', 'counties')

    d3.json('/assets/data/us-states.json', (json) ->
        states.selectAll('path')
            .data(json.features)
            .enter().append('path')
            .attr('id', (d) -> d.properties.name )
            .attr('class', 'state-path')
            .attr('d', path)
    )

    d3.json('/assets/data/us-counties.json', (json) ->
        counties.selectAll('path')
            .data(json.features)
            .enter().append('path')
            .attr('id', (d) -> d.properties.FIP )
            .attr('class', 'county-path')
            .attr('d', path)
    )

    # redraw = ->
    #     svg.attr('transform', 'translate(' +
    #         zoom.translate() + ')scale(' +
    #         zoom.scale() + ')')
    #     scale = zoom.scale()

    # d3.json('/assets/data/us.json', (err, us) ->
    #     svg.insert('path', '.graticule')
    #         .datum(topojson.feature(us, us.objects.land))
    #         .attr('class', 'land')
    #         .attr('d', path)

    #     svg.insert('path', '.graticule')
    #         .datum(topojson.mesh(us, us.objects.counties, (a, b) ->
    #             a != b && !(a.id / 1000 ^ b.id / 1000)
    #         ))
    #         .attr('class', 'county-boundary')
    #         .attr('d', path)

    #     svg.insert('path', '.graticule')
    #         .datum(topojson.mesh(us, us.objects.states, (a, b) ->
    #             a != b
    #         ))
    #         .attr('class', 'state-boundary')
    #         .attr('d', path)
    # )
