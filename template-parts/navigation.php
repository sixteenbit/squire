<?php
/**
 * Displays the next and previous post navigation in single posts.
 */

$next_post = get_next_post();
$prev_post = get_previous_post();

if ( $next_post || $prev_post ) {
	?>

	<nav class="pagination-single margin-vertical-3" aria-label="<?php esc_attr_e( 'Post', 'squire' ); ?>" role="navigation">

		<hr class="styled-separator is-style-wide" aria-hidden="true" />

		<div class="pagination-single-inner button-group align-justify">

			<?php
			if ( $prev_post ) {
				?>

				<a class="previous-post button hollow" href="<?php echo esc_url( get_permalink( $prev_post->ID ) ); ?>">
					<i class="fas fa-arrow-left"></i> <?php echo wp_kses_post( get_the_title( $prev_post->ID ) ); ?>
				</a>

				<?php
			}

			if ( $next_post ) {
				?>

				<a class="next-post button hollow" href="<?php echo esc_url( get_permalink( $next_post->ID ) ); ?>">
					<?php echo wp_kses_post( get_the_title( $next_post->ID ) ); ?> <i class="fas fa-arrow-right"></i>
				</a>
				<?php
			}
			?>

		</div><!-- .pagination-single-inner -->

		<hr class="styled-separator is-style-wide" aria-hidden="true" />

	</nav><!-- .pagination-single -->

	<?php
}
