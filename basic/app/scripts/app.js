jQuery(document).ready(function($){
	

	/* HEADER */

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

		 	$('header[role=banner]').toggleClass('opened');
		 });
	}



	/* end of HEADER */

});