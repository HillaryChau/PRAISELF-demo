document.addEventListener('DOMContentLoaded', (event) => {
  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1); // (*)
  })
    .then(() => getFavorites())
});

function getFavorites() {
  return fetch('favorites', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json(); // response to turn it into a json object
    })
    .then((jsonObject) => {
      window.favorites = jsonObject.favorites;
    });
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

  const affirmation = window.affirmations[event.target.value];
  const positiveText = affirmation.positiveAffirmation
    .split('.')
    .map((sentence) => {
      return `<p>${sentence}</p>`;
    })
    .join('');
  const negativeText = `<h3>${affirmation.negativeEmotion}.<h3>`;
  const id = affirmation._id.toString();

  document.querySelector('.negFeelingHeader').innerHTML = negativeText;
  document.querySelector('.positiveThoughts').innerHTML = positiveText;
  document.querySelector('.affirmationsCard').classList.remove('hide');

  if (window.email) {
    document.querySelector('.fa-heart').classList.remove('hide');
    document.querySelector('.fa-heart').setAttribute('data-id', id);

    if (window.favorites.includes(id)) {
      document.querySelector('.fa-heart').classList.remove('far');
      document.querySelector('.fa-heart').classList.add('fa');
    }
  }
}

///Adds Affiration from Home to display onto the profile page//
function toggleFavorite(event) {
  const id = event.target.dataset.id; //this is the heart that's selected
  const isFavorite = event.target.classList.contains('fa'); //filled in heart that's selected

  fetch('favorites', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      email: window.email,
      isFavorite: isFavorite,
    }),
  })
    .then(() => {
      return getFavorites();
    })
    .then((jsonObject) => {
      if (document.querySelector('.fa-heart').classList.contains('fa')) {
        document.querySelector('.fa-heart').classList.remove('fa');
        document.querySelector('.fa-heart').classList.add('far');
      } else {
        document.querySelector('.fa-heart').classList.remove('far');
        document.querySelector('.fa-heart').classList.add('fa');
      }
    });
}

if (window.email) {
  document.querySelector('.fa-heart').addEventListener('click', toggleFavorite);

  document.addEventListener('DOMContentLoaded', (event) => {
    fetch('favorites', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonObject) => {
        window.favorites = jsonObject.favorites.map(
          (favorites) => favorites.affirmationId,
        );
      });
  });
}

document
  .querySelector('#negFeeling')
  .addEventListener('change', renderAffirmationCard);
