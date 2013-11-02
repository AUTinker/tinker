---
---
(function() {
    (function($, window) {
        $(document).ready(function() {
            var hl, pathname;
            pathname = window.location.pathname.split('/');
            hl = pathname[pathname.length - 2];
            if ('/' === hl) {
                hl = '/';
            }
            $('a[href="/' + hl + '"]').parent().attr('class', 'active');

            trend();
            usamap();
        });

        {% include trend.js %}
        {% include usamap.js %}

    })(jQuery, window);

}).call(this);
