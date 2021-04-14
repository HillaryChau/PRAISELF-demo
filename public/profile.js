document.addEventListener('DOMContentLoaded', (event) => {
  fetch('favorites', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((res) => {
      return res.json();
    })
    .then((jsonObject) => {
      window.favorites = jsonObject.favorites.filter(favorite => favorite.isFavorite).map(
        (favorites) => favorites.affirmationId,
      );
    })
    .then(() => {
      getAffirmation()
    });


  function getAffirmation() {
    fetch('affirmations', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        return res.json();
      })
      .then((jsonObject) => {
        window.affirmations = jsonObject.affirmations;
        window.affirmations
          .filter((affirmation) => window.favorites.includes(affirmation._id))
          .forEach((affirmation) => {
            const card = document.createElement('div');
            const negFeelingHeader = document.createElement('h3');
            const positiveThoughts = document.createElement('p');
            card.classList.add('affirmationsCard');
            negFeelingHeader.classList.add('negFeelingHeader');
            positiveThoughts.classList.add('positiveThoughts');
            const positiveText = affirmation.positiveAffirmation
              .split('.')
              .map((sentence) => {
                return `<p>${sentence}</p>`;
              })
              .join('');
            negFeelingHeader.innerHTML = affirmation.negativeEmotion;
            positiveThoughts.innerHTML = positiveText;
            card.append(negFeelingHeader);
            card.append(positiveThoughts);
            document.querySelector('.favorites').append(card);
          });
      });
  }
});
