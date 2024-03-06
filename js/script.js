const siteTitle = document.querySelector('#title');
const rollButtonDiv = document.querySelector('#rollButtonDiv');
const rollButton = document.querySelector('#roll');
const movieTitle = document.querySelector('#movieTitle');
const director = document.querySelector('#director');
const rating = document.querySelector('#rating');
const runtime = document.querySelector('#runtime');
const filmURL = document.querySelector('#filmURL');
const genre = document.querySelector('#genre');
const poster = document.querySelector('#poster');
const rollNumber = document.querySelector('#rollNumber');
let howManyRolls = 0;

// Function to load and parse CSV file
function loadCSV() {
	return new Promise((resolve, reject) => {
		fetch('./assets/movieList.csv')
			.then((response) => response.text())
			.then((data) => {
				Papa.parse(data, {
					header: true,
					complete: (result) => {
						resolve(result.data);
					},
					error: (error) => {
						reject(error.message);
					},
				});
			})
			.catch((error) => reject(error));
	});
}

// Function to get a random movie from the CSV data
function getRandomMovie(movieList) {
	const randomIndex = Math.floor(Math.random() * movieList.length);
	return movieList[randomIndex];
}

// Main function
async function getRandomMovieDetails() {
	try {
		const movieList = await loadCSV();
		const randomMovie = getRandomMovie(movieList);

		// Display or use the details as needed
		movieTitle.textContent = `${randomMovie['Film_title']} (${randomMovie['Release_year']})`;
		director.textContent = `Directed by ${randomMovie['Director']}`;
		rating.textContent = `Rated ${randomMovie['Average_rating']}/5 Stars`;
		runtime.textContent = `Runtime: ${randomMovie['Runtime']} Minutes`;
		filmURL.textContent = 'View on Letterboxd';
		filmURL.href = randomMovie['Film_URL'];
		genre.textContent = `Genres: ${randomMovie['Genres'].replace(
			/['"\[\]]/g,
			''
		)}`;

		getPoster(`${randomMovie['Film_title']}`);
	} catch (error) {
		alert('Error loading movie details. Try Again later.');
	}
}

// What happens when the roll button is clicked
rollButton.addEventListener('click', () => {
	howManyRolls++;
	rollNumber.textContent = `Rolls: ${howManyRolls}`;
	siteTitle.style.cssText = 'font-size: 2.5rem; left: 0;';
	rollButtonDiv.style.cssText = 'top: 0; right: 0';
	rollButton.style.cssText = 'font-size: 1rem';
	rollButton.textContent = 'Again!';

	// Call the main function
	getRandomMovieDetails();
});

async function getPoster(query) {
	try {
		const posterGetter = await fetch(
			`https://api.themoviedb.org/3/search/movie?api_key=64d2f9e5fe3ec3227822b992f289c005&query=${query}&include_adult=true&language=en-US&page=1`,
			{ mode: 'cors' }
		);

		// Await on the json() method to get the actual response data
		const theResponse = await posterGetter.json();

		// Check if results are available
		if (theResponse.results && theResponse.results.length > 0) {
			// Access the first result's poster path
			const posterPath = theResponse.results[0].poster_path;

			// Set the poster src using the full URL
			poster.src = `https://image.tmdb.org/t/p/w500/${posterPath}`;
		} else {
			// Handle the case where no results are found
			poster.src = `./assets/posternotfound.svg`;
		}
	} catch (error) {
		// Handle fetch or other errors
		poster.src = `./assets/posternotfound.svg`;
	}
}
