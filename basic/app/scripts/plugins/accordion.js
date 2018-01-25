$(".js-accordion--tab").on('click', function(e){
  e.preventDefault();
  e.stopPropagation();

	var $this = $(this);
	var c = 'opened';

	if( $this.hasClass(c) )
		$this.removeClass(c);
	else
		$this.addClass(c);

	var $tab = $this.next('.js-accordion--tabContent');

  	if( $tab.hasClass(c) )
		$tab.removeClass(c);
	else
		$tab.addClass(c);
});