// getFavorites, getAffirmations, getCustomAffirmations are already loaded
// on html page from <script src="loading.js"></script>

document.addEventListener('DOMContentLoaded', async (event) => {
  await new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1); // (*)
  })
    .then(() => getFavorites()) // get these collections from mongoDB and load them onto page
    .then(() => getAffirmations()) // ^^
    .then(() => getCustomAffirmations()) // ^^
    .then(() => renderOptions()) // dynamically populates the dropdown with options (the positive affirmations)
    .then(() => addListeners()) // is placed after the html elements created by JS, so the event listeners can work
    .then(() => applyQueryParams()); // ?=id
});

function addListeners() {
  if (window.email) {
    //refers to the if the user is logged in, window.email exists  so user can unfavorite/favorite their affirmation cards
    document.querySelector('.favorite-button').addEventListener('click', toggleFavorite);
  }

  document.querySelector('.affirmation-options').addEventListener('change', renderAffirmationCard);
  document.querySelector('.copy-button').addEventListener('click', onCopy);
  document.querySelector('.share-button').addEventListener('click', onOpenModal);
  document.querySelector('.close-modal-button').addEventListener('click', onCloseModal);
  document.querySelector('.modal').addEventListener('click', onCloseModal); //if you click outside modal card (aka the modal share),it will close the modal card.
  document.querySelector('.modal-card').addEventListener('click', (e) => e.stopPropagation()); //intercepting to stop event bubbling so when you click the  modal card, it wont close.
  document.querySelector('.sms-link').addEventListener('click', onClickSmsButton);
  document.querySelector('.send-sms-form').addEventListener('submit', onSendText);
}

function onOpenModal() {
  document.querySelector('.modal').classList.remove('invisible');
}

function onCloseModal() {
  document.querySelector('.modal').classList.add('invisible');
}

function onCopy() {
  // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  const copyText = document.querySelector('.share-link'); // this is from w3 schools example
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
    // if we have a valid phone number we send a post req to the twilio route
    fetch('twilio', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        link: window.link, // this will send the actual url of the page you are on, which shows whenever a affirmation card is rendered
        phoneNumber: phoneNumber, //these (3) things are parsed on the routes.js in the post request of the twilio API
        affirmation: window.currentAffirmation, //affirmation key shows the current affirmation on the screen
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

// this is the ?id of the affirmation >
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

  ////////////GMAIL Message Set up *with the subject and body* /////////////
  const subject = `PRAISELF: Here's a positive affirmation for you!`.replaceAll(' ', '%20');
  const gmailBody = `I saw this affirmation and I thought of you. Hope you like it.\n ${window.link}`;
  const body = gmailBody.replaceAll(' ', '%20');

  document.querySelector('.neg-feeling-header').innerHTML = negativeText;
  document.querySelector('.positive-thoughts').innerHTML = positiveText;
  document.querySelector('.share-link').value = window.link;

  document.querySelector('.sms-form-container').classList.add('invisible');
  document.querySelector('.affirmation-card').classList.remove('hide');

  /////this is where the GMAIL href is dynamically updated onto the html, so that the card displays the gmailLink
  ////the gmailLink be the href to get the affirmation email  + mesage + subject etc (the whole thing)
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
  document.querySelector('.gmail-link').href = gmailLink;

  if (window.email) {
    // window.email = if user is signed in
    const favoriteAffirmation = window.favorites.find((fav) => fav.affirmationId === affirmationId);

    document.querySelector('.fa-heart').classList.remove('hide');
    document.querySelector('.favorite-button').setAttribute('data-affirmation-id', affirmationId);
    ///^^^^^ set data-affirmation-id, to the _id value of the affirmation record in MongoDB affirmation collection

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
  const affirmationId = event.target.getAttribute('data-affirmation-id'); // _id of the affirmation
  const favoriteId = event.target.getAttribute('data-favorite-id'); // _id of the favorite for that affirmation if available
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
