import view from './view.js';
import icons from 'url:../../img/icons.svg';
import preview from './preview.js';

class bookmarkView extends view {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  _generateMarkup(data) {
    return data.map(dt => preview.render(dt, false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new bookmarkView();
