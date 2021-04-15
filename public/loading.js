function getFavorites() {
  if (!window.email) {
    window.favorites = [];
    return Promise.resolve()
  }
  return fetch('favorites', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json(); // response to turn it into a json object
    })
    .then((jsonObject) => {
      window.favorites = jsonObject.favorites;
    });
}
// To display favorite affirmations on the profile page//
function getAffirmations() {
  return fetch('affirmations', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((jsonObject) => {
      window.defaultAffirmations = jsonObject.affirmations;
      return jsonObject.affirmations;
    });
}
function getCustomAffirmations() {
  return fetch('customAffirmations', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((jsonObject) => {
      window.customAffirmations = jsonObject.customAffirmations;
      return jsonObject.customAffirmations;
    });
}git
