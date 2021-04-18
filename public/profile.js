document.addEventListener('DOMContentLoaded', (event) => {
  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1);
  })
    .then(() => getFavorites())
    .then(() => getAffirmations())
    .then((affirmations) => renderDefaultAffirmations(affirmations))
    .then(() => getCustomAffirmations())
    .then((customAffirmations) => renderCustomAffirmations(customAffirmations))
    .then(() => addListeners());
});

function addListeners() {
  document.querySelectorAll('.delete-favorite-button').forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteFavorite);
  });

  document.querySelectorAll('.delete-affirmation-button').forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteCustomAffirmation);
  });
}

function renderCustomAffirmations(customAffirmations) {
  customAffirmations
    .filter((customAffirmation) => {
      // filter customAffirmations to only include
      // ones that were created by signed in author

      return customAffirmation.author === window.email;
    })
    .forEach((customAffirmation) => {
      const favorite =
        window.favorites.find(
          (favoriteObject) => favoriteObject.affirmationId === customAffirmation._id,
        ) || {};

      renderAffirmationCard({
        affirmation: customAffirmation,
        favorite,
        isCustomAffirmation: true,
      });
    });
}

function renderDefaultAffirmations(affirmations) {
  affirmations
    .filter((affirmation) => {
      // check if affirmationID matches favorite
      // keep affirmations that have are favorites
      return window.favorites.map((favorite) => favorite.affirmationId).includes(affirmation._id);
    })
    .forEach((affirmation) => {
      const favorite = window.favorites.find(
        (favoriteObject) => favoriteObject.affirmationId === affirmation._id,
      );

      renderAffirmationCard({
        affirmation,
        favorite,
        isCustomAffirmation: false,
      });
    });
}

function renderAffirmationCard({ affirmation, favorite, isCustomAffirmation }) {
  const positiveText = affirmation.positiveAffirmation
    .split('.')
    .map((sentence) => {
      return `<p>${sentence}</p>`;
    })
    .join('');

  const affirmationCard = document.createElement('div');
  const buttonsContainer = document.createElement('div');
  const deleteFavoriteBtn = document.createElement('button');
  const deleteAffirmationBtn = document.createElement('button');
  const negFeelingHeaderText = document.createElement('h3');
  const positiveThoughtsText = document.createElement('p');

  const buttons = [deleteFavoriteBtn, deleteAffirmationBtn];

  affirmationCard.setAttribute('data-affirmation-id', affirmation._id);

  buttons.forEach((btn) => {
    btn.setAttribute('data-affirmation-id', affirmation._id);
    btn.setAttribute('data-favorite-id', favorite._id);
    btn.setAttribute('data-custom-affirmation', isCustomAffirmation ? true : false);
  });

  buttonsContainer.classList.add('buttons-container');
  affirmationCard.classList.add('affirmation-card');
  negFeelingHeaderText.classList.add('neg-feeling-header');
  positiveThoughtsText.classList.add('positive-thoughts');
  deleteFavoriteBtn.classList.add('delete-favorite-button');
  deleteAffirmationBtn.classList.add('delete-affirmation-button');

  deleteFavoriteBtn.innerHTML = 'Delete Favorite';
  negFeelingHeaderText.innerHTML = affirmation.negativeEmotion;
  positiveThoughtsText.innerHTML = positiveText;

  affirmationCard.append(buttonsContainer);

  if (favorite._id) {
    buttonsContainer.append(deleteFavoriteBtn);
  }

  if (isCustomAffirmation) {
    deleteAffirmationBtn.innerHTML = 'Delete Affirmation';
    buttonsContainer.append(deleteAffirmationBtn);
  }

  affirmationCard.append(negFeelingHeaderText);
  affirmationCard.append(positiveThoughtsText);
  affirmationCard.append(buttonsContainer);

  if (isCustomAffirmation) {
    document.querySelector('.custom-affirmations').append(affirmationCard);
  } else {
    document.querySelector('.favorites').append(affirmationCard);
  }
}

function deleteFavorite(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id');
  const favoriteId = event.target.getAttribute('data-favorite-id');
  const isCustomAffirmation = event.target.getAttribute('data-custom-affirmation');

  fetch('favorites', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id: favoriteId,
    }),
  }).then(() => {
    if (isCustomAffirmation === 'true') {
      document
        .querySelector(`.delete-favorite-button[data-affirmation-id="${affirmationId}"]`)
        .classList.add('hide');
    } else {
      document
        .querySelector(`.affirmation-card[data-affirmation-id="${affirmationId}"]`)
        .classList.add('hide');
    }
  });
}

function deleteCustomAffirmation(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id');

  fetch('customAffirmations', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id: affirmationId,
    }),
  }).then(() => {
    document
      .querySelector(`.affirmation-card[data-affirmation-id="${affirmationId}"]`)
      .classList.add('hide');
  });
}
