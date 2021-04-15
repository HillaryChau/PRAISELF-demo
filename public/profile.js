document.addEventListener('DOMContentLoaded', (event) => {
  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1); // (*)
  })
    .then(() => getFavorites())
    .then(() => getAffirmation());
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

// To display favorite affirmations on the profile page//
function getAffirmation() {
  return fetch('affirmations', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((jsonObject) => {
      window.affirmations = jsonObject.affirmations;

      renderAffirmationCards();

      // we need to create event delagation since event delagation is
      // when we assign a function to an element that isn't there yet
      document.querySelectorAll('.fa-times').forEach((deleteButton) => {
        deleteButton.addEventListener('click', deleteFavorite);
      });
    });
}

function renderAffirmationCards() {
  window.affirmations
    .filter((affirmation) => {
      // check if affirmationID matches favorite
      // keep affirmations that have are favorites
      return window.favorites
        .map((favorite) => favorite.affirmationId)
        .includes(affirmation._id);
    })
    .forEach((affirmation) => {
      const favorite = favorites.find(
        (favoriteObject) => favoriteObject.affirmationId === affirmation._id,
      );
      addAffirmationCard(affirmation, favorite);
    });
}

function addAffirmationCard(affirmation, favorite) {
  const positiveText = affirmation.positiveAffirmation
    .split('.')
    .map((sentence) => {
      return `<p>${sentence}</p>`;
    })
    .join('');

  const card = document.createElement('div');
  const negFeelingHeader = document.createElement('h3');
  const positiveThoughts = document.createElement('p');
  const trash = document.createElement('i');

  card.setAttribute('data-affirmation-id', affirmation._id);
  trash.setAttribute('data-affirmation-id', affirmation._id);
  trash.setAttribute('data-favorite-id', favorite._id);

  card.classList.add('affirmationsCard');
  negFeelingHeader.classList.add('negFeelingHeader');
  positiveThoughts.classList.add('positiveThoughts');
  trash.classList.add('fa');
  trash.classList.add('fa-times');

  negFeelingHeader.innerHTML = affirmation.negativeEmotion;
  positiveThoughts.innerHTML = positiveText;

  card.append(negFeelingHeader);
  card.append(positiveThoughts);
  card.append(trash);

  document.querySelector('.favorites').append(card);
}

// this is to add the favorites from the home page //
function deleteFavorite(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id');
  const favoriteId = event.target.getAttribute('data-favorite-id');

  fetch('favorites', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id: favoriteId,
    }),
  }).then((responseObject) => {
    document
      .querySelector(
        `.affirmationsCard[data-affirmation-id="${affirmationId}"]`,
      )
      .classList.add('hide');
  });
}
