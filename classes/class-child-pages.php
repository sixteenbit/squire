<?php

/**
 * Class SQ_Child_Pages
 */
class SQ_Child_Pages {
	/**
	 * Generate child page navigation
	 */
	public static function child_page_nav() {

		$page_id  = get_queried_object_id();
		$children = get_pages( 'child_of=' . $page_id );

		if ( count( $children ) != 0 && ! is_404() && ! is_home() && ! is_search() ) :
			?>
			<nav id="sub-navigation" class="child-navigation">
				<ul class="vertical menu" data-magellan data-offset="24">
					<li class="menu-text"><?php echo esc_html__( 'Page Navigation', 'squire' ); ?></li>
					<?php
					global $post;
					wp_reset_query();

					$args = array(
						'post_parent'    => $page_id,
						'post_type'      => 'page',
						'orderby'        => 'menu_order',
						'order'          => 'ASC',
						'nopaging'       => true,
						'posts_per_page' => - 1,
					);

					$sub_pages = new WP_Query( $args );

					if ( $sub_pages->have_posts() ) :
						while ( $sub_pages->have_posts() ) :
							$sub_pages->the_post();
							$post_slug = $post->post_name;
							echo '<li><a href="#' . $post_slug . '">' . get_the_title() . '</a></li>';
						endwhile;
					endif;

					wp_reset_query();
					?>
					<li class="back-to-top show-for-medium"><a
								href="#main"><?php echo esc_html__( 'Back to top', 'squire' ); ?></a></li>
				</ul>
			</nav>

			<?php
		endif;
	}

	/**
	 * Grab child pages
	 */
	public static function get_child_pages() {

		global $post;
		$parent_id = $post->ID;
		$pages     = array();

		// WP_Query arguments
		$args = array(
			'post_type'      => 'page',
			'post_parent'    => $parent_id,
			'order'          => 'ASC',
			'orderby'        => 'menu_order',
			'no_found_rows'  => true,
			'nopaging'       => true,
			'posts_per_page' => - 1,
		);

		// The Query
		$wp_query = new WP_Query( $args );

		// The Loop
		if ( $wp_query->have_posts() ) {

			while ( $wp_query->have_posts() ) {

				$wp_query->the_post();
				$pages[]   = $post;
				$post_slug = $post->post_name;
				?>

				<article id="<?php echo $post_slug; ?>" <?php post_class(); ?>
						 data-magellan-target="<?php echo $post_slug; ?>"
						 aria-describedby="<?php echo get_the_title(); ?>">
					<header class="entry-header child-entry-header">
						<?php the_title( '<h2 class="entry-title"><a href="#' . $post_slug . '">', '</a></h2>' ); ?>
					</header><!-- .entry-header -->

					<div class="entry-content">
						<?php

						if ( ! empty( get_the_content() ) ) :
							the_content();
						endif;

						edit_post_link(
							sprintf(
								wp_kses(
										/* translators: %s: Name of current post. Only visible to screen readers */
									__( 'Edit <span class="screen-reader-text">%s</span>', 'squire' ),
									array(
										'span' => array(
											'class' => array(),
										),
									)
								),
								get_the_title()
							),
							'<span class="edit-link">',
							'</span>'
						);

						?>
					</div><!-- .entry-content -->
				</article><!-- #post-## -->

				<?php
			}
		}

		// Restore original Post Data
		wp_reset_postdata();
	}

	/**
	 * Redirect child pages to parent + hash
	 */
	public static function redirect_child_pages() {
		global $post;
		$post_slug = $post->post_name;
		if ( is_page() && $post->post_parent ) {
			wp_redirect( get_permalink( $post->post_parent ) . '#' . $post_slug );
		}
	}
}
