document.addEventListener('DOMContentLoaded', (event) => {
  if (!window.email) {
    return;
  }

  new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1);
  }).then(() => addListeners());
});

function addListeners() {
  document.querySelector('.submit-form').addEventListener('submit', createCustomAffirmations);
}

function createCustomAffirmations(event) {
  event.preventDefault();
  const positiveAffirmation = document.querySelector('.custom-affirmation').value;
  const negativeEmotion = document.querySelector('.custom-feeling').value;

  fetch('customAffirmations', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      negativeEmotion,
      positiveAffirmation,
    }),
  }).then(() => {
    document.querySelector('.custom-affirmation').value = '';
    document.querySelector('.custom-feeling').value = '';
    document.querySelector('.success-container').innerText = 'Custom affirmation successfully created';
  });
}
