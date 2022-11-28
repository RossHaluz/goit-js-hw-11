import Notiflix from 'notiflix';
import './css/styles.css';
import FetchApiService from './js/news-service';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const fetchApiService = new FetchApiService();
let imagesNumber = 0;

form.addEventListener('submit', submitForm);
loadMore.addEventListener('click', onClickLoadMore);

function submitForm(evt) {
  evt.preventDefault();
  fetchApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!fetchApiService.query) {
    clearPage();
    return Notiflix.Notify.failure('Please enter something!');
  }
  loadMore.style.display = 'block';
  fetchApiService.resetPage();
  clearPage();
  // imagesNumber = 0;
  fetchApiService.fetchImages().then(item => {
      const { hits, totalHits } = item.data;
     
      if (!totalHits) {
        loadMore.classList.add('is-hidden');
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
     loadMore.classList.remove = 'is-hidden';
    imagesNumber = totalHits;
    imagesNumber -= hits.length;

      if (imagesNumber === 0) {
        loadMore.style.display = 'none';
      }
      Notiflix.Notify.success(`Success, find ${totalHits} images`);
      renderMarkup(hits);
    })
    .catch(err => console.log(err));
}

function onClickLoadMore() {
  fetchApiService.fetchImages().then(item => {
    const { hits } = item.data;
    renderMarkup(hits);
    imagesNumber -= hits.length;
    if (imagesNumber === 0|| hits.length < 40) {
      loadMore.style.display = 'none';
    }
  });
}

function renderMarkup(arr) {
  const markup = arr
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
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
  `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearPage() {
  gallery.innerHTML = '';
}