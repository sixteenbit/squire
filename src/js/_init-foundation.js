(function ($) {

	// Foundation JavaScript
	// @link https://get.foundation/sites/docs/
	$(document).foundation();

	$(document).on('opened.zf.offcanvas', function () {
		$("#js-search .search-input").focus();
	});

	var backToTopSel = '.js-scroll-to-top', backtoTopActiveClass = 'active';

	$(window).scroll(
		function () {
			if ($(this).scrollTop() > 500) {
				$(backToTopSel).addClass(backtoTopActiveClass);
			} else {
				$(backToTopSel).removeClass(backtoTopActiveClass);
			}
		}
	);
})(jQuery);
