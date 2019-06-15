import { getMyMovieList } from '../app.js';

let Navbar = {
    render: async () => {
        let view =  /*html*/`
            <div class="nav-container">
                <div class="nav-title">
                    <h2>Movies App<h2>
                </div>
                <div id="navbarList" class="nav-items" aria-expanded="false">
                    <a href="/#/">Search and Add Movies</a>
                    <a href="/#/savedmovies">My Movie Libray</a>
                </div>
            </div>
        `
        return view
    },
    after_render: async () => {
        window.onscroll = function () { 
            fixNavbarOnTop();
        };

        let navbar = document.getElementById("navbarList");
        let sticky = navbar.offsetTop;

        function fixNavbarOnTop() {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky")
            } else {
                navbar.classList.remove("sticky");
            }
        }
    }

}

export default Navbar;