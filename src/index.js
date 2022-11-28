import Notiflix from 'notiflix';
import './css/styles.css';
import FetchApiService from './js/news-service';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const fetchApiService = new FetchApiService();
let imagesNumber = 0;

form.addEventListener('submit', submitForm);
loadMore.addEventListener('click', onClickLoadMore);

let simpleGallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionPosition: 'bottom',
  captionsData: "alt",
  captionDelay: 250,
});

function submitForm(evt) {
  evt.preventDefault();
  fetchApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
  if (!fetchApiService.query) {
    clearPage();
    return Notiflix.Notify.failure('Please enter something!');
  }

  fetchApiService.resetPage();
  clearPage();
  imagesNumber = 0;
  fetchApiService.fetchImages().then(item => {

      const { hits, totalHits } = item.data;
     
      if (!totalHits) {
        loadMore.style.display = 'none';
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
 
    loadMore.style.display = 'block';
    imagesNumber = totalHits;
    imagesNumber -= hits.length;

      if (imagesNumber === 0) {
        loadMore.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    renderMarkup(hits);
     simpleGallery.refresh();
    })
    .catch(err => console.log(err));
}

function onClickLoadMore() {
  fetchApiService.fetchImages().then(item => {
    const { hits } = item.data;
    renderMarkup(hits);
     simpleGallery.refresh();
    imagesNumber -= hits.length;
    if (imagesNumber === 0 || hits.length < 40) {
      loadMore.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}




function renderMarkup(arr) {
  const markup = arr
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
  
  <div class="photo-card">
<a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/></a>
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

// const lightbox = new SimpleLightbox('.gallery a', {  
//   captions: true,
//   captionPosition: 'bottom',
//   captionsData: "alt",
//   captionDelay: 250,
// });
