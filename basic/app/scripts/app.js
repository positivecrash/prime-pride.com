jQuery(document).ready(function($){
	

	/* SET EQUAL HEIGHT FOR SUBMENU'S BACK */
	if ( $('header[role="banner"] .dropdown').length > 0 )
	{
		var dd_h = 0;

		$('header[role="banner"] .dropdown').each(function(){
			if ( $(this).outerHeight(true) > dd_h )
				dd_h = $(this).outerHeight(true);
		});

		$('header[role="banner"] .dropdown .dropdown_back').height(dd_h);
	}


});