document
  .querySelector('.submitForm')
  .addEventListener('submit', createCustomAffirmations);

function createCustomAffirmations(event) {
  event.preventDefault();
  const positiveAffirmation = document.querySelector(
    '.newPositiveThoughts > textarea',
  ).value;
  const negativeEmotion = document.querySelector('.newNegativeThoughts > input')
    .value;

  fetch('customAffirmations', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      negativeEmotion,
      positiveAffirmation,
    }),
  }).then(() => {
    document.querySelector('.newPositiveThoughts > textarea').value = '';
    document.querySelector('.newNegativeThoughts > input').value = '';
    document.querySelector('.success-container').innerText =
      'Custom affirmation successfully created';
  });
}
