document.addEventListener('DOMContentLoaded', (event) => {
  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1); // (*)
  })
    .then(() => getFavorites())
    .then(() => getAffirmations())
    .then((affirmations) => renderAffirmationCards(affirmations))
    .then(() => getCustomAffirmations())
    .then((affirmations) => renderAffirmationCards(affirmations))
    .then(() => addListeners());
});

function addListeners() {
  document.querySelectorAll('.fa-times').forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteFavorite);
  });
}

function renderAffirmationCards(affirmations) {
  affirmations
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

      renderAffirmationCard(affirmation, favorite);
    });
}

function renderAffirmationCard(affirmation, favorite) {
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

  card.append(trash);
  card.append(negFeelingHeader);
  card.append(positiveThoughts);

  document.querySelector('.favorites').append(card);
}

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


function deleteCustomAffirmation(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id');
  const favoriteId = event.target.getAttribute('data-favorite-id');

  fetch('customAffirmations', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id: affirmationId,
    }),
  }).then((responseObject) => {
    document
      .querySelector(
        `.affirmationsCard[data-affirmation-id="${affirmationId}"]`,
      )
      .classList.add('hide');
  });
}
