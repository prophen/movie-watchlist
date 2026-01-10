const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const watchlistContainer = document.getElementById("watchlist-container");
const MAX_PLOT_LENGTH = 180;

if (watchlist.length > 0) {
  renderWatchlist(watchlist);
}

function getPlotPreview(plotText) {
  const plot = plotText && plotText !== "N/A" ? plotText.trim() : "N/A";
  if (plot === "N/A" || plot.length <= MAX_PLOT_LENGTH) {
    return { text: plot, truncated: false };
  }
  return { text: `${plot.slice(0, MAX_PLOT_LENGTH)}…`, truncated: true };
}

watchlistContainer.addEventListener("click", (event) => {
  const readMoreButton = event.target.closest(".read-more");
  if (readMoreButton) {
    const movieCard = readMoreButton.closest(".movie");
    const plotEl = movieCard.querySelector(".plot-text");
    const fullPlot = decodeURIComponent(plotEl.dataset.full || "");
    const shortPlot = decodeURIComponent(plotEl.dataset.short || "");
    const isExpanded = readMoreButton.dataset.expanded === "true";
    plotEl.textContent = isExpanded ? shortPlot : fullPlot;
    readMoreButton.dataset.expanded = isExpanded ? "false" : "true";
    readMoreButton.textContent = isExpanded ? "Read more" : "Show less";
    return;
  }
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
  if (moviesArr.length === 0) {
    watchlistContainer.style.paddingTop = "181px";

    watchlistContainer.innerHTML = `
      <p>Your watchlist is looking a little empty...</p>
      <div class="add-movies-text">
        <img src="images/plus.png" alt="plus icon" />
        <span><a href="index.html">Let's add some movies!</a></span>
      </div>
    `;
    return;
  }
  watchlistContainer.style.paddingTop = "28px";
  document.getElementById(
    "watchlist-container"
  ).innerHTML = `<section class="watchlist-movies-list"></section>`;

  moviesArr.forEach((movie) => {
    const posterUrl =
      movie.poster && movie.poster !== "N/A"
        ? movie.poster
        : "images/placeholder.svg";
    const plotPreview = getPlotPreview(movie.plot || "");
    const fullPlot = encodeURIComponent(movie.plot || "");
    const shortPlot = encodeURIComponent(plotPreview.text);
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
          <p class="plot-text" data-full="${fullPlot}" data-short="${shortPlot}">${
      plotPreview.text
    }</p>
          ${
            plotPreview.truncated
              ? `<button class="read-more" type="button" data-expanded="false">Read more</button>`
              : ""
          }
        </div>
      </div>
    </div>
    `;
  });
}
