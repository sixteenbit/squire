<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 */

get_header();
?>

	<div id="primary" class="content-area cell">
		<main id="main" class="site-main">

			<?php
			if ( have_posts() ) {

				while ( have_posts() ) {
					the_post();

					get_template_part( 'template-parts/content', get_post_type() );
				}
			}

			if ( is_page() ) {
				SQ_Child_Pages::get_child_pages();
			}
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
