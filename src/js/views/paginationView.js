import view from './view.js';
import icons from 'url:../../img/icons.svg';

class paginationView extends view {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup(data) {
    let curPage = data.page;
    let numPage = Math.ceil(data.reasult.length / data.resultsPerPage);

    if (curPage === 1 && numPage > 1) {
      return this._nextBtn(curPage);
    }
    if (curPage === numPage && numPage > 1) {
      return this._prevBtn(curPage);
    }
    if (curPage < numPage) {
      console.log([this._prevBtn(curPage), this._nextBtn(curPage)].join(''));
      return [this._prevBtn(curPage), this._nextBtn(curPage)].join('');
    }
    return '';
  }

  _prevBtn(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    `;
  }
  _nextBtn(curPage) {
    return `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      let btn = e.target.closest('.btn--inline');
      if (!btn) return;
      let goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new paginationView();
