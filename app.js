import Navbar from './view/Navbar.js';
import Utils from './Utils.js';
import ErrorPage from './view/Error.js';
import SearchPage from './view/searchPage.js';
import MyMovies from './view/MyMovies.js';

let myMovieList = [];

const routes = {
    '/': SearchPage,
    '/savedmovies': MyMovies
}

const router = async () => {
    const header = null || document.getElementById('header_container');
    const content = null || document.getElementById('page_container');

    header.innerHTML = await Navbar.render();
    await Navbar.after_render();

    // Get the parsed URl from the addressbar
    let request = Utils.parseRequestURL();
    let parsedURL = (request.resource ? '/' + request.resource : '/');

    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : ErrorPage
    content.innerHTML = await page.render();
    await page.after_render();
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);

//return Movie Object template to display
export function getMovieTemplate(movie, cols, button = true) {
    return `
        <div class="movieCard">
            <img class="card-img-top" src="${movie.Poster}" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">${movie.Year}</p>
                ${
                    button ? `<button data-id="${movie.imdbID}" type="button" class="addMyMoviesButton">Add</button>`
                        : `<button data-id="${movie.imdbID}" type="button" class="deleteMoviesButton">Delete</button>`
                }
            </div>
        </div>
    `;
}

// return the Movie list added to My Movies
export function updateMyMovieList(movie) {
   let tempList = myMovieList.length > 0 ? myMovieList : [];
   tempList.push(movie);
   myMovieList = [...new Set(tempList.filter(x => x.imdbID))];
}

export function deleteMovie(movie) {
    let tempList = myMovieList.length > 0 ? myMovieList : [];
    myMovieList = [...new Set(tempList.filter(x => {
        if(x.imdbID != movie.imdbID) {
            return x;
        }
    }))];
    return myMovieList;
}

export function getMyMovieList() {
    return myMovieList;
}

export function sortMovies(sortByValue, movieObj) {
    if(movieObj == null) {
        if(sortByValue == 'title') {
            myMovieList.sort(function(a, b) {
                let textA = a.Title.toUpperCase();
                let textB = b.Title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            return myMovieList;
        } else if(sortByValue == 'year'){
            myMovieList.sort(function(a, b){return a.Year - b.Year});
            return myMovieList;
        }
    } else if(movieObj.length >= 0) {
        if(sortByValue == 'title') {
            movieObj.sort(function(a, b) {
                let textA = a.Title.toUpperCase();
                let textB = b.Title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            return movieObj;
        } else if(sortByValue == 'year'){
            movieObj.sort(function(a, b){return a.Year - b.Year});
            return movieObj;
        }
    }
}