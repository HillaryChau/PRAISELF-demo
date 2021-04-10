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
    <p>13. I may be one in 7 billion but I am also one in 7 billion.</p>`,

  `<p>14. I trust my inner wisdom and intuition.</p>
    <p>15. I breathe in calmness and breathe out nervousness.</p>
    <p>16. This situation works out for my highest good.</p>
    <p>17. Wonderful things unfold before me.</p>`,

  `<p>18. I forgive myself for all the mistakes I have made.</p>
    <p>19. I let go of my anger so I can see clearly.</p>
    <p>20. I accept responsibility if my anger has hurt anyone.</p>
    <p>21. I replace my anger with understanding and compassion.</p>
    <p>22. I offer an apology to those affected by my anger.</p>`,

  `<p>23. I may not understand the good in this situation but it is there.</p>
    <p>24. I muster up more hope and courage from deep inside me.</p>
    <p>25. I choose to find hopeful and optimistic ways to look at this.</p>
    <p>26. I kindly ask for help and guidance if I cannot see a better way.</p>
    <p>27. I refuse to give up because I haven’t tried all possible ways.</p>`,

  `<p>28. I know my wisdom guides me to the right decision.</p>
    <p>29. I trust myself to make the best decision for me.</p>
    <p>30. I receive all feedback with kindness but make the final call myself.</p>
    <p>31. I listen lovingly to this inner conflict and reflect on it until I get to peace around it.</p>
    <p>32. I love my family even if they do not understand me completely.</p>
    <p>33. I show my family how much I love them in all the verbal and non-verbal ways I can.</p>
    <p>34. There is a good reason I was paired with this perfect family.</p>
    <p>35. I choose to see my family as a gift.</p>
    <p>36. I am a better person from the hardship that I’ve gone through with my family.</p>`,

  `<p>37. I choose friends who approve of me and love me.</p>
    <p>38. I surround myself with people who treat me well.</p>
    <p>39. I take the time to show my friends that I care about them.</p>
    <p>40. My friends do not judge me, nor do they influence what I do with my life.</p>
    <p>41. I take great pleasure in my friends, even if we disagree or live different lives.</p>`,

  `<p>42. I am beautiful and smart and that’s how everyone sees me.</p>
    <p>43. I take comfort in the fact that I can always leave this situation.</p>
    <p>44. I never know what amazing incredible person I will meet next.</p>
    <p>45. The company of strangers teaches me more about my own likes and dislikes.</p>`,

  `<p>46. I am doing work that I enjoy and find fulfilling.</p>
    <p>47. I play a big role in my own career success.</p>
    <p>48. I ask for and do meaningful, wonderful and rewarding work.</p>
    <p>49. I engage in work that impacts this world positively.</p>
    <p>50. I believe in my ability to change the world with the work that I do.</p>`,

  `<p>51. Peaceful sleep awaits me in dreamland.</p>
    <p>52. I let go of all the false stories I make up in my head.</p>
    <p>53. I release my mind of thought until the morning.</p>
    <p>54. I embrace the peace and quiet of the night.</p>
    <p>55. I sleep soundly and deeply and beautifully into this night.</p>`,

  `<p>56. This day brings me nothing but joy.</p>
    <p>57. Today will be a gorgeous day to remember.</p>
    <p>58. My thoughts are my reality so I think up a bright new day.</p>
    <p>59. I fill my day with hope and face it with joy.</p>
    <p>60. I choose to fully participate in my day.</p>`,

  `<p>61. I let go of worries that drain my energy.</p>
    <p>62. I make smart, calculated plans for my future.</p>
    <p>63. I am a money magnet and attract wealth and abundance.</p>
    <p>64. I am in complete charge of planning for my future.</p>
    <p>65. I trust in my own ability to provide well for my family.</p>`,

  `<p>66. I follow my dreams no matter what.</p>
    <p>67. I show compassion in helping my loved ones understand my dreams.</p>
    <p>68. I ask my loved ones to support my dreams.</p>
    <p>69. I answer questions about my dreams without getting defensive.</p>
    <p>70. My loved ones love me even without fully grappling with my dreams.</p>
    <p>71. I accept everyone as they are and continue on with pursuing my dream.</p>`,

  `<p>72. I am safe and sound. All is well.</p>
    <p>73. Everything works out for my highest good.</p>
    <p>74. There is a great reason this is unfolding before me now.</p>
    <p>75. I have the smarts and the ability to get through this.</p>
    <p>76. All my problems have a solution.</p>`,

  `<p>77. I attempt all – not some – possible ways to get unstuck.</p>
    <p>78. I seek a new way of thinking about this situation.</p>
    <p>79. The answer is right before me, even if I am not seeing it yet.</p>
    <p>80. I believe in my ability to unlock the way and set myself free.</p>`,

  `<p>81. I have no right to compare myself to anyone for I do not know their whole story.</p>
    <p>82. I compare myself only to my highest self.</p>
    <p>83. I choose to see the light that I am to this world.</p>
    <p>84. I am happy in my own skin and in my own circumstances.</p>
    <p>85. I see myself as a gift to my people and community and nation.</p>`,

  `<p>86. I am more than good enough and I get better every day.</p>
    <p>87. I give up the habit to criticize myself.</p>
    <p>88. I adopt the mindset to praise myself.</p>
    <p>89. I see the perfection in all my flaws and all my genius.</p>
    <p>90. I fully approve of who I am, even as I get better.</p>
    <p>91. I am a good person at all times of day and night.</p>`,

  `<p>92. I cannot give up until I have tried every conceivable way.</p>
    <p>93. Giving up is easy and always an option so let’s delay it for another day.</p>
    <p>94. I press on because I believe in my path.</p>
    <p>95. It is always too early to give up on my goals.</p>
    <p>96. I must know what awaits me at the end of this rope so I do not give up.</p>`,

  `<p>97. The past has no power over me anymore</p>
    <p>98. I embrace the rhythm and the flowing of my own heart.</p>
    <p>99. All that I need comes to me at the right time and place in this life.</p>
    <p>100. I am deeply fulfilled with who I am.</p>`]


function showPositiveFeeling(event) {
  let posAffirmSection = document.querySelector(".positiveThoughts")

  posAffirmSection.innerHTML = positiveAffirm[event.target.value]
  //event.target.value shows the option value from negThoughts that's selected by the user//

}
