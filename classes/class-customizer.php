<?php

if ( ! class_exists( 'SQ_Customizer' ) ) {
	/**
	 * Class SQ_Customizer
	 */
	class SQ_Customizer {
		/**
		 * Register customizer options.
		 *
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 */
		public static function register( $wp_customize ) {

			// Section: Colors

			$wp_customize->add_setting(
				'text_color',
				array(
					'default'           => '#172b4d',
					'type'              => 'theme_mod',
					'capability'        => 'edit_theme_options',
					'sanitize_callback' => array( __CLASS__, 'sanitize_hex_color' ),
				)
			);

			$wp_customize->add_control(
				new WP_Customize_Color_Control(
					$wp_customize,
					'text_color',
					array(
						'settings'    => 'text_color',
						'section'     => 'colors',
						'label'       => __( 'Text Color', 'squire' ),
						'description' => __( 'Select the color to be used for the body text color.', 'squire' ),
					)
				)
			);

			$wp_customize->add_setting(
				'sidebar_background',
				array(
					'default'           => '#084ca3',
					'type'              => 'theme_mod',
					'capability'        => 'edit_theme_options',
					'sanitize_callback' => array( __CLASS__, 'sanitize_hex_color' ),
				)
			);

			$wp_customize->add_control(
				new WP_Customize_Color_Control(
					$wp_customize,
					'sidebar_background',
					array(
						'settings'    => 'sidebar_background',
						'section'     => 'colors',
						'label'       => __( 'Sidebar Background', 'squire' ),
						'description' => __( 'Select the background color to be used for the sidebar.', 'squire' ),
					)
				)
			);

			$wp_customize->add_setting(
				'sidebar_color',
				array(
					'default'           => '#deebff',
					'type'              => 'theme_mod',
					'capability'        => 'edit_theme_options',
					'sanitize_callback' => array( __CLASS__, 'sanitize_hex_color' ),
				)
			);

			$wp_customize->add_control(
				new WP_Customize_Color_Control(
					$wp_customize,
					'sidebar_color',
					array(
						'settings'    => 'sidebar_color',
						'section'     => 'colors',
						'label'       => __( 'Sidebar Color', 'squire' ),
						'description' => __( 'Select the color to be used for the sidebar menu items.', 'squire' ),
					)
				)
			);

			$wp_customize->add_setting(
				'anchor_color',
				array(
					'default'           => '#0052cc',
					'type'              => 'theme_mod',
					'capability'        => 'edit_theme_options',
					'sanitize_callback' => array( __CLASS__, 'sanitize_hex_color' ),
				)
			);

			$wp_customize->add_control(
				new WP_Customize_Color_Control(
					$wp_customize,
					'anchor_color',
					array(
						'settings'    => 'anchor_color',
						'section'     => 'colors',
						'label'       => __( 'Anchor Color', 'squire' ),
						'description' => __( 'Select the color to be used for hyperlink color.', 'squire' ),
					)
				)
			);

			$wp_customize->add_setting(
				'anchor_hover_color',
				array(
					'default'           => '#0065ff',
					'type'              => 'theme_mod',
					'capability'        => 'edit_theme_options',
					'sanitize_callback' => array( __CLASS__, 'sanitize_hex_color' ),
				)
			);

			$wp_customize->add_control(
				new WP_Customize_Color_Control(
					$wp_customize,
					'anchor_hover_color',
					array(
						'settings'    => 'anchor_hover_color',
						'section'     => 'colors',
						'label'       => __( 'Anchor Hover Color', 'squire' ),
						'description' => __( 'Select the color to be used for hyperlink hover color.', 'squire' ),
					)
				)
			);

			// Section: Development.
			$wp_customize->add_section(
				'theme_options',
				array(
					'title'    => esc_html__( 'Theme Options', 'squire' ),
					'priority' => 190,
				)
			);

			if ( ! function_exists( 'v_forcelogin' ) ) {
				// Option: development/force_login.
				$wp_customize->add_setting(
					'force_login',
					array(
						'capability'        => 'edit_theme_options',
						'default'           => false,
						'sanitize_callback' => array( __CLASS__, 'sanitize_checkbox' ),
					)
				);
				$wp_customize->add_control(
					'force_login',
					array(
						'label'       => esc_html__( 'Force Login', 'squire' ),
						'description' => esc_html__( 'Make the website private until it\'s ready to share publicly, or keep it private for members only.', 'squire' ),
						'section'     => 'theme_options',
						'type'        => 'checkbox',
					)
				);
			}
		}

		/**
		 * Sanitize boolean for checkbox.
		 *
		 * @param bool $checked Whether or not a box is checked.
		 *
		 * @return bool
		 */
		public static function sanitize_checkbox( $checked ) {
			return isset( $checked ) && true === $checked;
		}

		/**
		 * Sanitize hex color.
		 *
		 * @param $hex_color
		 * @param $setting
		 *
		 * @return string|void
		 */
		public static function sanitize_hex_color( $hex_color, $setting ) {
			// Sanitize $input as a hex value without the hash prefix.
			$hex_color = sanitize_hex_color( $hex_color );

			// If $input is a valid hex value, return it; otherwise, return the default.
			return ( ! is_null( $hex_color ) ? $hex_color : $setting->default );
		}

		public static function customize_css() {

			$text_color         = get_theme_mod( 'text_color', '#172b4d' );
			$sidebar_background = get_theme_mod( 'sidebar_background', '#084ca3' );
			$sidebar_color      = get_theme_mod( 'sidebar_color', '#deebff' );
			$anchor_color       = get_theme_mod( 'anchor_color', '#0052cc' );
			$anchor_hover_color = get_theme_mod( 'anchor_hover_color', '#0065ff' );
			?>
			<style id="customizer-styles" type="text/css">
				<?php if ( isset( $text_color ) ) : ?>
				body {
					color: <?php echo $text_color; ?>;
				}

				<?php endif; ?>
				<?php if ( isset( $sidebar_background ) ) : ?>
				.site-header {
					background-color: <?php echo $sidebar_background; ?>;
				}

				<?php endif; ?>

				<?php if ( isset( $sidebar_color ) ) : ?>
				.site-header,
				.site-header a,
				.site-header .menu-toggle,
				.site-header .search-toggle,
				.widget-area .widget_recent_entries ul > li > a,
				.widget-area .widget_categories ul > li > a,
				.widget-area .menu > li > a,
				.main-navigation .menu > li > a,
				.social-navigation .menu > li > a {
					color: <?php echo $sidebar_color; ?>;
				}

				<?php endif; ?>

				<?php if ( isset( $anchor_color ) ) : ?>
				a,
				.button.hollow,
				.button.hollow.disabled,
				.button.hollow[disabled],
				.button.hollow.disabled:hover,
				.button.hollow[disabled]:hover,
				.button.hollow.disabled:focus,
				.button.hollow[disabled]:focus,
				.button.clear,
				.button.clear.disabled,
				.button.clear[disabled],
				.button.clear.disabled:hover,
				.button.clear[disabled]:hover,
				.button.clear.disabled:focus,
				.button.clear[disabled]:focus,
				.button-group.hollow .button,
				.button-group.hollow .button.disabled,
				.button-group.hollow .button[disabled],
				.button-group.hollow .button.disabled:hover,
				.button-group.hollow .button[disabled]:hover,
				.button-group.hollow .button.disabled:focus,
				.button-group.hollow .button[disabled]:focus,
				.button-group.clear .button,
				.button-group.clear .button.disabled,
				.button-group.clear .button[disabled],
				.button-group.clear .button.disabled:hover,
				.button-group.clear .button[disabled]:hover,
				.button-group.clear .button.disabled:focus,
				.button-group.clear .button[disabled]:focus,
				.child-navigation .menu > li .is-active {
					color: <?php echo $anchor_color; ?>;
				}

				.button.hollow,
				.button.hollow.disabled,
				.button.hollow[disabled],
				.button.hollow.disabled:hover,
				.button.hollow[disabled]:hover,
				.button.hollow.disabled:focus,
				.button.hollow[disabled]:focus,
				.button-group.hollow .button,
				.button-group.hollow .button.disabled,
				.button-group.hollow .button[disabled],
				.button-group.hollow .button.disabled:hover,
				.button-group.hollow .button[disabled]:hover,
				.button-group.hollow .button.disabled:focus,
				.button-group.hollow .button[disabled]:focus {
					border-color: <?php echo $anchor_color; ?>;
				}

				.button.dropdown.hollow::after,
				.button.dropdown.clear::after {
					border-top-color: <?php echo $anchor_color; ?>;
				}

				.button,
				.button.disabled,
				.button[disabled],
				.button.disabled:hover,
				.button[disabled]:hover,
				.button.disabled:focus,
				.button[disabled]:focus,
				.post-password-form [type="submit"],
				.post-password-form [type="submit"].disabled,
				.post-password-form [type="submit"][disabled],
				.post-password-form [type="submit"].disabled:hover,
				.post-password-form [type="submit"][disabled]:hover,
				.post-password-form [type="submit"].disabled:focus,
				.post-password-form [type="submit"][disabled]:focus {
					background-color: <?php echo $anchor_color; ?>;
				}

				<?php endif; ?>

				<?php if ( isset( $anchor_hover_color ) ) : ?>
				a:hover,
				a:focus,
				.social-navigation .menu > li > a:hover,
				.social-navigation .menu > li > a:active,
				.social-navigation .menu > li > a:focus {
					color: <?php echo $anchor_hover_color; ?>;
				}

				.button:hover,
				.button:focus {
					background-color: <?php echo $anchor_hover_color; ?>;
				}

				.accordion-menu .is-accordion-submenu-parent:not(.has-submenu-toggle) > a::after {
					border-color: <?php echo $anchor_hover_color; ?> transparent transparent;
				}

				<?php endif; ?>
			</style>
			<?php
		}

	}

	// Setup the Theme Customizer settings and controls.
	add_action( 'customize_register', array( 'SQ_Customizer', 'register' ) );

	add_action( 'wp_head', 'SQ_Customizer::customize_css' );

}
