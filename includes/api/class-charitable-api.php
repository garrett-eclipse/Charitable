<?php
/**
 * Responsible for registering & managing the Charitable API.
 *
 * @package   Charitable/Classes/Charitable_API
 * @author    Eric Daams
 * @copyright Copyright (c) 2018, Studio 164a
 * @license   http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since     1.7.0
 * @version   1.7.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Charitable_API' ) ) :

	/**
	 * Charitable_API
	 *
	 * @since 1.7.0
	 */
	class Charitable_API {

		/**
		 * Create class object.
		 *
		 * @since 1.7.0
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
			add_filter( 'rest_campaign_collection_params', array( $this, 'add_active_status_parameter' ) );
			add_filter( 'rest_campaign_query', array( $this, 'filter_campaigns_by_active_status' ), 10, 2 );
		}

		/**
		 * Register REST API routes.
		 *
		 * @since  1.7.0
		 *
		 * @return void
		 */
		public function register_routes() {
			$route = new Charitable_API_Route_Reports();
			$route->register_routes();
		}

		/**
		 * Filter collection parameters for the campaigns post type.
		 *
		 * @since  1.7.0
		 *
		 * @param  array $query_params JSON Schema-formatted collection parameters.
		 * @return mixed
		 */
		public function add_active_status_parameter( $query_params ) {
			$query_params['active_status'] = array(
				'description' => __( 'Limit result set to campaigns that are active or inactive.' ),
				'type'        => 'string',
				'default'     => '',
				'enum'        => array( '', 'active', 'inactive' ),
			);

			return $query_params;
		}

		/**
		 * Filter the query arguments for a campaigns request.
		 *
		 * @since  1.7.0
		 *
		 * @param  array           $args    Key value array of query var to query value.
		 * @param  WP_REST_Request $request The request used.
		 * @return array
		 */
		public function filter_campaigns_by_active_status( $args, WP_REST_Request $request ) {
			if ( isset( $request['active_status'] ) ) {
				switch ( $request['active_status'] ) {
					case 'active':
						$args['meta_query'] = array(
							'relation' => 'OR',
							array(
								'key'     => '_campaign_end_date',
								'value'   => date( 'Y-m-d H:i:s' ),
								'compare' => '>=',
								'type'    => 'datetime',
							),
							array(
								'key'     => '_campaign_end_date',
								'value'   => 0,
								'compare' => '=',
							),
						);
						break;

					case 'inactive':
						$args['meta_query'] = array(
							array(
								'key'     => '_campaign_end_date',
								'value'   => date( 'Y-m-d H:i:s' ),
								'compare' => '<',
								'type'    => 'datetime',
							),
						);
						break;
				}
			}

			return $args;
		}
	}

endif;
