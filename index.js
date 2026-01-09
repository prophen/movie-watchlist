const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const pagesContainer = document.getElementById("pages-container");
const startExploring = document.querySelector(".start-exploring");
const moviesContainer = document.getElementById("movies-container");

const allResults = [];

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(searchInput.value);
  fetch(
    `http://www.omdbapi.com/?s=${searchInput.value}&apikey=fa8c1227&type=movie&plot=short`
  )
    .then((res) => res.json())
    .then((data) => {
      allResults.push(...data.Search);

      let numPages =
        data.totalResults > 10 ? Math.ceil(data.totalResults / 10) : 1;
      console.log(allResults);
      console.log(numPages);
      renderPageLinks(numPages);
    });
});

function renderPageLinks(pages) {
  if (pages > 1) {
    for (let i = 2; i <= pages; i++) {
      pagesContainer.classList.toggle("hidden");
      pagesContainer.innerHTML += `
    <li><button class="page-btn" data-page=${i}>${i}</button></li>
    `;
      startExploring.style.display = "none";
      moviesContainer.style.display = "block";
    }
  }
}
