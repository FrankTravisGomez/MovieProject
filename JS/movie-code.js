console.log("is it working");

fetch('https://developing-shadowed-rayon.glitch.me/movies')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        renderMovies(data);
    })
    .catch(error => console.error(error));

function renderMovie(movie, id) {
    return `
    <div class="col item" id="${id}">
      <div class="weather-card">
        <div class="top">
          <div class="wrapper">
            <h1 class="heading">${movie.title}</h1>
            <h3 class="location"></h3>
          </div>
        </div>
        <div class="bottom">
          <div class="wrapper">
            <ul class="forecast">
              <li class="active">
                <span class="date">${movie.director}</span>
              </li>
              <li>
                <span class="date">${movie.genre}</span>
                <p>Movie Rating: ${movie.rating}/10</p>
              </li>
            </ul>
          </div>
          <div class="delete-button">
            <button class="btn btn-danger" onclick="deleteMovie(event)" data-movie-id="${id}">Delete</button>
          </div>
        </div>
      </div>
    </div>`;
}

function renderMovies(movies) {
    let html = '';
    for (let i = movies.length - 1; i >= 0; i--) {
        let id = 'movie-' + i;
        html += renderMovie(movies[i], id);
    }
    document.getElementById('movieRow').innerHTML = html;
}

function renderModal(movie) {
    return `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <img src="${movie.image}">
          </div>
          <h5 class="modal-title">${movie.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Directed By: ${movie.director}</p>
          <p>Movie description: ${movie.description}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>`;
}

function searchAndRenderModal() {
    const searchTerm = document.getElementById('searchBar').value;
    fetch(`https://developing-shadowed-rayon.glitch.me/movies?q=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                let movie;
                if (searchTerm === '') {
                    return;
                } else {
                    movie = data.find(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()));
                }
                if (movie) {
                    const modalContent = renderModal(movie);
                    const modal = document.getElementById('modal');
                    modal.innerHTML = modalContent;
                    const modalInstance = new bootstrap.Modal(modal);
                    modalInstance.show();
                } else {
                    console.log("No movies found matching that search");
                }
            } else {
                console.log("No movies found");
            }
        })
        .catch(error => console.error(error));
}

const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchAndRenderModal);

function postMovie() {
    const movieTitle = document.querySelector("#title").value;
    const movieDirector = document.querySelector("#directorName").value;
    const movieGenre = document.querySelector("#genre").value;
    const movieRating = document.querySelector("#rating").value;

    const movieData = {
        title: movieTitle,
        director: movieDirector,
        genre: movieGenre,
        rating: movieRating
    };

    fetch('https://developing-shadowed-rayon.glitch.me/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieData)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

const postMovieButton = document.getElementById('submitMovie');
postMovieButton.addEventListener('click', postMovie);

function deleteMovie(event) {
    const id = event.target.dataset.movieId;
    const element = document.getElementById(id);
    element.remove();
}

const deleteMovieButton = document.getElementById('deleteMovieButton');
deleteMovieButton.addEventListener('click', deleteMovie);
