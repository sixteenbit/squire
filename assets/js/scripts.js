(function ($) {

	// Foundation JavaScript
	// @link https://get.foundation/sites/docs/
	$(document).foundation();

	$(document).on('opened.zf.offcanvas', function () {
		$("#site-search .search-input").focus();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LWZvdW5kYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgkKSB7XG5cblx0Ly8gRm91bmRhdGlvbiBKYXZhU2NyaXB0XG5cdC8vIEBsaW5rIGh0dHBzOi8vZ2V0LmZvdW5kYXRpb24vc2l0ZXMvZG9jcy9cblx0JChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG5cdCQoZG9jdW1lbnQpLm9uKCdvcGVuZWQuemYub2ZmY2FudmFzJywgZnVuY3Rpb24gKCkge1xuXHRcdCQoXCIjc2l0ZS1zZWFyY2ggLnNlYXJjaC1pbnB1dFwiKS5mb2N1cygpO1xuXHR9KTtcblxuXHR2YXIgYmFja1RvVG9wU2VsID0gJy5qcy1zY3JvbGwtdG8tdG9wJywgYmFja3RvVG9wQWN0aXZlQ2xhc3MgPSAnYWN0aXZlJztcblxuXHQkKHdpbmRvdykuc2Nyb2xsKFxuXHRcdGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gNTAwKSB7XG5cdFx0XHRcdCQoYmFja1RvVG9wU2VsKS5hZGRDbGFzcyhiYWNrdG9Ub3BBY3RpdmVDbGFzcyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQkKGJhY2tUb1RvcFNlbCkucmVtb3ZlQ2xhc3MoYmFja3RvVG9wQWN0aXZlQ2xhc3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn0pKGpRdWVyeSk7XG4iXX0=
