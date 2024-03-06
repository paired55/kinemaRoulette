const siteTitle = document.querySelector('#title');
const rollButtonDiv = document.querySelector('#rollButtonDiv');
const rollButton = document.querySelector('#roll');
const movieTitle = document.querySelector('#movieTitle');
const releaseYear = document.querySelector('#releaseYear');
const director = document.querySelector('#director');
const rating = document.querySelector('#rating');
const runtime = document.querySelector('#runtime');
const filmURL = document.querySelector('#filmURL');
const genre = document.querySelector('#genre');

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
		movieTitle.textContent = randomMovie['Film_title'];
		releaseYear.textContent = randomMovie['Release_year'];
		director.textContent = `Directed by ${randomMovie['Director']}`;
		rating.textContent = `Rated ${randomMovie['Average_rating']}/5 Stars`;
		runtime.textContent = `Runtime: ${randomMovie['Runtime']} Minutes`;
		filmURL.textContent = randomMovie['Film_URL'];
		genre.textContent = `Genres: ${randomMovie['Genres'].replace(
			/['"\[\]]/g,
			''
		)}`;

		console.log(randomMovie);
	} catch (error) {
		alert('Error loading movie details. Try Again later.');
	}
}

// What happens when the roll button is clicked
rollButton.addEventListener('click', () => {
	siteTitle.style.cssText = 'font-size: 2.5rem; left: 0;';
	rollButtonDiv.style.cssText = 'top: 0; right: 0';
	rollButton.style.cssText = 'font-size: 1rem';
	rollButton.textContent = 'Again!';

	// Call the main function
	getRandomMovieDetails();
});
