document.addEventListener('DOMContentLoaded', (event) => {
  if (!window.email) {
    return;
  }

  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1);
  })
    .then(() => getFavorites())
    .then(() => getAffirmations())
    .then(() => getCustomAffirmations())
    .then(() => renderAffirmationCards())
    .then(() => addListeners());
});

function addClasses(element, classes) {
  for (let i = 0; i < classes.length; i++) {
    element.classList.add(classes[i]);
  }
}

function addListeners() {
  document.querySelectorAll('.delete-favorite-button').forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteFavorite);
  });
  document.querySelectorAll('.delete-affirmation-button').forEach((deleteButton) => {
    deleteButton.addEventListener('click', deleteCustomAffirmation);
  });
  document.querySelectorAll('.share-button').forEach((smsButton) => {
    smsButton.addEventListener('click', openSmsModal);
  });

  document.querySelector('.send-sms-form').addEventListener('submit', onSendScheduledSms);
  document.querySelector('.close-modal-button').addEventListener('click', onCloseModal);
  document.querySelector('.modal').addEventListener('click', onCloseModal); // if you click outside modal card (aka the modal share),it will close the modal card.
  document.querySelector('.modal-card').addEventListener('click', (e) => e.stopPropagation()); // intercepting to stop event bubbling so when you click the  modal card, it wont close.
}

function openSmsModal(event) {
  const affirmations = [...window.defaultAffirmations, ...window.customAffirmations];
  const affirmationId = event.target.getAttribute('data-affirmation-id');
  document.querySelector('.modal').classList.remove('invisible');
  window.link = `${window.location.origin}?id=${affirmationId}`;
  window.currentAffirmation = affirmations.find((affirmation) => affirmation._id === affirmationId);
}

function onCloseModal() {
  document.querySelector('.modal').classList.add('invisible');
}

function onSendScheduledSms() {
  event.preventDefault();

  const nowTime = new Date(Date.now()).toString().substring(16, 21).split(':'); // resolves to [13, 15] at 1:15 pm
  const inputTime = document.querySelector('.scheduled-sms').value.split(':'); // resolves to [13, 15] at 1:15 pm
  const phoneNumber = document.querySelector('.form-phone-number').value;
  const form = document.querySelector('.send-sms-form');
  const isValid = form.checkValidity();
  form.reportValidity();

  if (!isValid) {
    document.querySelector('.invalid-number').classList.remove('hide');
    setTimeout(() => document.querySelector('.invalid-number').classList.add('hide'), 5000);
    return;
  }

  // time is invalid if the current time is passed the scheduled time
  // you are not allowed to set a scheduled message for a time in the past
  if (Number(nowTime[0]) >= Number(inputTime[0]) && Number(nowTime[1]) > Number(inputTime[1])) {
    document.querySelector('.invalid-time').classList.remove('hide');
    setTimeout(() => document.querySelector('.invalid-time').classList.add('hide'), 5000);
    return;
  }

  // time is invalid if scheduled time is after 9pm
  if (Number(inputTime[0]) >= 21) {
    document.querySelector('.invalid-time').classList.remove('hide');
    setTimeout(() => document.querySelector('.invalid-time').classList.add('hide'), 5000);
    return;
  }

  fetch('scheduled-twilio', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      link: window.link, // this will send the actual url of the page you are on, which shows whenever a affirmation card is rendered
      phoneNumber: phoneNumber, // these things are parsed on the routes.js in the post request of the twilio API
      affirmation: window.currentAffirmation, // affirmation key shows the current affirmation on the screen
      scheduledTime: inputTime,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((resObject) => {
      document.querySelector('.twilio-response').innerHTML = resObject.message;

      setTimeout(() => {
        document.querySelector('.twilio-response').innerHTML = '';
      }, 5000);
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
  const sendScheduledSmsBtn = document.createElement('button');
  const negFeelingHeaderText = document.createElement('h3');
  const positiveThoughtsText = document.createElement('p');
  const unheartIcon = document.createElement('i');
  const trashIcon = document.createElement('i');
  const shareIcon = document.createElement('i');
  const buttons = [deleteFavoriteBtn, deleteAffirmationBtn];

  affirmationCard.setAttribute('data-affirmation-id', affirmation._id);

  buttons.forEach((btn) => {
    btn.setAttribute('data-affirmation-id', affirmation._id);
    btn.setAttribute('data-favorite-id', favorite._id);
    btn.setAttribute('data-affirmation-type', affirmation.author ? 'custom' : 'default');
    btn.setAttribute('data-author', affirmation.author);
  });

  addClasses(buttonsContainer, ['card-buttons-container']);
  addClasses(affirmationCard, ['affirmation-card']);
  addClasses(negFeelingHeaderText, ['neg-feeling-header']);
  addClasses(positiveThoughtsText, ['positive-thoughts']);
  addClasses(deleteFavoriteBtn, ['delete-favorite-button', 'custom-button', 'dark-red']);
  addClasses(deleteAffirmationBtn, ['delete-affirmation-button', 'custom-button', 'dark-grey']);
  addClasses(sendScheduledSmsBtn, ['share-button', 'custom-button', 'dark-green']);
  addClasses(unheartIcon, ['far', 'fa-heart']);
  addClasses(trashIcon, ['fas', 'fa-trash-restore']);
  addClasses(shareIcon, ['fas', 'fa-share-square']);

  deleteFavoriteBtn.append(unheartIcon);
  deleteFavoriteBtn.append('Unfavorite');

  negFeelingHeaderText.innerHTML = affirmation.negativeEmotion;
  positiveThoughtsText.innerHTML = positiveText;

  affirmationCard.append(buttonsContainer);
  if (favorite._id) {
    buttonsContainer.append(deleteFavoriteBtn);
  }

  sendScheduledSmsBtn.append(shareIcon);
  sendScheduledSmsBtn.append('Share');
  sendScheduledSmsBtn.setAttribute('data-affirmation-id', affirmation._id);
  buttonsContainer.append(sendScheduledSmsBtn);

  if (isCustom && isCreatedByLoggedInUser) {
    deleteAffirmationBtn.append(trashIcon);
    deleteAffirmationBtn.append('Delete');
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
  const isCreatedByLoggedInUser = event.target.getAttribute('data-author') === window.email;

  fetch('favorites', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      _id: favoriteId,
    }),
  }).then(() => {
    if (isCreatedByLoggedInUser) {
      document.querySelector(`.delete-favorite-button[data-affirmation-id="${affirmationId}"]`).classList.add('hide');
    } else {
      document.querySelector(`.affirmation-card[data-affirmation-id="${affirmationId}"]`).classList.add('hide');
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
    document.querySelector(`.affirmation-card[data-affirmation-id="${affirmationId}"]`).classList.add('hide');
  });
}
