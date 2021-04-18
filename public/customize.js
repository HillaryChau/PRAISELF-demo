document.querySelector('.submit-form').addEventListener('submit', createCustomAffirmations);

function createCustomAffirmations(event) {
  event.preventDefault();
  const positiveAffirmation = document.querySelector('.new-positive-thoughts > textarea').value;
  const negativeEmotion = document.querySelector('.new-negative-thoughts > input').value;

  fetch('customAffirmations', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      negativeEmotion,
      positiveAffirmation,
    }),
  }).then(() => {
    document.querySelector('.new-positive-thoughts > textarea').value = '';
    document.querySelector('.new-negative-thoughts > input').value = '';
    document.querySelector('.success-container').innerText =
      'Custom affirmation successfully created';
  });
}
