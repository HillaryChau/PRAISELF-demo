function showPositiveFeeling(event) {
  //window is a global variable in the browser,  in which we grab the affirmations collection from the DB
  // event.target.value shows the option value from negThoughts that's selected by the user
  //.postiviveAffirmation.split('.')  this is being used since the positiveAffirmation is written as a super long string.
  //.map() transforms each sentence, with the <p> added to it.
  const positiveText =  window.affirmations[event.target.value].positiveAffirmation.split('.').map(sentence => {
    return `<p>${sentence}</p>`
  }).join('')
  const negativeText =`<h3>${window.affirmations[event.target.value].negativeEmotion}.<h3>`

  document.querySelector('.negFeelingHeader').innerHTML = negativeText
  document.querySelector('.positiveThoughts').innerHTML = positiveText
}

document.querySelector('#negFeeling').addEventListener('change', showPositiveFeeling);


document.querySelector('.fa-heart').addEventListener("click",addFavorite)

function addFavorite(){
  
}
