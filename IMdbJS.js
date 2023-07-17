const BaseURL = "https://www.omdbapi.com/";
const BaseImgURL = "http://img.omdbapi.com/";
const APIKey = "60d467f1";

document.addEventListener('DOMContentLoaded', function() {
  // Get the input field or textarea element
  const inputElement = document.getElementById('search-movie-input');
  console.log(inputElement);

  // Add event listener for the "keydown" event
  inputElement.addEventListener('keydown', function(event) {
    // Check if the pressed key is the Enter key
    if (event.key === 'Enter') {
      // Prevent the default form submission
      event.preventDefault();
      //get input value
      const searchQuery = event.target.value;
      fetchMovies(searchQuery);
      // Clear the input field or textarea
      inputElement.value = '';
    }
  });
});

// fetching the movies data from API
async function fetchMovies(searchQuery) {
  const MoviesURL = `${BaseURL}?apikey=${APIKey}&s=${searchQuery}`;
  const fetchedMovies = await fetch(MoviesURL);
  const fetchedMovJSON = await fetchedMovies.json();
  const movies = fetchedMovJSON.Search;
  displayMoviesPoster(movies);
  console.log(movies);
}

//fetching movies data into grid to display
const gridMovies = document.getElementById('Poster-grid');
function displayMoviesPoster(movies) 
{
  gridMovies.innerHTML = ""; // Clearing the grid

  movies.forEach(movie => {
    // Create a new div for each movie
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie-div'); // Add the CSS class 'movie-div' to the movieDiv

    //Creating img element
    const image = document.createElement('img');
    image.classList.add('poster-img');
    image.src = movie.Poster;
    const ImgContainer = document.createElement('div');
    ImgContainer.classList.add('Img-container');
    ImgContainer.appendChild(image);
    // adding favorite button
    const icon = document.createElement("i");
    icon.setAttribute("id", "favBtnIcon");
    icon.classList.add("fa", "fa-solid", "fa-heart");
    ImgContainer.appendChild(icon);
    movieDiv.appendChild(ImgContainer); // Add the image to the movie div
    // Add click event listener to the image
    image.addEventListener('click', function() {
      openMovieDetails(movie.imdbID);
    });

    icon.addEventListener('click', function() {
      
      dataToLocalArray(movie.imdbID);
      // addFavMov();
    });


    //creating H1 for title
    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.Title;
    movieDiv.appendChild(movieTitle);

    gridMovies.appendChild(movieDiv); // Add the movie div to the gridMovies container
  });
}

// openeing movie details on click in new page
function openMovieDetails(imdbID) 
{
  const movieDetailsURL = `${BaseURL}?apikey=${APIKey}&i=${imdbID}`;
  // Open a new page with the movie-details.html page
  const newWindow = window.open("movie-details.html", "_blank");
  // Wait for the new page to finish loading
  newWindow.onload = async function() 
  {
    const movieDetailContainer = newWindow.document.getElementById("movie-details-container");
    const abouteMovie = newWindow.document.getElementById("aboute-movie");

    // Fetch the movie details from the API
    const response = await fetch(movieDetailsURL);
    const movieDetails = await response.json();
    const movFetch = movieDetails.results;
    console.log(movFetch);

    //creating elements for displaying details
    const posterImg = newWindow.document.createElement('img');
    posterImg.classList.add('poster-img');
    posterImg.src = movieDetails.Poster;
    movieDetailContainer.appendChild(posterImg);
    //Title
    const titleElement = newWindow.document.createElement("h1");
    titleElement.textContent = movieDetails.Title;
    abouteMovie.appendChild(titleElement);
    //Actors
    const Actors = newWindow.document.createElement("p");
    Actors.innerHTML = "<strong>Actors:</strong> " + movieDetails.Actors;
    abouteMovie.appendChild(Actors);
    //Year
    const MovieYear = newWindow.document.createElement("p");
    MovieYear.innerHTML = "<strong>Year:</strong> "+ movieDetails.Year;
    abouteMovie.appendChild(MovieYear);
    //Movie Rating
    const MovieRating = newWindow.document.createElement("p");
    MovieRating.innerHTML = "<strong>Rated:</strong> "+ movieDetails.Rated;
    abouteMovie.appendChild(MovieRating);
    //Movie Language
    const MovieLang = newWindow.document.createElement("p");
    MovieLang.innerHTML = "<strong>Language:</strong> " + movieDetails.Language;
    abouteMovie.appendChild(MovieLang);
    //Movie Plot
    const plotElement = newWindow.document.createElement("p");
    plotElement.innerHTML = "<strong>Plot:</strong> " + movieDetails.Plot;
    abouteMovie.appendChild(plotElement);
  }
}

//Favorite movies list slider
const favBtn = document.getElementById('favorite');
favBtn.addEventListener("click",function(){
  // alert('working');
  openSlide();
  // addFavMov();
  
  
});
//open panel function
function openSlide() {
  // modal.style.display = "block";
  console.log("opening fav list");
  document.getElementById("panel").style.width = "300px";
}

// close panel btn function
function closePanel() {
  document.getElementById("panel").style.width = "0px";
}


// declaring the local array
localArray = [];
// Retrieve the value from local storage
var movItem = window.localStorage.getItem("mov");
// Parse the value if necessary
var localArray = JSON.parse(movItem);
var myArray = localArray;
console.log(myArray);
// function to store the current IMDb Id to local storage
function dataToLocalArray(imdbID){
  if(localArray.includes(imdbID)){
    alert('mov id is already exits');
  }
  else{
    alert('movies added');
    localArray.push(imdbID);
    let movItem = JSON.stringify(localArray);
    window.localStorage.setItem("mov",movItem);
    displayFavoriteMovie(imdbID);
  }
}

// to load the favorite movies into favorite list
window.onload = function() {
  addFavMov();
};

// function to added the fav movie id into localstorage
function addFavMov()
{
  var movItem = window.localStorage.getItem("mov");
  if (movItem) {
    var localArray = JSON.parse(movItem);
    localArray.forEach(function(imdbID) {
      console.log("Movie ID: " + imdbID);
      displayFavoriteMovie(imdbID);
    });
  } else {
    console.log("No movies found in local storage.");
  }
 
}

// function to addedd the favorite movie into favorite list
  async function displayFavoriteMovie(movieId) 
  {
    console.log(movieId);
    const movieDetailsURL = `${BaseURL}?apikey=${APIKey}&i=${movieId}`;
    console.log("working");
    const response = await fetch(movieDetailsURL);
    const movieData = await response.json();
    console.log(movieData.imdbID);
    console.log(movieData.Title);

    const favImgDiv = document.createElement('div');
    favImgDiv.classList.add('fav-img-div');
    favImgDiv.setAttribute('data-movie-id', movieId);

    const ImgDiv = document.createElement('div');
    ImgDiv.classList.add('img-Div');
    
    const TitleDiv = document.createElement('div');
    TitleDiv.classList.add('title-Div');

    const deleteDiv = document.createElement('div');
    deleteDiv.classList.add('delete-Div');
  //creating poster img
    const favImg = document.createElement('img');
    favImg.classList.add('fav-img');
    favImg.src = movieData.Poster;
    ImgDiv.appendChild(favImg);
    favImgDiv.appendChild(ImgDiv);
  //creating title icon
    const favTitle = document.createElement('p');
    favTitle.classList.add('fav-title');
    favTitle.textContent = movieData.Title;
    TitleDiv.appendChild(favTitle);
    favImgDiv.appendChild(TitleDiv);
  // ceating delted icon
    const deleteBtn = document.createElement('i');
    deleteBtn.classList.add('fa', 'fa-trash');
    deleteBtn.setAttribute('aria-label', 'Remove from Favorites');
    deleteBtn.addEventListener('click', function() {
      removeFromFavorites(movieId, favImgDiv);
    });
    deleteDiv.appendChild(deleteBtn);
    favImgDiv.appendChild(deleteDiv);
  
    FavMoviesList.appendChild(favImgDiv);
  }
  //deleting the favorite movie ID in local storage
  function removeFromFavorites(movieId, listItem) 
  {
    localStorage.removeItem(movieId);
      listItem.remove();
  }
    