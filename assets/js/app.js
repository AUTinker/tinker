---
---
(function($, window) {
    $(document).ready(function() {
        var hl, pathname;
        pathname = window.location.pathname.split('/');
        hl = pathname[pathname.length - 2];
        if ('/' === hl) {
            hl = '/';
        }
        $('a[href="/' + hl + '"]').parent().attr('class', 'active');

        if ('trend' == hl) {
            {% include js/trend.js %}
            trend();
        } else if ('map' == hl) {
            {% include js/worldmap.js %}
            worldmap();
        }
    });

})(jQuery, window);
