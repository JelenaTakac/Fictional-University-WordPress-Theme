<?php 
    add_action('rest_api_init', 'universityLikeRoutes');


    function universityLikeRoutes() {

        register_rest_route('university/v1', 'manageLike', array(
            'methods' => 'POST',
            'callback' => 'createLike'
        ));
        
        register_rest_route('university/v1', 'manageLike', array(
            'methods' => 'DELETE',
            'callback' => 'deleteLike'
        ));
    }

    function createLike($data) {
        // Programatically create a new like post
        // return "Thanks for trying create a like";
        // Programatically create a new post roght from PHP - we can check this new created post in the WordPress dashboard!

        if (is_user_logged_in()) {
            $professor = sanitize_text_field($data['professorId']);

            $existQuery = new WP_Query(array(
                'author' => get_current_user_id(),
                'post_type' => 'like',
                'meta_query' => array(
                    array(
                        'key' => 'liked_professor_id',
                        'compare' => '=',
                        'value' => $professor
                    )
                )
            ));

            if ($existQuery->found_posts == 0 AND get_post_type($professor) == 'professor') {
            return wp_insert_post(array(
                    'post_type' => 'like',
                    'post_status' => 'publish',
                    'post_title' => '2nd PHP Test',
                    // How to assign value to custom field liked_professor_id
                    'meta_input' => array(
                        'liked_professor_id' => $professor
                    )
                ));
            } else {
                die("Invalid professor id");
            }
            
        } else {
            die("Only logged in users can create a like.");
        }


    }
    
    function deleteLike() {
        // Programatically delete a new like post
        return "Thanks for trying delete a like";

    }
   

?>