import axios from "axios";

class Search {
    // 1. Describe and create/innitiate our object
    constructor() {
        this.addSearchHTML()
        this.resultsDiv = document.querySelector("#search-overlay__results")
        this.openButton = document.querySelectorAll(".js-search-trigger")
        this.closeButton = document.querySelector(".search-overlay__close")
        this.searchOverlay = document.querySelector(".search-overlay")
        this.searchField = document.querySelector("#search-term")
        this.isOverlayOpen = false
        this.isSpinnerVisible = false
        this.previousValue
        this.typingTimer
        this.events()
    }

    // 2. Events - make connection between construct properties and methods 
    events() {
        this.openButton.forEach(el => {
            el.addEventListener("click", e => {
                e.preventDefault()
                this.openOverlay()
            })
        })

        this.closeButton.addEventListener("click", () => this.closeOverlay())
        document.addEventListener("keydown", e => this.keyPressDispatcher(e))
        this.searchField.addEventListener("keyup", () => this.typingLogic())
    }

    // 3. Where methods/functions/actions live
    typingLogic() {
        if (this.searchField.value != this.previousValue) {
            clearTimeout(this.typingTimer)

            if (this.searchField.value) {
                if (!this.isSpinnerVisible) {
                    this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>'
                    this.isSpinnerVisible = true
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750)
            } else {
                this.resultsDiv.innerHTML = ""
                this.isSpinnerVisible = false
            }
        }

        this.previousValue = this.searchField.value
    }


    async getResults() {
        try {
            const response = await axios.get(`/wp-json/university/v1/search?term=${this.searchField.value}`)
            const results = response.data;
            this.resultsDiv.innerHTML = `
                <div clss="row">
                   <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.generalInfo.length 
                            ? 
                            `<ul class="link-list min-list">
                                ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join("")}
                            </ul>`
                            : 
                            `<p>No general information matches that search.</p>`
                        }
                   </div> 
                   <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.programs.length 
                            ? 
                            `<ul class="link-list min-list">
                                ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
                            </ul>`
                            : 
                            `<p>No programs matches that search.<a href="/programs">View all programs</a></p>`
                        }
                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.professors.length 
                            ? 
                            `<ul class="professor-cards">
                                ${results.professors.map(item => `
                                    <li class="professor-card__list-item">
                                        <a class="professor-card" href="${item.permalink}">
                                            <img class="professor-card__image" src="${item.image}">
                                            <span class="professor-card__name">${item.title}</span>
                                        </a>
                                    </li>
                                `).join("")}
                            </ul>`
                            : 
                            `<p>No professors matches that search.</a></p>`
                        }
                   </div> 
                   <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                          ${results.campuses.length 
                            ? 
                            `<ul class="link-list min-list">
                                ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
                            </ul>`
                            : 
                            `<p>No campuses matches that search.<a href="/campuses">View all campuses</a></p>`
                        }
                        <h2 class="search-overlay__section-title">Events</h2>
                         ${results.events.length 
                            ? 
                            `${results.events.map(item => `
                            <div class="event-summary">
                                <a class="event-summary__date t-center" href="${item.permalink}">
                                    <span class="event-summary__month">${item.month}</span>
                                    <span class="event-summary__day">${item.day}</span>
                                </a>
                                <div class="event-summary__content">
                                    <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                                    <p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
                                </div>
                            </div>
                            `).join("")}`
                            : 
                            `<p>No events matches that search.<a href="/events">View all events</a></p>`
                        }
                   </div> 
                </div>
                
                `;
            this.isSpinnerVisible = false;
        } catch (e) {
            console.log(e);
        }
    }

    keyPressDispatcher(e) {
        if (e.keyCode == 83 && !this.isOverlayOpen && document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
            this.openOverlay()
        }

        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay()
        }
    }

    openOverlay() {
        this.searchOverlay.classList.add("search-overlay--active")
        document.body.classList.add("body-no-scroll")
        this.searchField.value = ""
        setTimeout(() => this.searchField.focus(), 301)
        console.log("our open method just ran!")
        this.isOverlayOpen = true;
        // return false will prevent the default behavior of ~a~ or link elements (because we set <a href="/search"... in header.php to apply when the JS code is disabled)
        return false;
    }

    closeOverlay() {
        this.searchOverlay.classList.remove("search-overlay--active")
        document.body.classList.remove("body-no-scroll")
        console.log("our close method just ran!")
        this.isOverlayOpen = false
    }

    addSearchHTML() {
       document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div class="search-overlay">
            <div class="search-overlay__top">
            <div class="container">
                <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
                <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
            </div>
            </div>
            
            <div class="container">
            <div id="search-overlay__results"></div>
            </div>

        </div>
        `
        )
    }
}

export default Search;