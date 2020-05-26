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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LWZvdW5kYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgkKSB7XG5cblx0Ly8gRm91bmRhdGlvbiBKYXZhU2NyaXB0XG5cdC8vIEBsaW5rIGh0dHBzOi8vZ2V0LmZvdW5kYXRpb24vc2l0ZXMvZG9jcy9cblx0JChkb2N1bWVudCkuZm91bmRhdGlvbigpO1xuXG5cdCQoZG9jdW1lbnQpLm9uKCdvcGVuZWQuemYub2ZmY2FudmFzJywgZnVuY3Rpb24gKCkge1xuXHRcdCQoXCIjanMtc2VhcmNoIC5zZWFyY2gtaW5wdXRcIikuZm9jdXMoKTtcblx0fSk7XG5cblx0dmFyIGJhY2tUb1RvcFNlbCA9ICcuanMtc2Nyb2xsLXRvLXRvcCcsIGJhY2t0b1RvcEFjdGl2ZUNsYXNzID0gJ2FjdGl2ZSc7XG5cblx0JCh3aW5kb3cpLnNjcm9sbChcblx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoJCh0aGlzKS5zY3JvbGxUb3AoKSA+IDUwMCkge1xuXHRcdFx0XHQkKGJhY2tUb1RvcFNlbCkuYWRkQ2xhc3MoYmFja3RvVG9wQWN0aXZlQ2xhc3MpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JChiYWNrVG9Ub3BTZWwpLnJlbW92ZUNsYXNzKGJhY2t0b1RvcEFjdGl2ZUNsYXNzKTtcblx0XHRcdH1cblx0XHR9XG5cdCk7XG59KShqUXVlcnkpO1xuIl19
