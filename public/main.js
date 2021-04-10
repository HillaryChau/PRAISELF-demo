document.querySelector("#negFeeling").addEventListener("change", showPositiveFeeling)
let positiveAffirm = [
  `<p>1. I feel the love of those who are not physically around me.</p>
   <p>2. I take pleasure in my own solitude.</p>
   <p>3. I am too big a gift to this world to feel self-pity.</p>
   <p>4. I love and approve of myself.</p>`,

  `<p>5. I focus on breathing and grounding myself.</p>
    <p>6. Following my intuition and my heart keeps me safe and sound.</p>
    <p>7. I make the right choices every time.</p>
    <p>8. I draw from my inner strength and light.</p>
    <p>9. I trust myself.</p>`,

  `<p>10. I am a unique child of this world.</p>
    <p>11. I have as much brightness to offer the world as the next person.</p>
    <p>12. I matter and what I have to offer this world also matters.</p>
    <p>13. I may be one in 7 billion but I am also one in 7 billion.</p>`
]

function showPositiveFeeling(event){
  let posAffirmSection =   document.querySelector(".positiveThoughts")

  posAffirmSection.innerHTML = positiveAffirm[event.target.value]
  //event.target.value shows the option value from negThoughts that's selected by the user//

}
