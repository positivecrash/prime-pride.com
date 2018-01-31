jQuery(document).ready(function($){

	var $w = $(window);


	/* BASIC */

	/* set equal height */

	function set_height(source, set, outer){
		var counter = 0;

		$(source).each(function(){
			if ( outer ){
				if ( $(this).outerHeight(true) > counter )
					counter = $(this).outerHeight(true);
			}
			else
			{
				if ( $(this).height() > counter )
					counter = $(this).height();
			}
		});

		$(set).height(counter);
	}

	/* end of BASIC */
	

	

	/* HEADER */

	var $header = $('header[role=banner]');

	/* Set equal height for submenu's back */
	if ( $('header[role="banner"] .dropdown').length > 0 )
		set_height('header[role="banner"] .dropdown', 'header[role="banner"] .dropdown .dropdown_back', true);


	/* Mobile navigation toggler */
	if ( $('#header-mobileTog').length > 0 )
	{
		 $('#header-mobileTog').on('click', function(e){
		 	e.preventDefault();
		 	e.stopPropagation();

		 	$header.toggleClass('opened');
		 });
	}



	$('.a-dontClick').on('click', function(e){
		e.preventDefault();
	 	e.stopPropagation();
	});


	/* Set padding for main in case of there is wrong in styles */
	// if ( $header.length > 0 )
	// {
	// 	var $main = $('main[role="main"]');

	// 	$main.css('padding-top', $header.outerHeight());

	// 	$w.on('resize', function(){
	// 		$main.css('padding-top', $header.outerHeight());
	// 	});
	// }


	/* end of HEADER */



	/* INDEX PAGE */

	if ( $('#index-slider').length > 0 )
	{
		$('#index-slider').AnySlide({
			loadFirst: 'img',
			autoplay: true,
			loop: true,
			autoHover: false,
			pause: 12000
		});
	}


	if ( $('#index-items').length > 0 )
	{
		$('#index-items').datahover();
	}



	/* Count Numbers Effect */

	$('.js-countto').one('inview', function(event, isInView){
        if (isInView)
            $(this).countTo();
    });




	/* Scroll Page Up */
	$('.js-scrollUp').on('click', function(e){
		e.preventDefault();
	 	e.stopPropagation();
		 	
	    $('html, body').animate({scrollTop: $('main[role="main"]').offset().top }, 1000);
	  });


	/* Smooth Scroll */
	$('.js-scroll').on('click', function(e){
		e.preventDefault();
	 	e.stopPropagation();

	 	var scrollID = $(this).attr('href');

	 	// var test = $scrollTo.html();
	 	// console.log(test);
		 	
	    $('html, body').animate({scrollTop: $(scrollID).offset().top - 150 }, 1000);
	  });

	/* end of INDEX PAGE */



	/* CATALOG */

	/* Set equal height for title of item */
	var catItemTitle = '#catalog-items--list .catalog-item--title';

	if ( $(catItemTitle).length > 0 ){
		set_height(catItemTitle, catItemTitle, false);

		$w.on('resize', function(){
			set_height(catItemTitle, catItemTitle, false);
		});
	}


	/* Item slide */
	if ( $('.anyslide-img').length > 0 )
	{
		$('.anyslide-img').AnySlide({
			loadFirst: 'img',
			loop: true
		});
	}

	/* end of CATALOG */


	/* Set equal height for titles in Contacts section */
	/* Set equal height for title of item */
	var contactsTitle = '.contacts h3';

	if ( $(contactsTitle).length > 0 ){
		set_height(contactsTitle, contactsTitle, false);

		$w.on('resize', function(){
			set_height(contactsTitle, contactsTitle, false);
		});
	}
});