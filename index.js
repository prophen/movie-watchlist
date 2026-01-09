const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const pagesContainer = document.getElementById("pages-container");
const startExploring = document.querySelector(".start-exploring");
const moviesContainer = document.getElementById("movies-container");
const moviesList = document.querySelector(".movies-list");

let currentQuery = "";
const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function isInWatchlist(imdbID) {
  return watchlist.some((movie) => movie.imdbID === imdbID);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  moviesList.innerHTML = "";
  pagesContainer.innerHTML = "";
  pagesContainer.classList.add("hidden");
  currentQuery = searchInput.value.trim();
  if (!currentQuery) {
    return;
  }
  fetch(
    `http://www.omdbapi.com/?s=${encodeURIComponent(
      currentQuery
    )}&apikey=fa8c1227&type=movie&page=1`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "False") {
        startExploring.style.display = "flex";
        moviesContainer.style.display = "flex";
        return;
      }
      const imdbIDs = data.Search.map((movie) => movie.imdbID);
      const numPages =
        data.totalResults > 10 ? Math.ceil(data.totalResults / 10) : 1;

      startExploring.style.display = "none";
      moviesContainer.style.display = "block";
      renderPageLinks(numPages, 1);
      getMoviesList(imdbIDs);
    });
});

moviesList.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-watchlist");
  if (!button) {
    return;
  }
  if (isInWatchlist(button.id)) {
    button.disabled = true;
    return;
  }
  const movie = {
    imdbID: button.id,
    poster: button.dataset.poster,
    title: button.dataset.title,
    rating: button.dataset.rating,
    runtime: button.dataset.runtime,
    genre: button.dataset.genre,
    plot: decodeURIComponent(button.dataset.plot || ""),
  };
  watchlist.push(movie);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  button.disabled = true;
  console.log(watchlist);
  console.log("clicked");
});

function renderPageLinks(pages, activePage = 1) {
  if (pages <= 1) {
    return;
  }
  pagesContainer.classList.remove("hidden");
  for (let i = 1; i <= pages; i++) {
    pagesContainer.innerHTML += `
    <li><button class="page-btn${i === activePage ? " is-active" : ""}" id="page-${i}" data-page="${i}" ${i === activePage ? "disabled" : ""}>${i}</button></li>
    `;
  }
}

pagesContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".page-btn");
  if (!button) {
    return;
  }
  const page = Number(button.dataset.page);
  moviesList.innerHTML = "";
  pagesContainer.querySelectorAll(".page-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn === button);
    btn.disabled = btn === button;
  });
  fetch(
    `http://www.omdbapi.com/?s=${encodeURIComponent(
      currentQuery
    )}&apikey=fa8c1227&type=movie&page=${page}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === "False") {
        return;
      }
      const imdbIDs = data.Search.map((movie) => movie.imdbID);
      getMoviesList(imdbIDs);
    });
});

function getMoviesList(moviesIMBDArr) {
  moviesIMBDArr.forEach((id) => {
    fetch(
      `http://www.omdbapi.com/?i=${id}&apikey=fa8c1227&type=movie&plot=full`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        renderMovie(data);
      });
  });
}

function renderMovie(movieObj) {
  const isDisabled = isInWatchlist(movieObj.imdbID);
  const posterUrl =
    movieObj.Poster && movieObj.Poster !== "N/A"
      ? movieObj.Poster
      : "images/placeholder.svg";
  moviesList.innerHTML += `
    <div class="movie">
      <img
        class="movie-poster"
        src="${posterUrl}"
        onerror="this.src='images/placeholder.svg'"
        alt="${movieObj.Title} movie poster"
      />
      <div class="movie-text">
        <div class="movie-title">
          <h2>${movieObj.Title}</h2>
          <img src="images/star.png" alt="star" class="star-icon" />
          <span class="rating">${movieObj.imdbRating}</span>
        </div>
        <div class="movie-info">
          <span class="duration">${movieObj.Runtime}</span>
          <span class="genre">${movieObj.Genre}</span>
          <button 
            class="add-to-watchlist"
            data-poster="${posterUrl}"
            data-title="${movieObj.Title}"
            data-rating="${movieObj.imdbRating}"
            data-runtime="${movieObj.Runtime}"
            data-genre="${movieObj.Genre}"
            data-plot="${encodeURIComponent(movieObj.Plot || "")}"
            id="${movieObj.imdbID}"
            ${isDisabled ? "disabled" : ""}
          >
            <img src="images/plus.png" alt="plus icon" />
            <span>Watchlist</span>
          </button>
        </div>
        <div class="plot">
          ${movieObj.Plot}
        </div>
      </div>
    </div>
  `;
}
