import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
import view from './views/view.js';
import bookmarkView from './views/bookmarkView.js';
export let state = {
  recipe: {},
  search: {
    query: '',
    reasult: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

let createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    title: recipe.title,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export let loadRecipe = async function (id = '') {
  try {
    let data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export let loadSearch = async function (query) {
  let data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
  state.search.reasult = data.data.recipes.map(
    reasult =>
      (reasult = {
        id: reasult.id,
        publisher: reasult.publisher,
        image: reasult.image_url,
        title: reasult.title,
        ...(reasult.key && { key: reasult.key }),
      })
  );
  try {
  } catch (error) {
    console.error(`${error} 💥💥💥`);
    throw error;
  }
};

export let getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  let start = (page - 1) * state.search.resultsPerPage;
  let end = page * state.search.resultsPerPage;

  return state.search.reasult.slice(start, end);
};

export let updateServings = function (newServ) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = ing.quantity * (newServ / state.recipe.servings))
  );

  state.recipe.servings = newServ;
  console.log(state.recipe.servings);
};

let persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export let addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

export let removeBookmark = function (id) {
  let index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

let init = function () {
  let storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
