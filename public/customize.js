document.querySelector(".submit").addEventListener('click',postCustomAffirmation)


const postCustomAffirmation = (event) =>{
  const customPostId = event.target.dataset.value;
  fetch("customAffirmation",{
    method: 'post',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      customPostId: customPostId,
    })

  })
}
