<?php
/**
 * Template Name: Left Sidebar
 * Template Post Type: post, page
 */
get_header();
get_sidebar();
?>

	<div id="primary" class="content-area col">
		<main id="main" class="site-main">

			<?php
			if ( have_posts() ) {

				while ( have_posts() ) {
					the_post();

					get_template_part( 'template-parts/content', get_post_type() );
				}
			}
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
