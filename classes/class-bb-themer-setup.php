<?php
/**
 * Beaver Themer plugin setup class.
 */
if ( ! class_exists( 'SQ_BB_Themer_Setup' ) ) {
	/**
	 * Class SQ_BB_Themer_Setup
	 */
	class SQ_BB_Themer_Setup {
		/**
		 * Initialization.
		 */
		public static function init() {
			add_filter( 'fl_theme_builder_part_hooks', __CLASS__ . '::parts' );
		}

		/**
		 * Registers hooks for theme parts.
		 */
		public static function parts() {
			return array(

				array(
					'label' => esc_html__( 'Content area', 'squire' ),
					'hooks' => array(
						'squire_before_content' => 'Before Content',
						'squire_after_content'  => 'After Content',
					),
				),

				array(
					'label' => esc_html__( 'Footer area', 'squire' ),
					'hooks' => array(
						'squire_before_footer' => 'Before Footer',
						'squire_after_footer'  => 'After Footer',
					),
				),

			);
		}
	}

	SQ_BB_Themer_Setup::init();

}
