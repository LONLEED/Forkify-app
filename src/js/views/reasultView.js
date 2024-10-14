import view from './view.js';
import icons from 'url:../../img/icons.svg';
import preview from './preview.js';

class reasultView extends view {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup(data) {
    return data.map(dt => preview.render(dt, false)).join('');
  }
}

export default new reasultView();
