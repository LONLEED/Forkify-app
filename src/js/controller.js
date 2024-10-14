import 'core-js/stable';
import { MODEL_CLOSE_SEC } from './config.js';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import reasultView from './views/reasultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import * as model from './model.js';

let controlRecipes = async function () {
  try {
    let id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

let controlSearchReasult = async function () {
  try {
    reasultView.renderSpinner();

    let query = searchView.getQuery();
    model.state.search.query = query;
    if (!query) return;

    await model.loadSearch(query);
    model.state.search.page = 1;

    reasultView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (error) {
    reasultView.renderError();
  }
};

let controlPagination = function (goToPage) {
  reasultView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

let controlServings = function (updateTo) {
  model.updateServings(updateTo);

  recipeView.update(model.state.recipe);
};

let controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmark);
};

let controlBookmark = function () {
  bookmarkView.render(model.state.bookmark);
};

let controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarkView.render(model.state.bookmark);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
    console.error(error);
  }
};

let init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchReasult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
