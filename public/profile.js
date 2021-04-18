document.addEventListener('DOMContentLoaded', (event) => {
  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1);
  })
    .then(() => getFavorites())
    .then(() => getAffirmations())
    .then(() => getCustomAffirmations())
    .then(() => renderAffirmationCards())
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
function renderAffirmationCards() {
  const affirmations = [...window.defaultAffirmations, ...window.customAffirmations];
  affirmations.forEach((affirmation) => {
    const favorite = window.favorites.find((fav) => fav.affirmationId === affirmation._id);
    const isCreatedByLoggedInUser = affirmation.author === window.email;
    // render favorites and customAffirmations created by logged in user
    if (favorite || isCreatedByLoggedInUser) {
      renderAffirmationCard({
        affirmation,
        favorite: favorite || {},
        isCreatedByLoggedInUser,
      });
    }
  });
}
function renderAffirmationCard({ affirmation, favorite, isCreatedByLoggedInUser }) {
  const isCustom = affirmation.author;
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
    btn.setAttribute('data-affirmation-type', affirmation.author ? 'custom' : 'default');
    btn.setAttribute('data-author', affirmation.author);
  });
  buttonsContainer.classList.add('buttons-container');
  affirmationCard.classList.add('affirmation-card');
  negFeelingHeaderText.classList.add('neg-feeling-header');
  positiveThoughtsText.classList.add('positive-thoughts');
  deleteFavoriteBtn.classList.add('delete-favorite-button');
  deleteAffirmationBtn.classList.add('delete-affirmation-button');
  deleteFavoriteBtn.innerHTML = 'Unfavorite';
  negFeelingHeaderText.innerHTML = affirmation.negativeEmotion;
  positiveThoughtsText.innerHTML = positiveText;
  affirmationCard.append(buttonsContainer);
  if (favorite._id) {
    buttonsContainer.append(deleteFavoriteBtn);
  }
  if (isCustom && isCreatedByLoggedInUser) {
    deleteAffirmationBtn.innerHTML = 'Delete Affirmation';
    buttonsContainer.append(deleteAffirmationBtn);
  }
  affirmationCard.append(negFeelingHeaderText);
  affirmationCard.append(positiveThoughtsText);
  affirmationCard.append(buttonsContainer);
  if (isCreatedByLoggedInUser) {
    document.querySelector('.custom-affirmations').append(affirmationCard);
  } else {
    document.querySelector('.favorites').append(affirmationCard);
  }
}
function deleteFavorite(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id');
  const favoriteId = event.target.getAttribute('data-favorite-id');
  const isCustom = event.target.getAttribute('data-affirmation-type') === 'custom';
  const isCreatedByLoggedInUser = event.target.getAttribute('data-author') === window.email;
  fetch('favorites', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id: favoriteId,
    }),
  }).then(() => {
    if (isCreatedByLoggedInUser) {
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
