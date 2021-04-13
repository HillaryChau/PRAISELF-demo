const positiveAffirmations = window.affirmations.map((e) => e.positiveAffirmation);

function showPositiveFeeling(event) {
  // event.target.value shows the option value from negThoughts that's selected by the user
  const text = positiveAffirmations[event.target.value].split('.').map(e => {
    return `<p>${e}</p>`
  }).join('')
  document.querySelector('.positiveThoughts').innerHTML = text;
}

function openModalWithAffirmations(event) {
  document.querySelector('.modal').classList.add('active');
  document.querySelector('.modal-text-container').innerHTML = positiveAffirmations[event.target.dataset.value];
}

function closeModal(event) {
  document.querySelector('.modal').classList.remove('active');
}

document.querySelector('#negFeeling').addEventListener('change', showPositiveFeeling);

document.querySelectorAll('.i').forEach((element) => {
  element.addEventListener('click', openModalWithAffirmations);
});

document.querySelector('.close').addEventListener('click', closeModal);
