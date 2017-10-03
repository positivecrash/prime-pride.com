$.fn.countTo = function (options) {

    var settings = $.extend({
        duration: 1000,
        classStart: 'countto-start'
    }, options);

    return this.each(function () {
        var $this = $(this);
        var countTo = $this.attr('data-countTo');

        $this.addClass(settings.classStart);


        $({ countNum: $this.text() }).animate(
        {
            countNum: countTo
        },
        {
            duration: settings.duration,
            easing: 'linear',
            step: function () {
                $this.text(Math.ceil(this.countNum));
            },
            complete: function () {
                $this.text(countTo);
            }
        });
   
        
    });
};