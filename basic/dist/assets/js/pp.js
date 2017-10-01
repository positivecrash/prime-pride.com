/**
 * AnySlide v 1.0
 * Copyright 2017 Anastasiia Bakai (positivecrash)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */


(function($) {

  var defaults = {

      // GENERAL
      content: '.js-slider-viewport',
      contentEl: 'div',
      classActive: 'active',  // this class for both – tabs and content
      loadFirst: false,   // should we check if all element in content of slider is loaded. There should be a selector in parametr
      anchorSupport: false,  //it is only for NOT single content so far
      loop: false, // If true, clicking "Next" while on the last slide will transition to the first slide and vice-versa
      autoplay: false, // Autoplay, Slides will automatically transition
      pause: 4000, //Autoplay pause, The amount of time (in ms) between each auto transition
      autoHover: true, //Auto show will pause when mouse hovers over slider

      // PAGER
      tab: '.js-slider-pager',
      tabEl: 'a',

      // CONTROLS
      controls: '.js-slider-controls',
      controlsPrev: '.prev',
      controlsNext: '.next',
      controlDisabled: 'disabled', //Class for non-active control (when no content to show further)


      //FOR SLIDER WITH ONE BLOCK FOR CONTENT
      singleContainer: false,  // if true – all content in one selector (e.g. for parallax effects)
      classSlide: 'slide_',
      classPrevSlide: 'prevslide_',

      //FOR SLIDER THAT SETUP TO SCROLL TOP WHILE CHANGING TAB
      scrollTop: false,
      scrollTopDelay: 1000,  //how long to wait till scroll tab to top
      scrollTopSpeed: 400,   // scroll top speed
      mobileViewPort: 500,  // max width for mobile screens
      desktopOffset: 50,    // how much height from top while scrolling tab for desktop
      mobileOffset: 100,    // how much height from top while scrolling tab for mobiles

      
      // CALLBACKS
      onSliderLoad: function(index) { return true; },
      onSlideChange: function(index) { return true; }
  };



  $.fn.AnySlide = function (options) {

  
    if (this.length < 1)
            return;

    // support multiple elements
    if (this.length > 1) {
      this.each(function() {
        $(this).AnySlide(options);
      });
      return this;
    }



    // create a namespace to be used throughout the plugin
    var slider = {},

    // set a reference to slider element
    el = this,

    $w = $(window);




    var init = function() {

      // Return if slider is already initialized
      if ($(el).data('AnySlide')) { return; }


      // merge user-supplied options with the defaults
      slider.config = $.extend({}, defaults, options);

      // store tabs
      slider.tab = el.children(slider.config.tab).children(slider.config.tabEl);

      // store containers for content
      slider.content = el.children(slider.config.content).children(slider.config.contentEl);

      // store container for controls
      slider.controls = el.children(slider.config.controls);

      // used if singleContainer == true
      slider.activeslide = 'init';

      // number of slides
      slider.length = countSlides();


      //detect show tabs or not
      if (slider.tab.length > 0){
        slider.hastabs = true
      }

      //detect show content or not
      if (slider.content.length > 0){
        slider.hascontent = true
      }

      //detect if there are controls
      if (slider.controls.length > 0){
        slider.hascontrols = true;
      }


      // check if there are some element that need to be preloaded
      if ( slider.config.loadFirst ){

        // get all items for checking
        var items = slider.content.find(slider.config.loadFirst);
        var itemslen = items.length;
        var itemsLoaded = 0;


        // if we have smth to preload
        if ( itemslen > 0 )
        {
          // hide sontent, show loader
          contentHide(0);

          
          // check loading for each item
          items.each(function(){

            var $o = $(this);

            //check if the object is already on cache
            if($o.prop('complete'))
            {
              contentShow(1000);
              setup();
            }
            else
            {
              $o.one('load', function(){
                itemsLoaded++;

                if ( itemsLoaded == itemslen ){
                  contentShow();
                  setup();
                }
              });
            }

          });
        }
        // if there are no elements for preloading
        else
        {
          contentShow(500);
          setup();
        }


      }
      // if no need to preload anything
      else{
        setup();
      }



      // Show page from start if there is a hash in the url
      if ( slider.config.anchorSupport ){

        $('html, body').animate({
            scrollTop: 0
        }, 0.2);
      }

    }



    var setup = function() {

      getActiveSlide();

     // 1. show default slide
      show(slider.activeslide);

    // 2. if there is autoplay set up
      if (slider.config.autoplay)
        initAuto(slider.activeslide);
      // else
      //   show(slider.activeslide);

      // 2.  watch for changes and show another slide if needed
      action();

      // 3. onSliderLoad callback
      slider.config.onSliderLoad.call(el, slider.activeslide);

    }


    var show = function(index) {

      setActiveIndex(index);

      if ( slider.hascontent ){
        showContent(index);
      }

      if ( slider.hastabs ){
        showTab(index);
      }

      if ( slider.config.scrollTop ){
        scrollTop();
      }

      if ( slider.hascontrols ){
        controlsState();
      }


      // onSlideChange callback
      slider.config.onSlideChange.call(el, index);

    }



    var startAuto = function(startIndex) {

      // if an interval already exists, disregard call
      if (slider.interval) { return; }

      var index = startIndex;
      slider.play = true;


      // create an interval
      slider.interval = setInterval(function() {

        if ( index < (slider.length - 1) ){
          index++;
          slider.play = true;
        }
        else{
          if ( slider.config.loop ){
            index = 0;
            slider.play = true;
          }
          else
            stopAuto();
        }

        if ( slider.play )
          show(index);

        
      }, slider.config.pause);

    }


    var stopAuto = function(){
      // if no interval exists, disregard call
      if (!slider.interval) { return; }

      clearInterval(slider.interval);
      slider.interval = null; //reset

      slider.play = false;
    }



    var initAuto = function(startIndex) {
      startAuto(startIndex);

      if ( slider.config.autoHover ){
        el.on({
          mouseenter: function () {
            slider.autoplayPaused = true;
            stopAuto();
          },
          mouseleave: function () {
            if ( slider.autoplayPaused ){
              startAuto(slider.activeslide);
              slider.autoplayPaused = null; //reset
            }
          }
        });
      }

    }






    var action = function(){


      // If slider has tabs, detect action on tabs

      if ( slider.hastabs ){

        slider.tab.on('click', function(e){

          e.preventDefault();
          e.stopPropagation();

          show($(this).index());

        });
      }


      if ( slider.hascontrols ){
        controlsAction();
      }

    }




    var contentHide = function(timeout) {

        setTimeout(function(){
          // wrap content with help selector
          el.children(slider.config.content).wrapInner('<div class="anyslide-content"></div>');

          // add loader
          el.children(slider.config.content).prepend('<div class="anyslide-loader"></div>');

          // hide content selector
          el.children(slider.config.content).find('.anyslide-content').hide();

        }, timeout);

    }


    var contentShow = function(timeout) {

        setTimeout(function(){
          el.children(slider.config.content).find('.anyslide-loader').remove();
          el.children(slider.config.content).find('.anyslide-content').fadeIn();
        }, timeout);

    }



    var getSlideByUrl = function(){
      var hash = window.location.hash.substring(1);
      var index = 0;

      if (hash){

        slider.content.each(function(){
          if ( $(this).attr('id') == hash )
            index = $(this).index();
        });

      }

      return index;

    }


    var getActiveSlide = function() {

      if ( slider.config.anchorSupport ){
        setActiveIndex ( getSlideByUrl() );
      }
      else{
          if ( el.data('activeslide') )
            setActiveIndex ( el.data('activeslide') );
          else
            setActiveIndex(0);
      }

      return slider.activeslide;
    }




    var setActiveIndex = function(index) {
      slider.prevslide = slider.activeslide;
      slider.activeslide = index;

      if ( slider.config.anchorSupport ){

        // Show page from start if there is a hash in the url
        // $('html, body').animate({
        //     scrollTop: 0
        // }, 300);


        window.location.hash = slider.content.eq(index).attr('id');

      }
    }


    var addActiveClass = function(object, index){

      object.each(function(){
          $(this).removeClass(slider.config.classActive);
      });

      object.eq(index).addClass(slider.config.classActive);
    }




    var countSlides = function(){
      var count = 0;

      // For parrallax effects we need all content in one slide technically
      if ( slider.config.singleContainer ){   
          if ( el.data('anyslide') ){
            attr = el.data('anyslide').split(' ');

            for( var i = 0; i < attr.length; ++i ){
              // find an element in our 'attr' array which contains word 'total'
              if( attr[i].indexOf( 'total' ) >= 0 ){
                count = attr[i].split('-')[1]; // get 2 element in array ['total', 'some number']
              }
            }

          }
      }
      // If there is normal content separated with some selectors (by default <div>)
      else{
         slider.content.each(function(){
          count++;
         });
      }

      return count;
    }


    var scrollTop = function(){

        // set offset for better viewing
        var offset = 0;

        if ($w.width() > slider.config.mobileViewPort ){
          offset = $(el).offset().top - slider.config.desktopOffset;
        }
        else{
          offset = $(el).offset().top - slider.config.mobileOffset;
        }


        $('html, body')
          .delay(slider.config.scrollTopDelay)
          .animate({scrollTop: offset }, slider.config.scrollTopSpeed);

    }



    var showContent = function(index) {


      // For parrallax effects we need all content in one slide technically
      if ( slider.config.singleContainer ){
          slider.content
            .removeClass() //remove all classes before
            .addClass(slider.config.classSlide+index)  //add class of active slide
            .addClass(slider.config.classPrevSlide+slider.prevslide);  //add class for previous slider (e.g. to setup specific styles for diferrent directions)
            

      }
      // If there is normal content separated with some selectors (by default <div>)
      else{
        addActiveClass(slider.content, index);
      }

    }



    var showTab = function(index){
      addActiveClass(slider.tab, index);
    }


    var controlsState = function(){

      //Checks state for previous control
      if ( !slider.config.loop && slider.activeslide == 0 )
        slider.controls.find(slider.config.controlsPrev).addClass(slider.config.controlDisabled);
      else
        slider.controls.find(slider.config.controlsPrev).removeClass(slider.config.controlDisabled);

      
      //Checks state for next control
      if ( !slider.config.loop && slider.activeslide == (slider.length - 1) )
        slider.controls.find(slider.config.controlsNext).addClass(slider.config.controlDisabled);
      else
        slider.controls.find(slider.config.controlsNext).removeClass(slider.config.controlDisabled);
      
    }



    var controlsAction = function(){
      
     
      slider.controls.find(slider.config.controlsPrev).on('click', function(e){

        e.preventDefault();
        e.stopPropagation();

        var prevSlide = 0;


        if ( slider.activeslide == 0 ){
          if ( slider.config.loop )
            prevSlide = slider.length-1;
          else
            return;
        }
        else{
          prevSlide = slider.activeslide - 1;
        }


        show(prevSlide);


      });


      slider.controls.find(slider.config.controlsNext).on('click', function(e){

        e.preventDefault();
        e.stopPropagation();


        var nextSlide = 0;


        if ( slider.activeslide == (slider.length - 1)){
          if ( slider.config.loop )
            nextSlide = 0;
          else
            return;
        }
        else{
          nextSlide = slider.activeslide + 1;
        }

        show(nextSlide);


      });

    }












    init();

    $(el).data('AnySlide', this);

    // returns the current jQuery object
    return this;

  };

})(jQuery);
/*
selectivizr v1.0.2 - (c) Keith Clark, freely distributable under the terms 
of the MIT license.

selectivizr.com
*/
/* 
  
Notes about this source
-----------------------

 * The #DEBUG_START and #DEBUG_END comments are used to mark blocks of code
   that will be removed prior to building a final release version (using a
   pre-compression script)
  
  
References:
-----------
 
 * CSS Syntax          : http://www.w3.org/TR/2003/WD-css3-syntax-20030813/#style
 * Selectors           : http://www.w3.org/TR/css3-selectors/#selectors
 * IE Compatability    : http://msdn.microsoft.com/en-us/library/cc351024(VS.85).aspx
 * W3C Selector Tests  : http://www.w3.org/Style/CSS/Test/CSS3/Selectors/current/html/tests/
 
*/

(function(win) {

	// If browser isn't IE, then stop execution! This handles the script 
	// being loaded by non IE browsers because the developer didn't use 
	// conditional comments.
	if (/*@cc_on!@*/true) return;

	// =========================== Init Objects ============================

	var doc = document;
	var root = doc.documentElement;
	var xhr = getXHRObject();
	var ieVersion = /MSIE (\d+)/.exec(navigator.userAgent)[1];
	
	// If were not in standards mode, IE is too old / new or we can't create
	// an XMLHttpRequest object then we should get out now.
	if (doc.compatMode != 'CSS1Compat' || ieVersion<6 || ieVersion>8 || !xhr) {
		return;
	}
	
	
	// ========================= Common Objects ============================

	// Compatiable selector engines in order of CSS3 support. Note: '*' is
	// a placholder for the object key name. (basically, crude compression)
	var selectorEngines = {
		"NW"								: "*.Dom.select",
		"MooTools"							: "$$",
		"DOMAssistant"						: "*.$", 
		"Prototype"							: "$$",
		"YAHOO"								: "*.util.Selector.query",
		"Sizzle"							: "*", 
		"jQuery"							: "*",
		"dojo"								: "*.query"
	};

	var selectorMethod;
	var enabledWatchers 					= [];     // array of :enabled/:disabled elements to poll
	var ie6PatchID 							= 0;      // used to solve ie6's multiple class bug
	var patchIE6MultipleClasses				= true;   // if true adds class bloat to ie6
	var namespace 							= "slvzr";
	
	// Stylesheet parsing regexp's
	var RE_COMMENT							= /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*/g;
	var RE_IMPORT							= /@import\s*(?:(?:(?:url\(\s*(['"]?)(.*)\1)\s*\))|(?:(['"])(.*)\3))[^;]*;/g;
	var RE_ASSET_URL 						= /\burl\(\s*(["']?)(?!data:)([^"')]+)\1\s*\)/g;
	var RE_PSEUDO_STRUCTURAL				= /^:(empty|(first|last|only|nth(-last)?)-(child|of-type))$/;
	var RE_PSEUDO_ELEMENTS					= /:(:first-(?:line|letter))/g;
	var RE_SELECTOR_GROUP					= /(^|})\s*([^\{]*?[\[:][^{]+)/g;
	var RE_SELECTOR_PARSE					= /([ +~>])|(:[a-z-]+(?:\(.*?\)+)?)|(\[.*?\])/g; 
	var RE_LIBRARY_INCOMPATIBLE_PSEUDOS		= /(:not\()?:(hover|enabled|disabled|focus|checked|target|active|visited|first-line|first-letter)\)?/g;
	var RE_PATCH_CLASS_NAME_REPLACE			= /[^\w-]/g;
	
	// HTML UI element regexp's
	var RE_INPUT_ELEMENTS					= /^(INPUT|SELECT|TEXTAREA|BUTTON)$/;
	var RE_INPUT_CHECKABLE_TYPES			= /^(checkbox|radio)$/;

	// Broken attribute selector implementations (IE7/8 native [^=""], [$=""] and [*=""])
	var BROKEN_ATTR_IMPLEMENTATIONS			= ieVersion>6 ? /[\$\^*]=(['"])\1/ : null;

	// Whitespace normalization regexp's
	var RE_TIDY_TRAILING_WHITESPACE			= /([(\[+~])\s+/g;
	var RE_TIDY_LEADING_WHITESPACE			= /\s+([)\]+~])/g;
	var RE_TIDY_CONSECUTIVE_WHITESPACE		= /\s+/g;
	var RE_TIDY_TRIM_WHITESPACE				= /^\s*((?:[\S\s]*\S)?)\s*$/;
	
	// String constants
	var EMPTY_STRING						= "";
	var SPACE_STRING						= " ";
	var PLACEHOLDER_STRING					= "$1";

	// =========================== Patching ================================

	// --[ patchStyleSheet() ]----------------------------------------------
	// Scans the passed cssText for selectors that require emulation and
	// creates one or more patches for each matched selector.
	function patchStyleSheet( cssText ) {
		return cssText.replace(RE_PSEUDO_ELEMENTS, PLACEHOLDER_STRING).
			replace(RE_SELECTOR_GROUP, function(m, prefix, selectorText) {	
    			var selectorGroups = selectorText.split(",");
    			for (var c = 0, cs = selectorGroups.length; c < cs; c++) {
    				var selector = normalizeSelectorWhitespace(selectorGroups[c]) + SPACE_STRING;
    				var patches = [];
    				selectorGroups[c] = selector.replace(RE_SELECTOR_PARSE, 
    					function(match, combinator, pseudo, attribute, index) {
    						if (combinator) {
    							if (patches.length>0) {
    								applyPatches( selector.substring(0, index), patches );
    								patches = [];
    							}
    							return combinator;
    						}		
    						else {
    							var patch = (pseudo) ? patchPseudoClass( pseudo ) : patchAttribute( attribute );
    							if (patch) {
    								patches.push(patch);
    								return "." + patch.className;
    							}
    							return match;
    						}
    					}
    				);
    			}
    			return prefix + selectorGroups.join(",");
    		});
	};

	// --[ patchAttribute() ]-----------------------------------------------
	// returns a patch for an attribute selector.
	function patchAttribute( attr ) {
		return (!BROKEN_ATTR_IMPLEMENTATIONS || BROKEN_ATTR_IMPLEMENTATIONS.test(attr)) ? 
			{ className: createClassName(attr), applyClass: true } : null;
	};

	// --[ patchPseudoClass() ]---------------------------------------------
	// returns a patch for a pseudo-class
	function patchPseudoClass( pseudo ) {

		var applyClass = true;
		var className = createClassName(pseudo.slice(1));
		var isNegated = pseudo.substring(0, 5) == ":not(";
		var activateEventName;
		var deactivateEventName;

		// if negated, remove :not() 
		if (isNegated) {
			pseudo = pseudo.slice(5, -1);
		}
		
		// bracket contents are irrelevant - remove them
		var bracketIndex = pseudo.indexOf("(")
		if (bracketIndex > -1) {
			pseudo = pseudo.substring(0, bracketIndex);
		}		
		
		// check we're still dealing with a pseudo-class
		if (pseudo.charAt(0) == ":") {
			switch (pseudo.slice(1)) {

				case "root":
					applyClass = function(e) {
						return isNegated ? e != root : e == root;
					}
					break;

				case "target":
					// :target is only supported in IE8
					if (ieVersion == 8) {
						applyClass = function(e) {
							var handler = function() { 
								var hash = location.hash;
								var hashID = hash.slice(1);
								return isNegated ? (hash == EMPTY_STRING || e.id != hashID) : (hash != EMPTY_STRING && e.id == hashID);
							};
							addEvent( win, "hashchange", function() {
								toggleElementClass(e, className, handler());
							})
							return handler();
						}
						break;
					}
					return false;
				
				case "checked":
					applyClass = function(e) { 
						if (RE_INPUT_CHECKABLE_TYPES.test(e.type)) {
							addEvent( e, "propertychange", function() {
								if (event.propertyName == "checked") {
									toggleElementClass( e, className, e.checked !== isNegated );
								} 							
							})
						}
						return e.checked !== isNegated;
					}
					break;
					
				case "disabled":
					isNegated = !isNegated;

				case "enabled":
					applyClass = function(e) { 
						if (RE_INPUT_ELEMENTS.test(e.tagName)) {
							addEvent( e, "propertychange", function() {
								if (event.propertyName == "$disabled") {
									toggleElementClass( e, className, e.$disabled === isNegated );
								} 
							});
							enabledWatchers.push(e);
							e.$disabled = e.disabled;
							return e.disabled === isNegated;
						}
						return pseudo == ":enabled" ? isNegated : !isNegated;
					}
					break;
					
				case "focus":
					activateEventName = "focus";
					deactivateEventName = "blur";
								
				case "hover":
					if (!activateEventName) {
						activateEventName = "mouseenter";
						deactivateEventName = "mouseleave";
					}
					applyClass = function(e) {
						addEvent( e, isNegated ? deactivateEventName : activateEventName, function() {
							toggleElementClass( e, className, true );
						})
						addEvent( e, isNegated ? activateEventName : deactivateEventName, function() {
							toggleElementClass( e, className, false );
						})
						return isNegated;
					}
					break;
					
				// everything else
				default:
					// If we don't support this pseudo-class don't create 
					// a patch for it
					if (!RE_PSEUDO_STRUCTURAL.test(pseudo)) {
						return false;
					}
					break;
			}
		}
		return { className: className, applyClass: applyClass };
	};

	// --[ applyPatches() ]-------------------------------------------------
	// uses the passed selector text to find DOM nodes and patch them	
	function applyPatches(selectorText, patches) {
		var elms;
		
		// Although some selector libraries can find :checked :enabled etc. 
		// we need to find all elements that could have that state because 
		// it can be changed by the user.
		var domSelectorText = selectorText.replace(RE_LIBRARY_INCOMPATIBLE_PSEUDOS, EMPTY_STRING);
		
		// If the dom selector equates to an empty string or ends with 
		// whitespace then we need to append a universal selector (*) to it.
		if (domSelectorText == EMPTY_STRING || domSelectorText.charAt(domSelectorText.length - 1) == SPACE_STRING) {
			domSelectorText += "*";
		}
		
		// Ensure we catch errors from the selector library
		try {
			elms = selectorMethod( domSelectorText );
		} catch (ex) {
			// #DEBUG_START
			log( "Selector '" + selectorText + "' threw exception '" + ex + "'" );
			// #DEBUG_END
		}


		if (elms) {
			for (var d = 0, dl = elms.length; d < dl; d++) {	
				var elm = elms[d];
				var cssClasses = elm.className;
				for (var f = 0, fl = patches.length; f < fl; f++) {
					var patch = patches[f];
					
					if (!hasPatch(elm, patch)) {
						if (patch.applyClass && (patch.applyClass === true || patch.applyClass(elm) === true)) {
							cssClasses = toggleClass(cssClasses, patch.className, true );
						}
					}
				}
				elm.className = cssClasses;
			}
		}
	};

	// --[ hasPatch() ]-----------------------------------------------------
	// checks for the exsistence of a patch on an element
	function hasPatch( elm, patch ) {
		return new RegExp("(^|\\s)" + patch.className + "(\\s|$)").test(elm.className);
	};
	
	
	// =========================== Utility =================================
	
	function createClassName( className ) {
		return namespace + "-" + ((ieVersion == 6 && patchIE6MultipleClasses) ?
			ie6PatchID++
		:
			className.replace(RE_PATCH_CLASS_NAME_REPLACE, function(a) { return a.charCodeAt(0) }));
	};

	// --[ log() ]----------------------------------------------------------
	// #DEBUG_START
	function log( message ) {
		if (win.console) {
			win.console.log(message);
		}
	};
	// #DEBUG_END

	// --[ trim() ]---------------------------------------------------------
	// removes leading, trailing whitespace from a string
	function trim( text ) {
		return text.replace(RE_TIDY_TRIM_WHITESPACE, PLACEHOLDER_STRING);
	};

	// --[ normalizeWhitespace() ]------------------------------------------
	// removes leading, trailing and consecutive whitespace from a string
	function normalizeWhitespace( text ) {
		return trim(text).replace(RE_TIDY_CONSECUTIVE_WHITESPACE, SPACE_STRING);
	};

	// --[ normalizeSelectorWhitespace() ]----------------------------------
	// tidies whitespace around selector brackets and combinators
	function normalizeSelectorWhitespace( selectorText ) {
		return normalizeWhitespace(selectorText.
			replace(RE_TIDY_TRAILING_WHITESPACE, PLACEHOLDER_STRING).
			replace(RE_TIDY_LEADING_WHITESPACE, PLACEHOLDER_STRING)
		);
	};

	// --[ toggleElementClass() ]-------------------------------------------
	// toggles a single className on an element
	function toggleElementClass( elm, className, on ) {
		var oldClassName = elm.className;
		var newClassName = toggleClass(oldClassName, className, on);
		if (newClassName != oldClassName) {
			elm.className = newClassName;
			elm.parentNode.className += EMPTY_STRING;
		}
	};

	// --[ toggleClass() ]--------------------------------------------------
	// adds / removes a className from a string of classNames. Used to 
	// manage multiple class changes without forcing a DOM redraw
	function toggleClass( classList, className, on ) {
		var re = RegExp("(^|\\s)" + className + "(\\s|$)");
		var classExists = re.test(classList);
		if (on) {
			return classExists ? classList : classList + SPACE_STRING + className;
		} else {
			return classExists ? trim(classList.replace(re, PLACEHOLDER_STRING)) : classList;
		}
	};
	
	// --[ addEvent() ]-----------------------------------------------------
	function addEvent(elm, eventName, eventHandler) {
		elm.attachEvent("on" + eventName, eventHandler);
	};

	// --[ getXHRObject() ]-------------------------------------------------
	function getXHRObject()
	{
		if (win.XMLHttpRequest) {
			return new XMLHttpRequest;
		}
		try	{ 
			return new ActiveXObject('Microsoft.XMLHTTP');
		} catch(e) { 
			return null;
		}
	};

	// --[ loadStyleSheet() ]-----------------------------------------------
	function loadStyleSheet( url ) {
		xhr.open("GET", url, false);
		xhr.send();
		return (xhr.status==200) ? xhr.responseText : EMPTY_STRING;	
	};
	
	// --[ resolveUrl() ]---------------------------------------------------
	// Converts a URL fragment to a fully qualified URL using the specified
	// context URL. Returns null if same-origin policy is broken
	function resolveUrl( url, contextUrl ) {
	
		function getProtocolAndHost( url ) {
			return url.substring(0, url.indexOf("/", 8));
		};
		
		// absolute path
		if (/^https?:\/\//i.test(url)) {
			return getProtocolAndHost(contextUrl) == getProtocolAndHost(url) ? url : null;
		}
		
		// root-relative path
		if (url.charAt(0)=="/")	{
			return getProtocolAndHost(contextUrl) + url;
		}

		// relative path
		var contextUrlPath = contextUrl.split(/[?#]/)[0]; // ignore query string in the contextUrl	
		if (url.charAt(0) != "?" && contextUrlPath.charAt(contextUrlPath.length - 1) != "/") {
			contextUrlPath = contextUrlPath.substring(0, contextUrlPath.lastIndexOf("/") + 1);
		}
		
		return contextUrlPath + url;
	};
	
	// --[ parseStyleSheet() ]----------------------------------------------
	// Downloads the stylesheet specified by the URL, removes it's comments
	// and recursivly replaces @import rules with their contents, ultimately
	// returning the full cssText.
	function parseStyleSheet( url ) {
		if (url) {
			return loadStyleSheet(url).replace(RE_COMMENT, EMPTY_STRING).
			replace(RE_IMPORT, function( match, quoteChar, importUrl, quoteChar2, importUrl2 ) { 
				return parseStyleSheet(resolveUrl(importUrl || importUrl2, url));
			}).
			replace(RE_ASSET_URL, function( match, quoteChar, assetUrl ) { 
				quoteChar = quoteChar || EMPTY_STRING;
				return " url(" + quoteChar + resolveUrl(assetUrl, url) + quoteChar + ") "; 
			});
		}
		return EMPTY_STRING;
	};
	
	// --[ init() ]---------------------------------------------------------
	function init() {
		// honour the <base> tag
		var url, stylesheet;
		var baseTags = doc.getElementsByTagName("BASE");
		var baseUrl = (baseTags.length > 0) ? baseTags[0].href : doc.location.href;
		
		/* Note: This code prevents IE from freezing / crashing when using 
		@font-face .eot files but it modifies the <head> tag and could
		trigger the IE stylesheet limit. It will also cause FOUC issues.
		If you choose to use it, make sure you comment out the for loop 
		directly below this comment.

		var head = doc.getElementsByTagName("head")[0];
		for (var c=doc.styleSheets.length-1; c>=0; c--) {
			stylesheet = doc.styleSheets[c]
			head.appendChild(doc.createElement("style"))
			var patchedStylesheet = doc.styleSheets[doc.styleSheets.length-1];
			
			if (stylesheet.href != EMPTY_STRING) {
				url = resolveUrl(stylesheet.href, baseUrl)
				if (url) {
					patchedStylesheet.cssText = patchStyleSheet( parseStyleSheet( url ) )
					stylesheet.disabled = true
					setTimeout( function () {
						stylesheet.owningElement.parentNode.removeChild(stylesheet.owningElement)
					})
				}
			}
		}
		*/
		
		for (var c = 0; c < doc.styleSheets.length; c++) {
			stylesheet = doc.styleSheets[c]
			if (stylesheet.href != EMPTY_STRING) {
				url = resolveUrl(stylesheet.href, baseUrl);
				if (url) {
					stylesheet.cssText = patchStyleSheet( parseStyleSheet( url ) );
				}
			}
		}
		
		// :enabled & :disabled polling script (since we can't hook 
		// onpropertychange event when an element is disabled) 
		if (enabledWatchers.length > 0) {
			setInterval( function() {
				for (var c = 0, cl = enabledWatchers.length; c < cl; c++) {
					var e = enabledWatchers[c];
					if (e.disabled !== e.$disabled) {
						if (e.disabled) {
							e.disabled = false;
							e.$disabled = true;
							e.disabled = true;
						}
						else {
							e.$disabled = e.disabled;
						}
					}
				}
			},250)
		}
	};
	
	// Bind selectivizr to the ContentLoaded event. 
	ContentLoaded(win, function() {
		// Determine the "best fit" selector engine
		for (var engine in selectorEngines) {
			var members, member, context = win;
			if (win[engine]) {
				members = selectorEngines[engine].replace("*", engine).split(".");
				while ((member = members.shift()) && (context = context[member])) {}
				if (typeof context == "function") {
					selectorMethod = context;
					init();
					return;
				}
			}
		}
	});
	
	
	/*!
	 * ContentLoaded.js by Diego Perini, modified for IE<9 only (to save space)
	 *
	 * Author: Diego Perini (diego.perini at gmail.com)
	 * Summary: cross-browser wrapper for DOMContentLoaded
	 * Updated: 20101020
	 * License: MIT
	 * Version: 1.2
	 *
	 * URL:
	 * http://javascript.nwbox.com/ContentLoaded/
	 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
	 *
	 */

	// @w window reference
	// @f function reference
	function ContentLoaded(win, fn) {

		var done = false, top = true,
		init = function(e) {
			if (e.type == "readystatechange" && doc.readyState != "complete") return;
			(e.type == "load" ? win : doc).detachEvent("on" + e.type, init, false);
			if (!done && (done = true)) fn.call(win, e.type || e);
		},
		poll = function() {
			try { root.doScroll("left"); } catch(e) { setTimeout(poll, 50); return; }
			init('poll');
		};

		if (doc.readyState == "complete") fn.call(win, EMPTY_STRING);
		else {
			if (doc.createEventObject && root.doScroll) {
				try { top = !win.frameElement; } catch(e) { }
				if (top) poll();
			}
			addEvent(doc,"readystatechange", init);
			addEvent(win,"load", init);
		}
	};
})(this);
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
			autoHover: false
		});
	}

	/* end of INDEX PAGE */

});