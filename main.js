const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const movieContainer = document.getElementById("movie-container")

let minusBtn = "https://www.svgrepo.com/show/364661/minus-circle-fill.svg"
let plusBtn = "https://static-00.iconduck.com/assets.00/plus-circle-icon-512x512-qd3dnhjf.png"

let apiKey = "7d1cebc2";
let watchList = []
let movieData = []

document.addEventListener("click", (e) => {
  let id = e.target.dataset.id
  if (id) {
    if (watchList.includes(id)) {
      removeFromWatchlist(id)
    } else {
      addToWatchlist(id)
    }
  }
})

function addToWatchlist(movieID) {
  watchList.push(movieID)
  localStorage.setItem("moviesData", [...watchList])
  movieContainer.innerHTML = ""
  generateHTML()
}

function removeFromWatchlist(movieID) {
  watchList = watchList.filter(item => item !== movieID)
  localStorage.setItem("moviesData", [...watchList])
  movieContainer.innerHTML = ""
  generateHTML()
}

searchBtn.addEventListener("click", makeRequest);

function makeRequest() {
  let movieName = searchInput.value;
  movieContainer.innerHTML = ""
  movieData = []
  fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}`)
  .then(resp => resp.json())
  .then(data => {
    fetchMovieSpecificData(data["Search"])
  });
}

function fetchMovieSpecificData(movies) {
  for (let movie of movies) {
    const movieID = movie["imdbID"]
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieID}`)
    .then(resp => resp.json())
    .then(data => {
      movieData.push(data)
      generateHTML(data)
    })
  } 
}

function generateHTML(movieItem) {
  if (movieItem) {
    const {Title, Ratings, Runtime, Poster, Genre, Plot, imdbID} = movieItem
    const rating = Ratings[0].Value
    const buttonText = watchList.includes(imdbID) ? "Remove" : "Watchlist"

    movieContainer.innerHTML +=  `
    <div class="poster-container">
      <img class="movie-poster" src="${Poster}" alt=" movie poster" />
      <div class="movie-info">
        <div class="top-row">
          <p class="movie-title">${Title}</p>
          <p>⭐ ${rating}</p>
        </div>
        <div class="second-row">
          <p>${Runtime}</p>
          <p>${Genre}</p>
          <div class="watchlist-container">
            <button class="watchlist-btn">
              <img data-id="${imdbID}" class="plus-btn" src="${watchList.includes(imdbID) ? minusBtn : plusBtn}" />
              <p>${buttonText}</p>
            </button>
          </div>
        </div>
        <p class="movie-plot">${Plot}</p>
      </div>
    </div>
    `
  } else {
    movieContainer.innerHTML += movieData.map((movie) => {

      const {Title, Ratings, Runtime, Poster, Genre, Plot, imdbID} = movie
      const rating = Ratings[0].Value
      const buttonText = watchList.includes(imdbID) ? "Remove" : "Watchlist"

      return `
      <div class="poster-container">
        <img class="movie-poster" src="${Poster}" alt=" movie poster" />
        <div class="movie-info">
          <div class="top-row">
            <p class="movie-title">${Title}</p>
            <p>⭐ ${rating}</p>
          </div>
          <div class="second-row">
            <p>${Runtime}</p>
            <p>${Genre}</p>
            <div class="watchlist-container">
              <button class="watchlist-btn">
                <img data-id="${imdbID}" class="plus-btn" src="${watchList.includes(imdbID) ? minusBtn : plusBtn}" />
                <p>${buttonText}</p>
              </button>
            </div>
          </div>
          <p class="movie-plot">${Plot}</p>
        </div>
      </div>
      `
      }).join("")
  }
}

function fetchMovies() {
  let movieIDs = localStorage.getItem("moviesData").split(",")
  watchList = movieIDs
  for (let id of movieIDs) {
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
    .then(resp => resp.json())
    .then(data => {
      movieData.push(data)
      generateHTML(data)
    })
  } 
}
