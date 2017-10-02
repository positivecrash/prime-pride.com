$.fn.datahover = function (options) {

    var settings = $.extend({
        hoverEl: '[data-hover]',
        contentEl: '.data-hover--content',
        activeClass: 'data-hover--active'
    }, options);


    return this.each(function () {
        var $container = $(this);
        var $content;
        var $this;

        $container.find(settings.hoverEl).each(function(){
            $this = $(this);

            if ( $this.hasClass(settings.activeClass) )
            {
                $content = $this.data('hover');
                $($content).addClass(settings.activeClass);
                return;
            }
        });

        $container.find(settings.hoverEl).on({
            mouseenter: function(){
                $this = $(this);
                $content = $this.data('hover');

                if(!$this.hasClass(settings.activeClass))
                {
                    $container.find(settings.contentEl).each(function(){
                        $(this).removeClass(settings.activeClass);
                    });

                    $container.find(settings.hoverEl).each(function(){
                        $(this).removeClass(settings.activeClass);
                    });

                    $this.addClass(settings.activeClass);
                    $($content).addClass(settings.activeClass);
                }

                
            }
        });
        
    });
};