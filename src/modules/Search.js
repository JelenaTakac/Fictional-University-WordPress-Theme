import $ from "jquery";


class Search {
    // 1. Describe and create/innitiate our object
    constructor() {
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.events();
        this.isOverlayOpen = false;
    }

    // 2. Events - make connection between construct properties and methods 
    events() {
        // on method changes value of ~this~  keyword to pointing the HTML element on which is clicked on!
        // We need to call bind() function and send the this value!
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keydown", this.keyPressdDispatcer.bind(this));
    }

    // 3. Where methods/functions/actions live
    keyPressdDispatcer(e) {

        if (e.keyCode == 83 && !this.isOverlayOpen) {
            this.openOverlay();
        }
        if (e.keyCode == 27 && this.isOverlayOpen) {
          this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }


}

export default Search;