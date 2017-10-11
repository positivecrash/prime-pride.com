$(".js-accordion--tab").on('click', function(e){
  e.preventDefault();
  e.stopPropagation();
  $(this).next('.js-accordion--tabContent').toggle(400);
});