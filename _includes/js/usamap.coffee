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

    projection = d3.geo.mercator()
        .scale(width * scale)
        .translate([width / 2, height / 2])

    svg = d3.select('#canvas')
        .append('svg')
        .attr('width', size[0])
        .attr('height', size[1])
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
            .attr('class', 'statepath')
            .attr('d', path)
    )

    d3.json('/assets/data/us-counties.json', (json) ->
        counties.selectAll('path')
            .data(json.features)
            .enter().append('path')
            .attr('id', (d) -> d.properties.NAME)
            .attr('class', 'countypath')
            .attr('d', path)
    )
