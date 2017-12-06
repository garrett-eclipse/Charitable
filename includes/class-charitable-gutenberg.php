<?php
/**
 * Integrate Charitable into the Gutenberg post editor experience.
 *
 * @package   Charitable/Classes/Charitable_Gutenberg
 * @version   1.6.0
 * @author    Eric Daams
 * @copyright Copyright (c) 2017, Studio 164a
 * @license   http://opensource.org/licenses/gpl-2.0.php GNU Public License
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! class_exists( 'Charitable_Gutenberg' ) ) :

    /**
     * Charitable_Gutenberg
     *
     * @since 1.6.0
     */
    class Charitable_Gutenberg {

        /**
         * Create class object.
         *
         * @since 1.6.0
         */
        public function __construct() {
            $this->register_blocks();
        }

        /**
         * Register Gutenberg blocks.
         *
         * @since  1.6.0
         *
         * @return void
         */
        public function register_blocks() {
            $ret = register_block_type( 'charitable/donation-form', array(
                'attributes' => array(
                    'campaign' => array(
                        'type' => 'text',
                        'default' => 5,
                        // 'options' => array(
                        //     '1' => 'one',
                        //     '2' => 'two',
                        // ),
                    ),
                ),

                'render_callback' => array( $this, 'render_donation_form' ),
            ) );

            // echo '<pre>'; var_dump( $ret ); echo '</pre>';
        }

        /**
         * Render the donation form.
         *
         * @since  1.6.0
         *
         * @return void
         */
        public function render_donation_form() {
            
        }
    }

endif;
