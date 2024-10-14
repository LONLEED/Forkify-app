import icons from 'url:../../img/icons.svg'; //

export default class view {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    let markup = this._generateMarkup(this._data);
    if (!render) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  update(data) {
    this._data = data;
    let newMarkup = this._generateMarkup(this._data);
    let newDom = document.createRange().createContextualFragment(newMarkup);
    let newElements = Array.from(newDom.querySelectorAll('*'));
    let curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      let curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    let markup = `
     <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
     </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  renderError(errorMessage = this._errorMessage) {
    let markup = `
     <div class="error">
       <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
       <p>${errorMessage}</p>
     </div> 
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  renderMessage(Message = this._Message) {
    let markup = `
     <div class="error">
       <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
       <p>${Message}</p>
     </div> 
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }
}
