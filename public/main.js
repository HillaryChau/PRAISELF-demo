// getFavorites, getAffirmations, getCustomAffirmations are already loaded
// on html page from <script src="loading.js"></script>

document.addEventListener('DOMContentLoaded', async (event) => {
  await new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1); // (*)
  })
    .then(() => getFavorites())
    .then(() => getAffirmations())
    .then((affirmations) => renderAffirmationOptions(affirmations))
    .then(() => getCustomAffirmations())
    .then((affirmations) => renderCustomAffirmationOptions(affirmations))
    .then(() => addListeners());
});

function addListeners() {
  if (window.email) {
    document
      .querySelector('.fa-heart')
      .addEventListener('click', toggleFavorite);
  }

  document
    .querySelector('#negFeeling')
    .addEventListener('change', renderAffirmationCard);
}

function renderAffirmationOptions(affirmations) {
  for (let index = 0; index < affirmations.length; index++) {
    const affirmation = affirmations[index];
    const option = document.createElement('option');
    option.setAttribute('value', index);
    option.setAttribute('data-affirmation', 'default');
    option.innerText = affirmation.negativeEmotion;

    document.querySelector('#negFeeling').appendChild(option);
  }
}

function renderCustomAffirmationOptions(affirmations) {
  for (let index = 0; index < affirmations.length; index++) {
    const affirmation = affirmations[index];
    const option = document.createElement('option');
    option.setAttribute('value', index + 20); // customAffirmations start at 20
    option.setAttribute('data-affirmation', 'custom');
    option.innerText = affirmation.negativeEmotion;

    document.querySelector('#negFeeling').appendChild(option);
  }
}

function renderAffirmationCard(event) {
  // window is a global variable in the browser,  in which we grab the affirmations collection from the DB
  // event.target.value shows the option value from negThoughts that's selected by the user
  // postiviveAffirmation.split('.')  this is being used since the positiveAffirmation is written as a super long string.
  // .map() transforms each sentence, with the <p> added to it.
  const heart = document.querySelector('.fa-heart');

  if (heart) {
    document.querySelector('.fa-heart').classList.remove('fa');
    document.querySelector('.fa-heart').classList.add('far');
  }

  const isDefaultAffirmation = event.target.value < 20;

  const affirmation = isDefaultAffirmation
    ? window.defaultAffirmations[event.target.value]
    : window.customAffirmations[event.target.value - 20];

  const positiveText = affirmation.positiveAffirmation
    .split('.')
    .map((sentence) => {
      return `<p>${sentence}</p>`;
    })
    .join('');
  const negativeText = `<h3>${affirmation.negativeEmotion}.<h3>`;
  const affirmationId = affirmation._id.toString();

  document.querySelector('.negFeelingHeader').innerHTML = negativeText;
  document.querySelector('.positiveThoughts').innerHTML = positiveText;
  document.querySelector('.affirmationsCard').classList.remove('hide');

  if (window.email) {
    const favoriteAffirmation = window.favorites.find(
      (fav) => fav.affirmationId === affirmationId,
    );

    document.querySelector('.fa-heart').classList.remove('hide');
    document
      .querySelector('.fa-heart')
      .setAttribute('data-affirmation-id', affirmationId);

    if (favoriteAffirmation) {
      document
        .querySelector('.fa-heart')
        .setAttribute('data-favorite-id', favoriteAffirmation._id);
      document.querySelector('.fa-heart').classList.remove('far');
      document.querySelector('.fa-heart').classList.add('fa');
    }
  }
}

function toggleFavorite(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id'); // this is the heart that's selected
  const favoriteId = event.target.getAttribute('data-favorite-id');
  const isFavorite = event.target.classList.contains('fa'); // filled in heart that's selected

  if (isFavorite) {
    fetch('favorites', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: favoriteId,
      }),
    })
      .then(() => getFavorites())
      .then(() => {
        document.querySelector('.fa-heart').classList.remove('fa');
        document.querySelector('.fa-heart').classList.add('far');
      });
  } else {
    fetch('favorites', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: affirmationId,
      }),
    }).then(() => {
      document.querySelector('.fa-heart').classList.remove('far');
      document.querySelector('.fa-heart').classList.add('fa');
    });
  }
}
