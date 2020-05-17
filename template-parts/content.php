<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<?php get_template_part( 'template-parts/entry-header' ); ?>

	<div class="entry-content">
		<?php
		if ( is_search() || ! is_singular() ) {
			the_excerpt();
		} else {
			the_content( __( 'Continue reading', 'squire' ) );
		}

		if ( is_single() ) {
			get_template_part( 'template-parts/navigation' );
		}


		wp_link_pages(
			array(
				'before'      => '<nav class="post-nav-links" aria-label="' . esc_attr__( 'Page', 'squire' ) . '"><span class="label secondary">' . __( 'Pages:', 'squire' ) . '</span>',
				'after'       => '</nav>',
				'link_before' => '<span class="page-number">',
				'link_after'  => '</span>',
			)
		);

		?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php SQ_Tags::get_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
