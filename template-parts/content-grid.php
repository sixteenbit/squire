<?php
/**
 * Template part for displaying posts as a grid
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'hentry cell' ); ?>>
	<header class="entry-header">
		<?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
		<div class="entry-meta">
			<?php SQ_Tags::post_date(); ?>
		</div>
	</header><!-- .entry-header -->

	<?php squire_post_thumbnail(); ?>

	<div class="entry-content">
		<?php the_excerpt(); ?>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php SQ_Tags::get_entry_profile(); ?>

		<div class="entry-meta">
			<?php echo get_the_category_list(); ?>
		</div><!-- .entry-meta -->
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
