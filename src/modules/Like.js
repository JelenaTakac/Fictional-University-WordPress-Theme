import axios from 'axios';

class Like {
    constructor() {
        if (document.querySelector(".like-box")) {
            axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce;
            this.likeBoxCounter = document.querySelector(".like-box");
            this.events(); // invoke events
        }

        // alert("hello like post!!");
    }

    events() {
        this.likeBoxCounter.addEventListener("click", this.ourClickDispecher.bind(this));
    }

    ourClickDispecher(e) {
        let currentLikeBox = e.target; 

        if (!currentLikeBox.classList.contains("like-box")) {
            currentLikeBox = currentLikeBox.parentElement;
            console.log(currentLikeBox);
        }
        // console.log(e.target);


        // This if/esle statement is used for toggle between like/not liked professor.
        if (this.likeBoxCounter.getAttribute("data-exists") === "yes") {
            this.deleteLike();
        } else {
            this.createLike();
        }
    }

    createLike() {
        // Want here to send HTTP request to Custom WordPress REST API
        // alert('hello create like');
    }

    deleteLike() {
        // alert("hello delte like");
    }

    // methods go here
}

export default Like;