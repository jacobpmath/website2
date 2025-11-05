const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorDiv = document.getElementById('error');
const resultsDiv = document.getElementById('results');
const hintDiv = document.getElementById('hint');

// Search for recipes using async/await
async function searchRecipes() {
    const query = searchInput.value.trim();

    if (!query) {
        showError('Please enter a search term');
        return;
    }

    hideError();
    resultsDiv.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();

        if (!data.meals) {
            resultsDiv.innerHTML = '<p>No recipes found. Try another search!</p>';
            return;
        }

        displayRecipes(data.meals);
    } catch (error) {
        showError('Error loading recipes. Please check your internet connection.');
        resultsDiv.innerHTML = '';
    }
}

// Display recipes using map() array method
function displayRecipes(recipes) {
    hintDiv.classList.add('hidden');

    const recipeCards = recipes.map(recipe => {
        return `
            <div class="recipe-card" data-id="${recipe.idMeal}">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
                <p>${recipe.strCategory}</p>
                <div class="click-hint">▼ Click to see details</div>
                <div class="recipe-details" id="details-${recipe.idMeal}">
                    <h4>Ingredients:</h4>
                    <ul>${getIngredients(recipe)}</ul>
                    <h4>Instructions:</h4>
                    <p>${recipe.strInstructions}</p>
                </div>
            </div>
        `;
    }).join('');

    resultsDiv.innerHTML = recipeCards;

    // Add click listeners for toggle behavior
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', toggleDetails);
    });
}

// Get ingredients from recipe object
function getIngredients(recipe) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push(`<li>${measure} ${ingredient}</li>`);
        }
    }

    return ingredients.join('');
}

// Toggle recipe details visibility
function toggleDetails(event) {
    const card = event.currentTarget;
    const recipeId = card.dataset.id;
    const details = document.getElementById(`details-${recipeId}`);
    const clickHint = card.querySelector('.click-hint');

    if (details.classList.contains('show')) {
        details.classList.remove('show');
        clickHint.textContent = '▼ Click to see details';
    } else {
        details.classList.add('show');
        clickHint.textContent = '▲ Click to hide details';
    }
}

// Show error message
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

// Hide error message
function hideError() {
    errorDiv.classList.remove('show');
}

// Event listeners
searchBtn.addEventListener('click', searchRecipes);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchRecipes();
    }
});
