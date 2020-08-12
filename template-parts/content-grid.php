<?php
/**
 * Template part for displaying posts as a grid
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'hentry cell flex-container flex-dir-column' ); ?>>
	<header class="entry-header flex-child-shrink">
		<?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' ); ?>
		<div class="entry-meta">
			<?php SQ_Tags::post_date(); ?>
		</div>
	</header><!-- .entry-header -->

	<a class="post-thumbnail" href="<?php the_permalink(); ?>" aria-hidden="true">
		<?php
		the_post_thumbnail(
			'squire-grid-image',
			array(
				'alt' => the_title_attribute( 'echo=0' ),
			)
		);
		?>
	</a>

	<div class="entry-content flex-child-grow">
		<?php the_excerpt(); ?>
	</div><!-- .entry-content -->

	<footer class="entry-footer flex-child-shrink">
		<?php SQ_Tags::get_entry_profile(); ?>

		<div class="entry-meta">
			<?php echo get_the_category_list(); ?>
		</div><!-- .entry-meta -->
	</footer><!-- .entry-footer -->
</article><!-- #post-<?php the_ID(); ?> -->
