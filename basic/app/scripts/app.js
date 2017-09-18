jQuery(document).ready(function($){


    // Fallback for svg logo

    if(!Modernizr.svg) {
        $.each($('img[src$="svg"][data-srcfb]'),
        function() {
          var element = $(this);
          element.attr('src', element.attr('data-srcfb'));
        });
    }




    // Slider

    var images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
    var currimg = 0;
    var obj = $('#back');
    var animationID;


    function loadimg(){

       obj.animate({ opacity: 1 }, 2000, function(){

          
            obj.animate({ opacity: 0 }, 700, function(){

                currimg++;

                if(currimg > images.length-1){

                    currimg=0;

                }

                var newimage = images[currimg];
                console.log(currimg);        
                obj.css("background-image", "url(assets/i/banners/"+newimage+")"); 


                obj.animate({ opacity: 1 }, 1500, function(){
                    animationID = requestAnimationFrame(loadimg);
                });

            });

        });

    }


    animationID = requestAnimationFrame(loadimg);


});