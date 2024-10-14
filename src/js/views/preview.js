import view from './view.js';
import icons from 'url:../../img/icons.svg';

class preview extends view {
  _parentEl = '';
  _generateMarkup(data) {
    return `
      <li class="preview">
        <a class="preview__link" href="#${data.id}">
          <figure class="preview__fig">
            <img src="${data.image}" alt="${data.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${data.title}</h4>
            <p class="preview__publisher">${data.publisher}</p>
            <div class="preview__user-generated ${data.key ? '' : 'hidden'}">
              <svg>
               <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

export default new preview();
