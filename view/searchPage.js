import { getMovieTemplate, updateMyMovieList, sortMovies } from '../app.js';

let SearchPage = {
    render: async () => {
        let view =  /*html*/`
        <form id="movieapp">
            <fieldset class="search-container">
                <input type="text" class="input-search" id="searchTerm" placeholder="Enter a movie title">
                <button type="submit" class="btn-search">Go!</button>
                <select id="searchFilter" class="filter-search">
                    <option value="">Sort By</option>
                    <option value="title">Title</option>
                    <option value="year">Year of release</option>
                </select>
            </fieldset>
        </form>
        <section>
            <section id="results" class="movies-area">
            </section>
        </section>
        `
        return view
    }
    , after_render: async () => {
        let searchedMovieList = [];
        const form = document.getElementById('movieapp');
        const input = document.querySelector('#searchTerm');
        const resultsSection = document.querySelector('#results');

        const API_URL = 'https://omdb-api.now.sh/?type=movie&s=';

        form.addEventListener('submit', formSubmitted);

        async function formSubmitted(event) {
            event.preventDefault();
            const searchTerm = input.value;
            try {
                const results = await getResults(searchTerm);
                searchedMovieList = results;
                showResults(results);
            } catch (error) {
                showError(error);
            }
        }

        async function getResults(searchTerm) {
            const url = `${API_URL}${searchTerm}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.Error) {
                throw new Error(data.Error);
            }
            return data.Search;
        }

        function showResults(results) {
            resultsSection.innerHTML = results.reduce((html, movie) => {
                return html + getMovieTemplate(movie, 4);
            }, '');

            const addMyMoviesButtons = document.querySelectorAll('.addMyMoviesButton');
            addMyMoviesButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const { id } = button.dataset;
                    const movie = results.find(movie => movie.imdbID === id);
                    updateMyMovieList(movie);
                });
            });
        }

        function showError(error) {
            resultsSection.innerHTML = `
                <div role="alert">
                    ${error.message}
                </div>
            `;
        }

        const sortByOptions = document.getElementById('searchFilter');
        sortByOptions.addEventListener('change', (event) => {
            searchedMovieList = sortMovies(sortByOptions.value, searchedMovieList);
            window.location.href = '/#/';
            resultsSection.innerHTML = searchedMovieList.reduce((html, movie) => {
                return html + getMovieTemplate(movie, 4);
            }, '');
            const addMyMoviesButtons = document.querySelectorAll('.addMyMoviesButton');
            addMyMoviesButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const { id } = button.dataset;
                    const movie = searchedMovieList.find(movie => movie.imdbID === id);
                    updateMyMovieList(movie);
                });
            });
        });
    }

}

export default SearchPage;