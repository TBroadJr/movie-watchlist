
let apiKey = "7d1cebc2";

let movieData = []
let watchList = []

let minusBtn = "https://www.svgrepo.com/show/364661/minus-circle-fill.svg"
let plusBtn = "https://static-00.iconduck.com/assets.00/plus-circle-icon-512x512-qd3dnhjf.png"

const watchlistContainer = document.getElementById("watchlist-container")

document.addEventListener("click", (e) => {
  let id = e.target.dataset.id
  if (id) {
    removeFromWatchlist(id)
  }
})

function removeFromWatchlist(movieID) {
  watchList = watchList.filter(item => item !== movieID)
  localStorage.setItem("moviesData", [...watchList])
  watchlistContainer.innerHTML = ""
  if (watchList.length > 0) {
    fetchMovies()
  }
}

function fetchMovies() {
  let movieIDs = localStorage.getItem("moviesData").split(",")
  watchList = movieIDs
  console.log(movieIDs)
  for (let id of movieIDs) {
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
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

    watchlistContainer.innerHTML +=  `
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
    watchlistContainer.innerHTML += movieData.map((movie) => {

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


if (localStorage.getItem("moviesData")) {
  fetchMovies()
}
