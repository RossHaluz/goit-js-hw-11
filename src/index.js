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
  console.log(fetchApiService.number)
  fetchApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!fetchApiService.query) {
    clearPage()
   return Notiflix.Notify.failure('Please enter something!');
  }

  fetchApiService.resetPage();
  clearPage();

  fetchApiService.fetchImages().then(item => {
    const {hits, totalHits} = item.data
    if (!totalHits) {
       Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      loadMore.classList.add('is-hidden')
      return
    }
    loadMore.classList.remove('is-hidden')
    console.log(item)
Notiflix.Notify.success(`Success, find ${totalHits} images`);
    renderMarkup(hits)


  }).catch(err => console.log(err))
}

function onClickLoadMore() {
  fetchApiService.fetchImages().then(item => {
    const { hits, totalHits } = item.data;
    fetchApiService.incrementPage()
    renderMarkup(hits)
console.log(fetchApiService.number)


    const mathNumber = Math.round(totalHits / 40);

    if (fetchApiService.number === mathNumber) {
      loadMore.classList.add('is-hidden');
    }


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