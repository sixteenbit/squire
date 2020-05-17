<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 */
?>

		</div><!-- .row -->
	</div><!-- #content -->

	<?php
	do_action( 'squire_after_content' );
	do_action( 'squire_before_footer' );

	if (
		is_callable( 'FLThemeBuilderLayoutData::get_current_page_footer_ids' )
		&& ! empty( FLThemeBuilderLayoutData::get_current_page_footer_ids() )
		&& is_callable( 'FLThemeBuilderLayoutRenderer::render_footer' )
	) {
		FLThemeBuilderLayoutRenderer::render_footer();
	} else {
		?>
		<footer id="colophon" class="site-footer padding-vertical-3">
			<div class="grid-container">
				<div class="site-info">
					<p class="copyright">
						<?php echo sprintf( __( 'Copyright &copy; %s. All rights reserved.', 'squire' ), date( 'Y' ) . '. ' . esc_html( get_bloginfo( 'name' ) ) ); ?>
					</p>
				</div><!-- .site-info -->

				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<nav id="footer-navigation" class="footer-navigation" aria-label="<?php esc_html_e( 'Footer Menu', 'squire' ); ?>">
						<?php
						wp_nav_menu(
								array(
										'container'      => false,
										'theme_location' => 'footer',
										'menu_id'        => 'footer',
										'menu_class'     => 'simple menu',
										'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
										'depth'          => 1
								)
						);
						?>
					</nav><!-- #site-navigation -->
				<?php endif; ?>
			</div>
		</footer><!-- #colophon -->
	<?php } ?>

	<?php do_action( 'squire_after_footer' ); ?>

	<div class="scroll-to-top js-scroll-to-top">
		<a href="#page" class="secondary button" data-smooth-scroll><i class="fa fa-angle-up" aria-hidden="true"></i><span class="show-for-sr"><?php echo esc_html__('Scroll to top', 'squire'); ?></span></a>
	</div>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
