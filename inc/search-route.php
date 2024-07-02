<?php

// Creating Custom REST API URL using 'rest_api_init' - in WordPress is used to register a custom REST API endpoint
add_action('rest_api_init', 'universityRegisterSearch');

/*
Quick Note: 
WP_REST_Server::READABLE = ‘GET’
WP_REST_Server::EDITABLE = ‘POST, PUT, PATCH’
WP_REST_Server::DELETABLE = ‘DELETE’

'university/v1' - is the namespace for the endpoint, which helps in organizing and versioning your routes
'search' - specifies the route within the namespace, making the full URL for the endpoint /wp-json/university/v1/search
array() -third parameter is an array of options that configure the endpoint
callback: 'universitySearchResults' - This specifies the function that will handle the request to this endpoint
'universitySearchResults' - is the one which handles the search query, processes the results, and returns the response (performs a search query, gathers data). The function returns the results, which are sent back to the client as the response to the API request
*/

function universityRegisterSearch() {
    register_rest_route('university/v1', 'search', array( 
        'methods' => WP_REST_SERVER::READABLE, 
        'callback' => 'universitySearchResults' 
    ));
}

function universitySearchResults($data) {
    $mainQuery = new WP_Query(array(
        'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'), 
        's' => sanitize_text_field($data['term'])
    ));

    $results = initializeResults();
    processMainQuery($mainQuery, $results);

    if (!empty($results['programs'])) {
        $programsMetaQuery = array('relation' => 'OR'); 
    
        foreach($results['programs'] as $item) {
            array_push($programsMetaQuery, array(
                'key' => 'related_programs',
                'compare' => 'LIKE',
                'value' => '"' . $item['id'] . '"'
                )
            );
        }
        $programRelationshipQuery = new WP_Query(array(
            'post_type' => array('professor', 'event'),
            'meta_query' => $programsMetaQuery
        ));

        processProgramRelationshipQuery($programRelationshipQuery, $results);
    }

    return $results;
}

function initializeResults() {
    return array(
        'generalInfo' => array(),
        'professors' => array(),
        'programs' => array(),
        'events' => array(),
        'campuses' => array()
    );
}

// The & (ampersand) in the function argument &$results indicates that the $results parameter is passed by reference.
// Passing by Reference: When you pass a variable by reference using &, the function gets a reference to the original variable. Any changes made to the variable inside the function will directly affect the original variable.

function processMainQuery($query, &$results) {
    while($query->have_posts()) {
        $query->the_post();
        $postType = get_post_type();

        switch ($postType) {
            case 'post':
            case 'page':    
                addToGeneralInfo($results['generalInfo']);
                break;
            case 'program':    
                addToPrograms($results['programs'], $results['campuses']);
                break;
            case 'professor':    
                addToProfessors($results['professors']);
                break;
            case 'campus':    
                addToCampuses($results['campuses']);
                break;
            case 'event':    
                addToEvents($results['events']);
                break;
        }
    }
}

function addToGeneralInfo(&$generalInfo) {
    array_push($generalInfo, array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'postType' => get_post_type(),
        'authorName' => get_the_author()
    ));
}

function addToPrograms(&$programs, &$campuses) {
    $relatedCampuses = get_field('related_campus');

    // If there is one or more campuses related to the post type program, then go through those campuses and fill subarray campuses with information.
    if ($relatedCampuses) {
        foreach ($relatedCampuses as $campus) {
            array_push($campuses, array(
                'title' => get_the_title($campus),
                'permalink' => get_the_permalink($campus)
            ));
        }
    }
    array_push($programs, array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_ID()
    ));
}

function addToProfessors(&$professors) {
    array_push($professors, array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0, 'professorLandscape') // 0 - means current image of post, and 'professorLandscape' means of image size
    ));
}

function addToCampuses(&$campuses) {
    array_push($campuses, array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
    ));
}

function addToEvents(&$events) {
    $eventDate = new DateTime(get_field('event_date'));
    $description = null;
    if (has_excerpt()) {
        $description =  get_the_excerpt();
    } else {
        $description =  wp_trim_words(get_the_content(), 18);
    }

    array_push($events, array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
    ));
}

function processProgramRelationshipQuery($query, &$results) {
    while ($query->have_posts()) {
        $query->the_post();
        $postType = get_post_type();

        switch ($postType) {
            case 'event':
                addToEvents($results['events']);
                break;
            case 'professor':
                addToProfessors($results['professors']);
                break;
        }
    }

    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
    $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
}

?>