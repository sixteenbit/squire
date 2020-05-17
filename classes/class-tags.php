<?php
/**
 * Class SQ_Tags
 */
if ( ! class_exists( 'SQ_Tags' ) ) {
	/**
	 * Class SQ_Tags
	 */
	class SQ_Tags {
		/**
		 * Prints HTML with meta information for the current post-date/time and author.
		 *
		 */
		public static function post_date() {
			$post_date = the_date( 'Y-m-d', '', '', false );
			$month_ago = date( 'Y-m-d', mktime( 0, 0, 0, date( 'm' ) - 1, date( 'd' ), date( 'Y' ) ) );
			if ( $post_date > $month_ago ) {
				/* translators: %s: post date. */
				$post_date = sprintf( __( '%1$s ago', 'squire' ), human_time_diff( get_the_time( 'U' ), current_time( 'timestamp' ) ) );
			} else {
				$post_date = get_the_date();
			}
			printf(
			/* translators: %s: post date. */
				__( '<time class="entry-date" datetime="%1$s" pubdate>Posted %2$s</time>', 'squire' ),
				esc_attr( get_the_date( 'c' ) ),
				esc_html( $post_date )
			);
		}

		/**
		 * Foundation Pagination
		 *
		 * @param array $args
		 *
		 * @return bool
		 */
		public static function foundation_pagination( $args = array() ) {

			$defaults = array(
				'range'           => 4,
				'custom_query'    => false,
				'previous_string' => __( 'Previous', 'squire' ),
				'next_string'     => __( 'Next', 'squire' ),
				'before_output'   => '<div class="post-nav margin-vertical-3"><ul class="pagination text-center">',
				'after_output'    => '</ul></div>',
			);

			$args = wp_parse_args(
				$args,
				apply_filters( __CLASS__ . '::foundation_pagination', $defaults )
			);

			$args['range'] = (int) $args['range'] - 1;
			if ( ! $args['custom_query'] ) {
				$args['custom_query'] = @$GLOBALS['wp_query'];
			}
			$count = (int) $args['custom_query']->max_num_pages;
			$page  = intval( get_query_var( 'paged' ) );
			$ceil  = ceil( $args['range'] / 2 );

			if ( $count <= 1 ) {
				return false;
			}

			if ( ! $page ) {
				$page = 1;
			}

			if ( $count > $args['range'] ) {
				if ( $page <= $args['range'] ) {
					$min = 1;
					$max = $args['range'] + 1;
				} elseif ( $page >= ( $count - $ceil ) ) {
					$min = $count - $args['range'];
					$max = $count;
				} elseif ( $page >= $args['range'] && $page < ( $count - $ceil ) ) {
					$min = $page - $ceil;
					$max = $page + $ceil;
				}
			} else {
				$min = 1;
				$max = $count;
			}

			$echo     = '';
			$previous = intval( $page ) - 1;
			$previous = esc_attr( get_pagenum_link( $previous ) );

			$firstpage = esc_attr( get_pagenum_link( 1 ) );
			if ( $firstpage && ( 1 != $page ) ) {
				$echo .= '<li><a href="' . $firstpage . '"><span class="show-for-sr">' . __( 'First', 'squire' ) . '</span><i class="fal fa-angle-double-left"></i></a></li>';
			}

			if ( $previous && ( 1 != $page ) ) {
				$echo .= '<li><a href="' . $previous . '" title="' . __( 'previous', 'squire' ) . '"><span class="show-for-sr">' . $args['previous_string'] . '</span><i class="fal fa-angle-left"></i></a></li>';
			}

			if ( ! empty( $min ) && ! empty( $max ) ) {
				for ( $i = $min; $i <= $max; $i ++ ) {
					if ( $page == $i ) {
						$echo .= '<li class="current"><span class="show-for-sr">' . __( 'You\'re on page ', 'squire' ) . '</span>' . str_pad( (int) $i, 2, '0', STR_PAD_LEFT ) . '</li>';
					} else {
						$echo .= sprintf( '<li><a href="%s">%002d</a></li>', esc_attr( get_pagenum_link( $i ) ), $i );
					}
				}
			}

			$next = intval( $page ) + 1;
			$next = esc_attr( get_pagenum_link( $next ) );
			if ( $next && ( $count != $page ) ) {
				$echo .= '<li><a href="' . $next . '" title="' . __( 'next', 'squire' ) . '"><span class="show-for-sr">' . $args['next_string'] . '</span><i class="fal fa-angle-right"></i></a></li>';
			}

			$lastpage = esc_attr( get_pagenum_link( $count ) );
			if ( $lastpage ) {
				$echo .= '<li><a href="' . $lastpage . '"><span class="show-for-sr">' . __( 'Last', 'squire' ) . '</span><i class="fal fa-angle-double-right"></i></a></li>';
			}

			if ( isset( $echo ) ) {
				echo $args['before_output'] . $echo . $args['after_output'];
			}
		}

		/**
		 * Prints HTML with meta information for the categories, tags and comments.
		 */
		public static function get_entry_footer() {
			// Hide category and tag text for pages.
			if ( 'post' === get_post_type() ) {
				/* translators: used between list items, there is a space after the comma */
				$categories_list = get_the_category_list( esc_html__( ', ', 'squire' ) );
				if ( $categories_list ) {
					/* translators: 1: list of categories. */
					printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'squire' ) . '</span>', $categories_list ); // WPCS: XSS OK.
				}

				/* translators: used between list items, there is a space after the comma */
				$tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'squire' ) );
				if ( $tags_list ) {
					/* translators: 1: list of tags. */
					printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'squire' ) . '</span>', $tags_list ); // WPCS: XSS OK.
				}
			}

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
		}

		/**
		 * Entry profile for posts
		 */
		public static function get_entry_profile() {
			$profile_email = get_avatar( get_the_author_meta( 'user_email' ) );
			?>
			<div class="entry-profile-pic">
				<?php
				if ( $profile_email ) {
					echo get_avatar( get_the_author_meta( 'user_email' ), '60' );
				}
				?>
				<span class="byline author vcard"><?php echo __( 'By', 'squire' ); ?> <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>" rel="author" class="fn"><?php echo get_the_author(); ?></a>
			</div>
			<?php
		}

		/**
		 * Get unique ID.
		 *
		 * This is a PHP implementation of Underscore's uniqueId method. A static variable
		 * contains an integer that is incremented with each call. This number is returned
		 * with the optional prefix. As such the returned value is not universally unique,
		 * but it is unique across the life of the PHP process.
		 *
		 * @param string $prefix Prefix for the returned ID.
		 *
		 * @return string Unique ID.
		 * @see wp_unique_id() Themes requiring WordPress 5.0.3 and greater should use this instead.
		 *
		 * @staticvar int $id_counter
		 *
		 */
		public static function unique_id( $prefix = '' ) {
			static $id_counter = 0;
			if ( function_exists( 'wp_unique_id' ) ) {
				return wp_unique_id( $prefix );
			}

			return $prefix . (string) ++ $id_counter;
		}
	}
}
