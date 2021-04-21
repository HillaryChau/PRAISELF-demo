// getFavorites, getAffirmations, getCustomAffirmations are already loaded
// on html page from <script src="loading.js"></script>

document.addEventListener('DOMContentLoaded', async (event) => {
  await new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1); // (*)
  })
    .then(() => getFavorites())
    .then(() => getAffirmations())
    .then(() => getCustomAffirmations())
    .then(() => renderOptions())
    .then(() => addListeners())
    .then(() => applyQueryParams());
});

function addListeners() {
  if (window.email) {
    document.querySelector('.favorite-button').addEventListener('click', toggleFavorite);
  }

  document.querySelector('.affirmation-options').addEventListener('change', renderAffirmationCard);
  document.querySelector('.copy-button').addEventListener('click', onCopy);
  document.querySelector('.share-button').addEventListener('click', onOpenModal);
  document.querySelector('.close-modal-button').addEventListener('click', onCloseModal);
  document.querySelector('.share-modal').addEventListener('click', onCloseModal);
  document.querySelector('.share-modal-card').addEventListener('click', (event) => {
    event.stopPropagation();
  });
  document.querySelector('.sms-link').addEventListener('click', onClickSmsButton);
  document.querySelector('.send-sms-form').addEventListener('submit', onSendText);
}

function onOpenModal() {
  document.querySelector('.share-modal').classList.remove('invisible');
}

function onCloseModal() {
  document.querySelector('.share-modal').classList.add('invisible');
}

function onCopy() {
  const copyText = document.querySelector('.share-link');
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand('copy');

  const tooltip = document.querySelector('.tooltiptext');
  tooltip.innerHTML = 'Copied: ' + copyText.value;
}

///SMS function//

function onClickSmsButton() {
  document.querySelector('.sms-form-container').classList.remove('invisible');
}

function onSendText(event) {
  event.preventDefault();
  const phoneNumber = document.querySelector('.form-phone-number').value;
  const form = document.querySelector('.send-sms-form');
  const isValid = form.checkValidity();
  form.reportValidity();

  if (isValid) {
    fetch('twilio', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        link: window.link,
        phoneNumber: phoneNumber,
        affirmation: window.currentAffirmation,
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
  } else {
    document.querySelector('.invalid-number').classList.remove('hide');
    setTimeout(() => {
      document.querySelector('.invalid-number').classList.add('hide');
    }, 5000);
  }
}

// this is the ?id=< queryparams id of the affirmation >
function applyQueryParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const option = document.querySelector(`option[data-affirmation-id="${id}"]`);

  if (option) {
    option.selected = true;
    renderAffirmationCard({ target: option });
  }
}

function renderOptions() {
  const affirmations = [...window.defaultAffirmations, ...window.customAffirmations];

  for (let index = 0; index < affirmations.length; index++) {
    const affirmation = affirmations[index];
    const option = document.createElement('option');
    const isFavorite = window.favorites.map((fav) => fav.affirmationId).includes(affirmation._id);

    option.setAttribute('value', index);
    option.setAttribute('data-affirmation-id', affirmation._id);

    if (window.email) {
      const heartIcon = isFavorite ? '💛' : '🤍';
      option.innerText = heartIcon + affirmation.negativeEmotion;
    } else {
      option.innerText = affirmation.negativeEmotion;
    }

    document.querySelector('.affirmation-options').appendChild(option);
    document.querySelector('.tooltiptext').innerHTML = 'Copy to clipboard';
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
  const affirmations = [...window.defaultAffirmations, ...window.customAffirmations];
  const affirmation = affirmations[event.target.value];

  const positiveText = affirmation.positiveAffirmation
    .split('.')
    .map((sentence) => `<p>${sentence}</p>`)
    .join('');
  const negativeText = affirmation.negativeEmotion;
  const affirmationId = affirmation._id.toString();

  window.link = `${window.location.origin}?id=${affirmationId}`;
  window.currentAffirmation = affirmation;

  const subject = `PRAISELF: Here's a positive affirmation for you!`.replaceAll(' ', '%20');
  const gmailBody = `I saw this affirmation and I thought of you. Hope you like it.\n ${window.link}`;
  const body = gmailBody.replaceAll(' ', '%20');

  document.querySelector('.neg-feeling-header').innerHTML = negativeText;
  document.querySelector('.positive-thoughts').innerHTML = positiveText;
  document.querySelector('.share-link').value = window.link;

  document.querySelector('.sms-form-container').classList.add('invisible');
  document.querySelector('.affirmation-card').classList.remove('hide');

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
  document.querySelector('.gmail-link').href = gmailLink;

  if (window.email) {
    const favoriteAffirmation = window.favorites.find((fav) => fav.affirmationId === affirmationId);

    document.querySelector('.fa-heart').classList.remove('hide');
    document.querySelector('.favorite-button').setAttribute('data-affirmation-id', affirmationId);

    if (favoriteAffirmation) {
      document
        .querySelector('.favorite-button')
        .setAttribute('data-favorite-id', favoriteAffirmation._id);
      document.querySelector('.fa-heart').classList.remove('far');
      document.querySelector('.fa-heart').classList.add('fa');
    }
  }
}

function toggleFavorite(event) {
  const affirmationId = event.target.getAttribute('data-affirmation-id'); // this is the heart that's selected
  const favoriteId = event.target.getAttribute('data-favorite-id');
  const isFavorite = !!favoriteId;

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
        const option = document.querySelector(`option[data-affirmation-id="${affirmationId}"]`);
        const optionText = option.innerHTML.replace('💛', '🤍');
        option.innerHTML = optionText;
        document
          .querySelector(`.favorite-button[data-affirmation-id="${affirmationId}"]`)
          .removeAttribute('data-favorite-id');
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
    })
      .then(() => getFavorites())
      .then(() => {
        const option = document.querySelector(`option[data-affirmation-id="${affirmationId}"]`);
        const optionText = option.innerHTML.replace('🤍', '💛');
        const favoriteAffirmation = window.favorites.find(
          (fav) => fav.affirmationId === affirmationId,
        );
        document
          .querySelector(`.favorite-button[data-affirmation-id="${affirmationId}"]`)
          .setAttribute('data-favorite-id', favoriteAffirmation._id);
        option.innerHTML = optionText;
        document.querySelector('.fa-heart').classList.remove('far');
        document.querySelector('.fa-heart').classList.add('fa');
      });
  }
}
