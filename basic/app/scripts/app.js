jQuery(document).ready(function($){

	var $w = $(window);
	

	/* HEADER */

	var $header = $('header[role=banner]');

	/* Set equal height for submenu's back */
	if ( $('header[role="banner"] .dropdown').length > 0 )
	{
		var dd_h = 0;

		$('header[role="banner"] .dropdown').each(function(){
			if ( $(this).outerHeight(true) > dd_h )
				dd_h = $(this).outerHeight(true);
		});

		$('header[role="banner"] .dropdown .dropdown_back').height(dd_h);
	}


	/* Mobile navigation toggler */
	if ( $('#header-mobileTog').length > 0 )
	{
		 $('#header-mobileTog').on('click', function(e){
		 	e.preventDefault();
		 	e.stopPropagation();

		 	$header.toggleClass('opened');
		 });
	}



	/* Set padding for main in case of there is wrong in styles */
	if ( $header.length > 0 )
	{
		var $main = $('main[role="main"]');

		$main.css('padding-top', $header.outerHeight());

		$w.on('resize', function(){
			$main.css('padding-top', $header.outerHeight());
		});
	}


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

	/* end of INDEX PAGE */

});