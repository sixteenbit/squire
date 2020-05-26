<?php
/**
 * Theme setup class.
 */
if ( ! class_exists( 'SQ_Theme_Setup' ) ) {
	/**
	 * Class SQ_Theme_Setup
	 */
	class SQ_Theme_Setup {
		/**
		 * Theme setup.
		 */
		public static function setup() {
			/**
			 * Register navigation menus uses wp_nav_menu in five places.
			 */
			$locations = array(
				'primary' => __( 'Primary Menu', 'squire' ),
				'social'  => __( 'Social Menu', 'squire' ),
				'footer'  => __( 'Footer Menu', 'squire' ),
			);

			register_nav_menus( $locations );

			// Add default posts and comments RSS feed links to head.
			add_theme_support( 'automatic-feed-links' );

			// Custom background color.
			add_theme_support(
				'custom-background',
				array(
					'default-color' => 'fefefe',
				)
			);

			// Set content-width.
			global $content_width;
			if ( ! isset( $content_width ) ) {
				$content_width = 800;
			}

			/**
			 * Add support for core custom logo.
			 *
			 * @link https://codex.wordpress.org/Theme_Logo
			 */
			add_theme_support(
				'custom-logo',
				array(
					'height'      => 90,
					'width'       => 120,
					'flex-width'  => true,
					'flex-height' => true,
				)
			);

			/*
			 * Enable support for Post Thumbnails on posts and pages.
			 *
			 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
			 */
			add_theme_support( 'post-thumbnails' );

			// Set post thumbnail size.
			set_post_thumbnail_size( 1200, 9999 );

			add_image_size( 'squire-featured-image', 1400, 9999 );

			/*
			 * Let WordPress manage the document title.
			 * By adding theme support, we declare that this theme does not use a
			 * hard-coded <title> tag in the document head, and expect WordPress to
			 * provide it for us.
			 */
			add_theme_support( 'title-tag' );

			/*
			 * Switch default core markup for search form, comment form, and comments
			 * to output valid HTML5.
			 */
			add_theme_support(
				'html5',
				array(
					'search-form',
					'comment-form',
					'comment-list',
					'gallery',
					'caption',
					'script',
					'style',
				)
			);

			/*
			 * Make theme available for translation.
			 * Translations can be filed in the /languages/ directory.
			 */
			load_theme_textdomain( 'squire' );

			// Add support for responsive embedded content.
			add_theme_support( 'responsive-embeds' );

			// Add support for Block Styles.
			add_theme_support( 'wp-block-styles' );

			// Add support for editor styles.
			add_theme_support( 'editor-styles' );

			// Enqueue editor styles.
			add_editor_style(
				array(
					'assets/css/style-editor.css',
				)
			);

			// Editor color palette.
			add_theme_support(
				'editor-color-palette',
				array(
					array(
						'name'  => __( 'Primary', 'squire' ),
						'slug'  => 'primary',
						'color' => '#084ca3',
					),
					array(
						'name'  => __( 'Secondary', 'squire' ),
						'slug'  => 'secondary',
						'color' => '#f4f5f7',
					),
				)
			);

			// Add theme support for selective refresh for widgets.
			add_theme_support( 'customize-selective-refresh-widgets' );

			// Beaver Themer compatibility.
			add_theme_support( 'fl-theme-builder-headers' );
			add_theme_support( 'fl-theme-builder-footers' );
			add_theme_support( 'fl-theme-builder-parts' );
		}

		/**
		 * Register sidebar.
		 */
		public static function sidebar() {
			register_sidebar(
				array(
					'id'            => 'sidebar-1',
					'name'          => esc_html__( 'Primary Sidebar', 'squire' ),
					'description'   => esc_html__( 'Add widgets here.', 'squire' ),
					'before_widget' => '<section id="%1$s" class="widget %2$s">',
					'after_widget'  => '</section>',
					'before_title'  => '<h2 class="widget-title h4">',
					'after_title'   => '</h2>',
				)
			);
		}

		/**
		 * Enqueue theme assets.
		 */
		public static function assets() {

			// Stylesheets: register.

			wp_register_style(
				'squire-motion-ui',
				get_theme_file_uri( 'assets/css/motion-ui.css' ),
				array(),
				SQ_THEME_VERSION
			);

			wp_style_add_data( 'squire-motion-ui', 'rtl', 'replace' );

			wp_register_style(
				'squire-fontawesome',
				get_theme_file_uri( 'assets/css/fontawesome.css' ),
				array(),
				SQ_THEME_VERSION
			);

			wp_style_add_data( 'squire-fontawesome', 'rtl', 'replace' );

			wp_register_style(
				'squire-foundation',
				get_theme_file_uri( 'assets/css/foundation.css' ),
				array(),
				SQ_THEME_VERSION
			);

			wp_style_add_data( 'squire-foundation', 'rtl', 'replace' );

			// Stylesheets: enqueue.

			wp_enqueue_style(
				'squire-styles',
				get_stylesheet_uri(),
				array(
					'squire-fontawesome',
					'squire-foundation',
				)
			);

			wp_style_add_data( 'squire-styles', 'rtl', 'replace' );

			wp_register_script(
				'squire-motion-ui-js',
				SQ_THEME_URL . '/assets/js/motion-ui.js',
				array(),
				filemtime( SQ_THEME_DIR . '/src/js' ),
				true
			);

			wp_register_script(
				'squire-what-input-js',
				SQ_THEME_URL . '/assets/js/what-input.js',
				array(),
				filemtime( SQ_THEME_DIR . '/src/js' ),
				true
			);

			wp_register_script(
				'squire-foundation-js',
				SQ_THEME_URL . '/assets/js/foundation.js',
				array(),
				filemtime( SQ_THEME_DIR . '/src/js' ),
				true
			);

			wp_register_script(
				'squire-init-js',
				SQ_THEME_URL . '/assets/js/scripts.js',
				array(
					'jquery',
					'squire-motion-ui-js',
					'squire-what-input-js',
					'squire-foundation-js',
				),
				filemtime( SQ_THEME_DIR . '/src/js' ),
				true
			);

			// Scripts: enqueue.

			if (
					is_singular()
					&& comments_open()
					&& get_option( 'thread_comments' )
			) {
				/**
				 * This script should be registered by now
				 * with `wp_default_scripts()`.
				 */
				wp_enqueue_script( 'comment-reply' );
			}

			wp_enqueue_script( 'squire-init-js' );

		}

		/**
		 * Add a pingback url auto-discovery header for singularly identifiable articles.
		 *
		 * Added via action hook for easier remove via child theme.
		 */
		public static function pingback() {
			if ( is_singular() && pings_open() ) {
				echo '<link rel="pingback" href="', esc_url( get_bloginfo( 'pingback_url' ) ), '">';
			}
		}

		/**
		 * HTML Body classes.
		 *
		 * @param array $classes
		 *
		 * @return array
		 */
		public static function body_class( $classes = array() ) {
			$classes = (array) $classes; // Just in case...

			$page_id  = get_queried_object_id();
			$children = get_pages( 'child_of=' . $page_id );

			if ( count( $children ) != 0 && ! is_404() && ! is_home() && ! is_search() ) {
				$classes[] = 'has-child-pages';
			}

			// Singular page?
			if ( is_singular() ) {
				// For better custom styling.
				$classes[] = 'is-singular';

				// Has featured image?
				if ( has_post_thumbnail() ) {
					$classes[] = 'has-post-thumbnail';
				} else {
					$classes[] = 'missing-post-thumbnail';
				}
			} else {
				// Add a class of hfeed to non-singular pages.
				$classes[] = 'hfeed';
			}

			// Has more than 1 published author?
			if ( is_multi_author() ) {
				$classes[] = 'group-blog';
			}

			// Slim page template class names (class = name - file suffix).
			if ( is_page_template() ) {
				$classes[] = basename( get_page_template_slug(), '.php' );
			}

			// Renames sticky class.
			if ( in_array( 'sticky', $classes, true ) ) {
				$classes   = array_diff( $classes, array( 'sticky' ) );
				$classes[] = 'sticky-post';
			}

			// Sort classes alphabetically.
			asort( $classes );

			return array_unique( $classes );
		}

		/**
		 * Fix skip link focus in IE11.
		 *
		 * This does not enqueue the script because it is tiny and because it is only for IE11,
		 * thus it does not warrant having an entire dedicated blocking script being loaded.
		 *
		 * @link https://git.io/vWdr2
		 */
		public static function skip_link_focus_fix() { ?>
			<script>
				/(trident|msie)/i.test(navigator.userAgent) && document.getElementById && window.addEventListener && window.addEventListener("hashchange", function () {
					var t, e = location.hash.substring(1);
					/^[A-z0-9_-]+$/.test(e) && (t = document.getElementById(e)) && (/^(?:a|select|input|button|textarea)$/i.test(t.tagName) || (t.tabIndex = -1), t.focus())
				}, !1);
			</script>
			<?php
		}

		public static function skip_link() {
			echo '<a class="skip-link screen-reader-text" href="#content">' . __( 'Skip to the content', 'squire' ) . '</a>';
		}

		/**
		 * Classes
		 */
		/**
		 * Add No-JS Class.
		 * If we're missing JavaScript support, the HTML element will have a no-js class.
		 */
		public static function no_js_class() {

			?>
			<script>document.documentElement.className = document.documentElement.className.replace('no-js', 'js');</script>
			<?php

		}

		/**
		 * Disable default dashboard widgets
		 */
		public static function disable_default_dashboard_widgets() {
			remove_meta_box( 'dashboard_right_now', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_incoming_links', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_plugins', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_quick_press', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_recent_drafts', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_primary', 'dashboard', 'core' );
			remove_meta_box( 'dashboard_secondary', 'dashboard', 'core' );
			remove_meta_box( 'yoast_db_widget', 'dashboard', 'normal' );
		}

		/**
		 * Unregister Core Widgets
		 */
		public static function remove_default_widgets() {
			unregister_widget( 'WP_Widget_Pages' );
			unregister_widget( 'WP_Widget_Calendar' );
			unregister_widget( 'WP_Widget_Archives' );
			unregister_widget( 'WP_Widget_Links' );
			unregister_widget( 'WP_Widget_Meta' );
			unregister_widget( 'WP_Widget_Recent_Comments' );
			unregister_widget( 'WP_Widget_RSS' );
			unregister_widget( 'WP_Widget_Tag_Cloud' );
		}

		public static function custom_admin_footer() {
			$text = sprintf(
			/* translators: %s: https://webservices.ellucian.com/ */
				__( 'Developed by <a href="%s">Ellucian Web Services</a>.' ),
				__( 'https://webservices.ellucian.com/' )
			);

			echo '<span id="footer-thankyou">' . $text . '</span>';
		}

		/**
		 * Filters the archive title and hides the word before the first colon.
		 *
		 * @param string $title Current archive title.
		 *
		 * @return string $title Current archive title.
		 */
		public static function get_the_archive_title( $title ) {

			$regex = apply_filters(
				'squire_get_the_archive_title_regex',
				array(
					'pattern'     => '/(\A[^\:]+\:)/',
					'replacement' => '<span class="screen-reader-text">$1</span>',
				)
			);

			if ( empty( $regex ) ) {

				return $title;

			}

			return preg_replace( $regex['pattern'], $regex['replacement'], $title );

		}

		/**
		 * Register the required plugins for this theme.
		 *
		 * In this example, we register five plugins:
		 * - one included with the TGMPA library
		 * - two from an external source, one from an arbitrary source, one from a GitHub repository
		 * - two from the .org repo, where one demonstrates the use of the `is_callable` argument
		 *
		 * The variables passed to the `tgmpa()` function should be:
		 * - an array of plugin arrays;
		 * - optionally a configuration array.
		 * If you are not changing anything in the configuration array, you can remove the array and remove the
		 * variable from the function call: `tgmpa( $plugins );`.
		 * In that case, the TGMPA default settings will be used.
		 *
		 * This function is hooked into `tgmpa_register`, which is fired on the WP `init` action on priority 10.
		 */
		public static function register_required_plugins() {
			/*
			 * Array of plugin arrays. Required keys are name and slug.
			 * If the source is NOT from the .org repo, then source is also required.
			 */
			$plugins = array(

				// This is an example of how to include a plugin from the WordPress Plugin Repository.
				array(
					'name'     => 'WP-PageNavi',
					'slug'     => 'wp-pagenavi',
					'required' => false,
				),

				array(
					'name'     => 'Nested Pages',
					'slug'     => 'wp-nested-pages',
					'required' => false,
				),

				array(
					'name'     => 'Dave\'s WordPress Live Search',
					'slug'     => 'daves-wordpress-live-search',
					'required' => false,
				),

			);

			/*
			 * Array of configuration settings. Amend each line as needed.
			 *
			 * TGMPA will start providing localized text strings soon. If you already have translations of our standard
			 * strings available, please help us make TGMPA even better by giving us access to these translations or by
			 * sending in a pull-request with .po file(s) with the translations.
			 *
			 * Only uncomment the strings in the config array if you want to customize the strings.
			 */
			$config = array(
				'id'           => 'squire',
				'default_path' => '',
				'menu'         => 'tgmpa-install-plugins',
				'parent_slug'  => 'themes.php',
				'capability'   => 'edit_theme_options',
				'has_notices'  => true,
				'dismissable'  => true,
				'dismiss_msg'  => '',
				'is_automatic' => false,
				'message'      => '',
			);

			tgmpa( $plugins, $config );
		}
	}
}
