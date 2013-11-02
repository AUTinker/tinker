(($, window) ->
    $(document).ready ->
        pathname = window.location.pathname.split('/');
        hl = pathname[pathname.length-2];
        if '/' == hl
             hl = '/';
        $('a[href="/' + hl + '"]').parent().attr('class', 'active');
        return
    return
)(jQuery, window)
