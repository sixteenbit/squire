<?php
/**
 * Force Login
 */
if ( ! class_exists( 'SQ_Force_Login' ) ) {
	/**
	 * SQ_Force_Login
	 */
	class SQ_Force_Login {
		/**
		 * Initialization.
		 */
		public static function init() {

			add_action( 'template_redirect', __CLASS__ . '::forcelogin' );
			add_filter( 'rest_authentication_errors', __CLASS__ . '::forcelogin_rest_access', 99 );
			add_action( 'login_enqueue_scripts', __CLASS__ . '::hide_backtoblog' );

		}

		public static function forcelogin() {

			// Exceptions for AJAX, Cron, or WP-CLI requests
			if ( ( defined( 'DOING_AJAX' ) && DOING_AJAX ) || ( defined( 'DOING_CRON' ) && DOING_CRON ) || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
				return;
			}

			// Redirect unauthorized visitors
			if ( ! is_user_logged_in() ) {
				// Get visited URL
				$schema = isset( $_SERVER['HTTPS'] ) && 'on' === $_SERVER['HTTPS'] ? 'https://' : 'http://';
				$url    = $schema . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

				/**
				 * Bypass filters.
				 *
				 * @since 3.0.0 The `$whitelist` filter was added.
				 * @since 4.0.0 The `$bypass` filter was added.
				 * @since 5.2.0 The `$url` parameter was added.
				 */
				$bypass    = apply_filters( 'forcelogin_bypass', false, $url );
				$whitelist = apply_filters( 'forcelogin_whitelist', array() );

				if ( preg_replace( '/\?.*/', '', $url ) !== preg_replace( '/\?.*/', '', wp_login_url() ) && ! $bypass && ! in_array( $url, $whitelist ) ) {
					// Determine redirect URL
					$redirect_url = apply_filters( 'forcelogin_redirect', $url );
					// Set the headers to prevent caching
					nocache_headers();
					// Redirect
					wp_safe_redirect( wp_login_url( $redirect_url ), 302 );
					exit;
				}
			} elseif ( function_exists( 'is_multisite' ) && is_multisite() ) {
				// Only allow Multisite users access to their assigned sites
				if ( ! is_user_member_of_blog() && ! current_user_can( 'setup_network' ) ) {
					wp_die( __( "You're not authorized to access this site.", 'squire' ), get_option( 'blogname' ) . ' &rsaquo; ' . __( 'Error', 'squire' ) );
				}
			}
		}

		/**
		 * Restrict REST API for authorized users only
		 *
		 * @param WP_Error|null|bool $result WP_Error if authentication error, null if authentication
		 *                              method wasn't used, true if authentication succeeded.
		 *
		 * @return WP_Error|null|bool
		 * @since 5.1.0
		 */
		public static function forcelogin_rest_access( $result ) {
			if ( null === $result && ! is_user_logged_in() ) {
				return new WP_Error( 'rest_unauthorized', __( 'Only authenticated users can access the REST API.', 'squire' ), array( 'status' => rest_authorization_required_code() ) );
			}

			return $result;
		}

		// Hide the 'Back to {sitename}' link on the login screen.
		public static function hide_backtoblog() {
			echo '<style type="text/css">#backtoblog{display:none;}</style>';
		}
	}

	if ( get_theme_mod( 'force_login', false ) ) {
		SQ_Force_Login::init();
	}
}
