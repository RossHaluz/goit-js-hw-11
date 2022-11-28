import Notiflix from 'notiflix';
import './css/styles.css';
import FetchApiService from './js/news-service'

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const fetchApiService = new FetchApiService();
let totalHits = 0;


form.addEventListener('submit', submitForm);
loadMore.addEventListener('click', onClickLoadMore);

function submitForm(evt) {
  evt.preventDefault();
  fetchApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!fetchApiService.query) {
    clearPage()
   return Notiflix.Notify.failure('Please enter something!');
  }
  loadMore.removeAttribute('hidden')
  fetchApiService.resetPage();
  clearPage();

  fetchApiService.fetchImages().then(item => {
    totalHits += item.data.totalHits;
    if (!item.data.totalHits) {
      return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
       
    }
    console.log(item)
Notiflix.Notify.success(`Success, find ${item.data.totalHits} images`);
    renderMarkup(item.data.hits)


  }).catch(err => console.log(err))
}

function onClickLoadMore() {
  fetchApiService.fetchImages().then(item => {
    renderMarkup(item.data.hits)
    console.log(item)

    const muthNumber = Math.round(item.data.totalHits / fetchApiService.number) //13
    console.log(muthNumber)


  });
}

function renderMarkup(arr) {
  const markup = arr.map(({ webformatURL, tags, likes, views, comments, downloads }) => `
  <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
  `).join('')

  gallery.insertAdjacentHTML('beforeend', markup)
}

function clearPage() {
  gallery.innerHTML = "";
}