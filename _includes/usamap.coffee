usamap = ->
    countyMapZoom = d3.behavior.zoom()
    	.scaleExtent([.7, 4])
    	.on('zoom', redrawCountyMap)

    countyMapSvg = d3.select('#canvas')
    	.append('svg')
    	.call(countyMapZoom)
    	.append('g')

    states = countyMapSvg.append('g')
        .attr('id', 'states')

    countyMapPath = d3.geo.path();

    d3.json('/assets/data/us-states.json', (json) ->
        states.selectAll('path')
            .data(json.features)
            .enter().append('path')
            .attr('d', countyMapPath)
        return
    );

    redrawCountyMap = ->
        countyMapSvg.attr('transform', 'translate('+countyMapZoom.translate()+')scale('+countyMapZoom.scale()+')')
        scale = countyMapZoom.scale()
        # $('.county-path')
        return
