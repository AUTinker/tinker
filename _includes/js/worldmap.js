// Generated by CoffeeScript 1.6.3
var worldmap;

worldmap = function() {

    slider = $('.slider').slider({
        value: 1996,
        min: 1996,
        max: 2004
    }).on('slideStop', sliderStop).data('slider');

    var yearmin = $('#yearmin');
    var yearmax = $('#yearmax');
    var yearcur = $('#yearcur');

    function sliderStop() {
        yearcur.text(slider.value[0]);
        $.ajax({
            type: 'GET',
            url: '/query/index.php?r=states/' + $('#worldmap label.active>input').attr('id'),
            data: {
                year: slider.value[0]
            },
            dataType: 'json'
        }).done(function (json) {
            var fmt = {};
            for (var i = 0; i < json.length; ++i)
                fmt[$.trim(json[i]['key'])] = json[i]['values'][0][1];
            redraw(fmt);
        });
    }

    $('#total').parent('label').addClass('active');

    var isredraw = false;

    // $.ajax({
    //     type: 'GET',
    //     url: '/query/index.php?r=states/yearrange',
    //     dataType: 'json'
    // }).done(function (json) {

    //     slider = $('.slider').slider({
    //         value: json.min,
    //         min: json.min,
    //         max: json.max
    //     }).on('slideStop', sliderStop).data('slider');
    //     yearmin.text(json.min);
    //     yearmax.text(json.max);
    //     yearcur.text(json.min);

    //     $.ajax({
    //         type: 'GET',
    //         url: '/query/index.php?r=states',
    //         data: {
    //             gender: 'total',
    //             year: slider.value[0]
    //         },
    //         dataType: 'json'
    //     }).done(function (json) {
    //         isredraw = true;
    //         var fmt = {};
    //         for (var i = 0; i < json.length; ++i)
    //             fmt[$.trim(json[i]['key'])] = json[i]['values'][0][1];
    //         redraw(fmt);
    //     });
    // });

    $.ajax({
        type: 'GET',
        url: '/query/index.php?r=states/' + 'total',
        data: {
            year: slider.value[0]
        },
        dataType: 'json'
    }).done(function (json) {
        isredraw = true;
        var fmt = {};
        for (var i = 0; i < json.length; ++i)
            fmt[$.trim(json[i]['key'])] = json[i]['values'][0][1];
        redraw(fmt);
    });

    var map = L.map('worldmap-map').setView([37.8, -96], 4);
    var Stamen_TonerLite = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20
    }).addTo(map);

    var scale = 1000;
    var stateLayer = false;
    var worldLayer = false;
    var legendCtrl = false;
    var infoCtrl = false;

    if (!isredraw) redraw();

    $('#worldmap input[type=radio]').change(function () {
        $.ajax({
            type: 'GET',
            url: '/query/index.php?r=states/' + this.id,
            data: {
                year: slider.value[0]
            },
            dataType: 'json'
        }).done(function (json) {
            var fmt = {};
            for (var i = 0; i < json.length; ++i)
                fmt[$.trim(json[i]['key'])] = json[i]['values'][0][1];
            redraw(fmt);
        });
    });

    function redraw(json) {
        json = typeof json !== 'undefined' ? json : false;

        if (worldLayer) map.removeLayer(worldLayer);
        if (stateLayer) map.removeLayer(stateLayer);
        if (infoCtrl) map.removeControl(infoCtrl);
        if (legendCtrl) map.removeControl(legendCtrl);

        infoCtrl = L.control();
        infoCtrl.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
        infoCtrl.update = function (props) {
            this._div.innerHTML = '<h4>Data Density</h4>' +
                (props ? '<b>' + props.name + '</b><br />' +
                 (json ? json[props.name] :
                  props.hasOwnProperty('density') ? props.density : 'unavailable') + ' &permil;'
                 : ('Hover over a ' + (map.getZoom() > 3 ? 'state' : 'country')));
        };
        map.addControl(infoCtrl);

        var scaleval = [];
        var sum = 0, state;
        for (state in json)
            sum += json[state];

        for (state in json)
            scaleval.push({ state: json[state]*scale/sum });

        // get color depending on density value
        function getColor(d) {
            return d > 800 ? '#800026' :
                d > 500  ? '#BD0026' :
                d > 200  ? '#E31A1C' :
                d > 100  ? '#FC4E2A' :
                d > 50   ? '#FD8D3C' :
                d > 20   ? '#FEB24C' :
                d > 10   ? '#FED976' :
                '#FFEDA0';
        }

        function style(feature) {
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7,
                fillColor: getColor(json ? json[feature.properties.name] :
                                    (feature.properties.hasOwnProperty('density') ?
                                     feature.properties.density : 'unavailable' ))
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }

            infoCtrl.update(layer.feature.properties);
        }

        function resetHighlight(e) {
            stateLayer.resetStyle(e.target);
            infoCtrl.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        stateLayer = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        worldLayer = L.geoJson(countriesData, {
            style: style,
            onEachFeature: onEachFeature
        });

        function zoomEnd(e) {
            zoom = map.getZoom();
            if (zoom <= 3) {
                map.removeLayer(stateLayer);
                worldLayer.addTo(map);
            }
            if (zoom > 3) {
                map.removeLayer(worldLayer);
                stateLayer.addTo(map);
            }
            infoCtrl.update();
        };

        map.on({zoomend: zoomEnd});
        map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');
        map.attributionControl.addAttribution('Sutdent data &copy; <a href="http://auburn.edu/">Auburn University</a>');

        legendCtrl = L.control({position: 'bottomright'});
        legendCtrl.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10, 20, 50, 100, 200, 500, 800, 1000],
                labels = [],
                from, to;

            for (var i = 0; i < grades.length-1; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                        from + '&ndash;' + to);
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };
        legendCtrl.addTo(map);
    };
};
