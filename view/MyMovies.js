import { getMyMovieList, getMovieTemplate, deleteMovie, sortMovies } from "../app.js";

let MyMoviesPage = {
    render: async () => {
        let view =  /*html*/`
            <section class="saved-movies">
                <div class="saved-movies-header">
                    <div class="saved-movies-title"><h3>Saved Movies</h3></div>
                    <select id="filter" class="nav-filter">
                        <option value="">Sort By</option>
                        <option value="title">Title</option>
                        <option value="year">Year of release</option>
                    </select>
                </div>
                <section id="added-movies" class="movies-area">                    
                </section>
            </section>
        `
        return view;
    }
    , after_render: async () => {
        let movieList = getMyMovieList();
        const savedMovieSection = document.querySelector('#added-movies');
        
        movieList.forEach(movie => {
            savedMovieSection.innerHTML = savedMovieSection.innerHTML + getMovieTemplate(movie, 12, false);
        });

        const deleteMoviesButton = document.querySelectorAll('.deleteMoviesButton');

        deleteMoviesButton.forEach(button => {
            button.addEventListener('click', (event) => {
                const { id } = button.dataset;
                const movie = movieList.find(movie => movie.imdbID === id);
                movieList = deleteMovie(movie);
                window.location.href = '/#/';
                window.location.href = '/#/savedmovies';
                movieList.forEach(movie => {
                    savedMovieSection.innerHTML = getMovieTemplate(movie, 12, false);
                });
            });
        });

        const sortByOptions = document.getElementById('filter');
        sortByOptions.addEventListener('change', (event) => {
            movieList = sortMovies(sortByOptions.value, null);
            window.location.href = '/#/';
                window.location.href = '/#/savedmovies';
                movieList.forEach(movie => {
                    savedMovieSection.innerHTML = getMovieTemplate(movie, 12, false);
            });
        });
    }
}

export default MyMoviesPage;