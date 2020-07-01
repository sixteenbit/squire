<?php
/**
 * Squire functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 */

// Defines
define( 'SQ_THEME_VERSION', '0.2.1' );
define( 'SQ_THEME_DIR', get_template_directory() );
define( 'SQ_THEME_URL', get_template_directory_uri() );

/**
 * REQUIRED FILES
 * Include required files.
 */

// Classes
require_once 'classes/class-theme-setup.php';
require_once 'classes/class-customizer.php';
require_once 'classes/class-tags.php';
require_once 'classes/class-dropdown-walker.php';
require_once 'classes/class-child-pages.php';

if ( ! function_exists( 'v_forcelogin' ) ) {
	require_once 'classes/class-force-login.php';
}

// Theme actions
add_action( 'after_setup_theme', 'SQ_Theme_Setup::setup' );
add_action( 'widgets_init', 'SQ_Theme_Setup::sidebar' );
add_action( 'wp_enqueue_scripts', 'SQ_Theme_Setup::assets' );
add_action( 'wp_head', 'SQ_Theme_Setup::pingback' );
add_filter( 'body_class', 'SQ_Theme_Setup::body_class' );
add_action( 'wp_print_footer_scripts', 'SQ_Theme_Setup::skip_link_focus_fix' );
add_action( 'wp_body_open', 'SQ_Theme_Setup::skip_link', 5 );
add_action( 'wp_head', 'SQ_Theme_Setup::no_js_class' );
add_action( 'admin_menu', 'SQ_Theme_Setup::disable_default_dashboard_widgets' );
add_action( 'widgets_init', 'SQ_Theme_Setup::remove_default_widgets' );
remove_action( 'welcome_panel', 'wp_welcome_panel' );
add_filter( 'admin_footer_text', 'SQ_Theme_Setup::custom_admin_footer' );
add_filter( 'get_the_archive_title', 'SQ_Theme_Setup::get_the_archive_title' );
add_action( 'tgmpa_register', 'SQ_Theme_Setup::register_required_plugins' );
add_action( 'template_redirect', 'SQ_Child_Pages::redirect_child_pages' );

/**
 * Checks to see if we're on the homepage or not.
 */
function squire_is_frontpage() {
	return ( is_front_page() && ! is_home() );
}

if ( ! function_exists( 'squire_post_thumbnail' ) ) :
	/**
	 * Displays an optional post thumbnail.
	 *
	 * Wraps the post thumbnail in an anchor element on index views, or a div
	 * element when on single views.
	 *
	 * Create your own squire_post_thumbnail() function to override in a child theme.
	 */
	function squire_post_thumbnail() {
		if ( post_password_required() || is_attachment() || ! has_post_thumbnail() || is_single() ) {
			return;
		}
		?>

		<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true">
			<?php
			the_post_thumbnail(
				'post-thumbnail',
				array(
					'alt' => the_title_attribute( 'echo=0' ),
				)
			);
			?>
		</a>

		<?php
	}
endif;


function squire_featured_header() {
	if ( ( is_single() || ( is_page() && ! squire_is_frontpage() ) ) && has_post_thumbnail( get_queried_object_id() ) ) :
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( get_queried_object_id() ), 'squire-featured-image' );
		$image = $image[0];

		echo '<div class="single-featured-image-header" style="background-image: url(' . esc_url( $image ) . ');">';
		echo '</div><!-- .single-featured-image-header -->';
	endif;
}
