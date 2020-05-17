<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 */
?>
<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<div class="off-canvas-wrapper">
	<div class="search-panel off-canvas position-left" id="js-search" data-off-canvas data-auto-focus="true">
		<form id="site-search" role="search" method="get" class="search-form" action="<?php echo home_url( '/' ); ?>">
			<input class="search-input" type="search" placeholder="<?php esc_html_e( 'Search', 'squire' ); ?>" value="<?php echo esc_html( get_search_query() ); ?>" name="s" title="<?php _e( 'Search for:', 'squire' ); ?>"/>
			<input type="submit" class="search-submit" value="<?php esc_html_e( 'Search', 'squire' ); ?>"/>
		</form>

		<a class="secondary button" aria-label="Close menu" data-close>
			<i class="fa fa-angle-left" aria-hidden="true"></i>
		</a>
	</div>
</div>

<div id="page" class="site off-canvas-content" data-off-canvas-content>

	<header id="masthead" class="site-header">
		<div class="site-branding">
			<a class="site-title" href="<?php echo esc_url( home_url( '/' ) ); ?>"
			   rel="home"><?php bloginfo( 'name' ); ?></a>
			<?php
			the_custom_logo();
			if ( is_front_page() && is_home() ) :
				?>
				<h1 class="site-title screen-reader-text"><?php bloginfo( 'name' ); ?></h1>
			<?php
			endif;
			$squire_description = get_bloginfo( 'description', 'display' );
			if ( $squire_description || is_customize_preview() ) :
				?>
				<p class="site-description screen-reader-text"><?php echo $squire_description; /* WPCS: xss ok. */ ?></p>
			<?php endif; ?>

			<button class="button menu-toggle hide-for-large" data-toggle="site-navigation secondary" aria-controls="site-navigation" aria-expanded="false">
				<i class="fa fa-bars"></i><span class="screen-reader-text"><?php esc_html_e( 'Main navigation toggle', 'squire' ); ?></span>
			</button>

			<button class="button search-toggle" data-toggle="js-search" aria-controls="js-search" aria-expanded="false">
				<i class="fa fa-search"></i><span class="screen-reader-text"><?php esc_html_e( 'Search Form', 'squire' ); ?></span>
			</button>
		</div><!-- .site-branding -->

		<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<nav id="site-navigation" class="main-navigation animated" data-toggler=".is-visible fadeIn" aria-label="<?php esc_html_e( 'Primary Menu', 'squire' ); ?>">
				<?php
				wp_nav_menu(
						array(
								'container'      => false,
								'theme_location' => 'primary',
								'menu_id'        => 'primary',
								'menu_class'     => 'vertical menu accordion-menu',
								'items_wrap'     => '<ul id="%1$s" class="%2$s" data-accordion-menu data-submenu-toggle>%3$s</ul>',
								'walker'         => new SQ_Dropdown_Walker(),
						)
				);
				?>
			</nav><!-- #site-navigation -->
		<?php endif; ?>

		<?php if ( has_nav_menu( 'social' ) ) : ?>
			<nav class="social-navigation show-for-medium" aria-label="<?php esc_html_e( 'Social Links Menu', 'squire' ); ?>">
				<?php
				wp_nav_menu(
						array(
								'container'      => false,
								'theme_location' => 'social',
								'menu_class'     => 'social-links-menu menu',
								'depth'          => 1,
								'link_before'    => '<span class="screen-reader-text">',
								'link_after'     => '</span>',
						)
				);
				?>
			</nav><!-- .social-navigation -->
		<?php endif; ?>

		<?php get_sidebar(); ?>

	</header><!-- #masthead -->

	<?php SQ_Child_Pages::child_page_nav(); ?>

	<?php
	/*
	 * If a regular post or page, and not the front page, show the featured image.
	 * Using get_queried_object_id() here since the $post global may not be set before a call to the_post().
	 */
	if ( ( is_single() || ( is_page() && ! squire_is_frontpage() ) ) && has_post_thumbnail( get_queried_object_id() ) ) :
		echo '<div class="single-featured-image-header">';
		echo get_the_post_thumbnail( get_queried_object_id(), 'squire-featured-image' );
		echo '</div><!-- .single-featured-image-header -->';
	endif;
	?>

	<div id="content" class="site-content">

		<div class="grid-x grid-padding-x">

		<?php do_action( 'squire_before_content' ); ?>
