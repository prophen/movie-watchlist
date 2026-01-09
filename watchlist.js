const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const watchlistContainer = document.getElementById("watchlist-container");

if (watchlist.length > 0) {
  renderWatchlist(watchlist);
}

watchlistContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-from-watchlist");
  if (!button) {
    return;
  }
  const movieId = button.id;
  const movieIndex = watchlist.findIndex((movie) => movie.imdbID === movieId);
  if (movieIndex === -1) {
    return;
  }
  watchlist.splice(movieIndex, 1);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist(watchlist);
});

function renderWatchlist(moviesArr) {
  console.log(moviesArr);
  if (moviesArr.length === 0) {
    watchlistContainer.innerHTML = `
      <p>Your watchlist is looking a little empty...</p>
      <div class="add-movies-text">
        <img src="images/plus.png" alt="plus icon" />
        <span><a href="index.html">Let's add some movies!</a></span>
      </div>
    `;
    return;
  }
  document.getElementById(
    "watchlist-container"
  ).innerHTML = `<section class="watchlist-movies-list"></section>`;

  moviesArr.forEach((movie) => {
    const posterUrl =
      movie.poster && movie.poster !== "N/A"
        ? movie.poster
        : "images/placeholder.svg";
    document.querySelector(".watchlist-movies-list").innerHTML += `
    <div class="movie">
      <img
        class="movie-poster"
        src="${posterUrl}"
        onerror="this.src='images/placeholder.svg'"
        alt="${movie.title} movie poster"
      />
      <div class="movie-text">
        <div class="movie-title">
          <h2>${movie.title}</h2>
          <img src="images/star.png" alt="star" class="star-icon" />
          <span class="rating">${movie.rating}</span>
        </div>
        <div class="movie-info">
          <span class="duration">${movie.runtime}</span>
          <span class="genre">${movie.genre}</span>
          <button 
            class="remove-from-watchlist"
            id="${movie.imdbID}"
            
          >
            <img src="images/minus.png" alt="minus icon" />
            <span>Remove</span>
          </button>
        </div>
        <div class="plot">
          ${movie.plot}
        </div>
      </div>
    </div>
    `;
  });
}
