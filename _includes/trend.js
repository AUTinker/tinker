var Trend = function(conf) {
    this.conf = conf;
};

Trend.prototype.bind_handlers = function() {
};

Trend.prototype.init = function() {
    this.bind_handlers();
    console.log(this.mock_data());
    this.graph_states();
};

Trend.prototype.graph_states = function () {
    var self = this;
    nv.addGraph(function() {
        var chart = nv.models.stackedAreaChart()
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1]; })
            .clipEdge(true);
        chart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
        chart.yAxis.tickFormat(d3.format(',.2f'));
        d3.select('#' + self.conf.div_id_graph + ' svg').datum(self.mock_data()).transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

Trend.prototype.mock_data = function() {
    var list = [];
    var states = ['AL', 'CA', 'GA', 'NY'];
    var years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013];
    for (var state_index in states) {
        var entry = {};
        entry["key"] = states[state_index];
        entry["values"] = [];
        for (var year_index in years) {
            entry["values"].push([new Date(years[year_index], 6, 15, 1, 1, 1, 1).getTime(), 100 * Math.random()]);
        }
        list.push(entry);
    }
    return list;
};


function trend() {
    var conf = {};
    conf.div_id_graph = 'trend_graph';
    conf.div_id_root = 'trend';
    t = new Trend(conf);
    t.init();
    console.log(t);
}
