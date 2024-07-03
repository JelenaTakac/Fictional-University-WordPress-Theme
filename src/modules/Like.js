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

        while (!currentLikeBox.classList.contains("like-box")) {
            currentLikeBox = currentLikeBox.parentElement;
            console.log(currentLikeBox);
        }
        // console.log(e.target);


        // This if/esle statement is used for toggle between like/not liked professor.
        if (currentLikeBox.getAttribute("data-exists") == "yes") {
            this.deleteLike(currentLikeBox)
        } else {
            this.createLike(currentLikeBox)
        }
    }

    async createLike(currentLikeBox) {
        // Want here to send HTTP request to Custom WordPress REST API
        // alert('hello create like');

        // Ovjde treba preko JS da proslijedim ID profesora kako bi ga mogli iskoristiti u createLike() metofi u like-route.php kod wp_insert_post

        // Ovu informaciju saljem na server(PHP REST API)
        // let newDataLike = {'professorId': 789};
        let professorID = {'professorId': currentLikeBox.getAttribute("data-professor")};

        try {
            const response = await axios.post(`/wp-json/university/v1/manageLike`, professorID);
            currentLikeBox.setAttribute("data-exists", 'yes');
            let likeCount = parseInt(document.querySelector(".like-count").innerHTML, 10);
            likeCount++;
            currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
            currentLikeBox.setAttribute("data-like", response.data)
            console.log('congrats');
            console.log(response);
        } catch (error) {
            console.log('sorry');
            console.log(error);
        }
    }

    async deleteLike(currentLikeBox) {
        // alert("hello delte like");

        let likePostID = { "like": currentLikeBox.getAttribute("data-like") };

        try {
            const response = await axios.delete(`/wp-json/university/v1/manageLike`, likePostID);
            currentLikeBox.setAttribute("data-exists", "no")
            let likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10);
            likeCount--;
            currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
            currentLikeBox.setAttribute("data-like", "");
            console.log('congrats');
            console.log(response);
        } catch (error) {
            console.log('sorry');
            console.log(error);
        }
    }

    // methods go here
}

export default Like;