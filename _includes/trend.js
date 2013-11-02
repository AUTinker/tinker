var trend = function(conf) {
    this.conf = conf;
};

trend.prototype.bind_handlers = function() {
};

trend.prototype.init = function() {
    this.bind_handlers();
};


$(window).load(function() {
    var conf = {};
    conf.div_id_graph = 'trend_graph';
    conf.div_id_root = 'trend';
    trend = new trend(conf);
    trend.init();
    console.log(trend);
});
