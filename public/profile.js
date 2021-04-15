
document.addEventListener('DOMContentLoaded', (event) => {
  fetch('favorites', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((res) => {
      return res.json();   //response to turn it into a json object
    })
    .then((jsonObject) => {
      window.favorites = jsonObject.favorites.filter(favorite => favorite.isFavorite).map(
        (favorites) => favorites.affirmationId,
      );
    })
    .then(() => {
      getAffirmation()
    });

//To display favorite affirmations on the profile page//
  function getAffirmation() {
    console.log("hello1")
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
            const trash = document.createElement('i');
                card.setAttribute('data-id',affirmation._id);
                trash.setAttribute('data-id',affirmation._id);
            card.classList.add('affirmationsCard');
              negFeelingHeader.classList.add('negFeelingHeader');
              positiveThoughts.classList.add('positiveThoughts');
              trash.classList.add('fa');
              trash.classList.add('fa-times');
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
            card.append(trash);
            document.querySelector('.favorites').append(card);
            console.log("hello2")
          });
          //we need to create event delagation since event delagation is when we assign a function to an element that isn't there yet
          document.querySelectorAll('.fa-times').forEach(e=>e.addEventListener('click', deleteFavorite))
      });
  }
});
//this is to add the favorites from the home page//
function deleteFavorite(event) {
  const id = event.target.dataset.id; //this is the heart that's selected
  const isFavorite = event.target.classList.contains('fa')//the "x aka trash" that's selected

  fetch('favorites', {
    method: 'delete',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,

    }),
  })
    .then((responseObject) => {
      console.log(id)
      document.querySelector(`.affirmationsCard[data-id="${id}"]`).classList.add('hide')
    });
}
