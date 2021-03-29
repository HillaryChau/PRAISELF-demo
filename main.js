var feeling = document.getElementsByClassName('option');

Array.from(feeling).forEach(function (element) {
  element.addEventListener('click', function () {
    const _id = event.target.dataset.value;
    const feelingOptionValue = document.querySelector(`.feeling[data-value="${_id}"]`)
      .innerText;
    fetch('affirmation', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: _id,
        feelingOption: feelingOptionValue,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
