/*global $, jQuery, console, window*/

var Main = (function () {
  "use strict";
  var pub = {};

  function prepareGame () {
    sessionStorage.clear();
    $("#ekareTitle").css("visibility" , "hidden");
    $('#HUD').css("visibility", 'visible');

    //display legend
   var legend = $(".legend").text("HUNGER      HEALTH       INTEREST");
   $('.legend').text = legend;

  //Tutorial
  getTutorial(0);
  
  //Get Cards in JSON
  loadCards();
  }

  function loadCards () {
    var myCards = $('#deckArray')[0].innerHTML.trim(),
        i = 0;
    myCards = myCards.replace(/[\n\r]/g, '');
    myCards= JSON.parse(((myCards)));
    $("#startHere").css("visibility" , "hidden");
    $('#'+myCards[i].cardIndex).css("visibility", 'visible');
    showCard(myCards, i);
  }  
  
  $(window).resize(function(){
    if (window.innerHeight > window.innerWidth) {
      //card + buttons
      $(":button").css("font-size", "1vh");
      $("p#cardInPlay").css("font-size", "1vh");
    } else {
      $(":button").css("font-size", "1vw");
      $("p#cardInPlay").css("font-size", "1vw");
    }
  });


  //shows card adds event listeners
  function showCard(myCards, i) {
      //ggTest checks if 5th itemSlot is occupied
    var ggTest = $(".itemSlot5")[0].text.length;
    if(ggTest == 0) {
      //Change card visibility
      $('#'+myCards[i].cardIndex).css("visibility" , "visible");

      //Event listeners
      $('#'+myCards[i].cardIndex+'Accept').click(function(){cardAccept(myCards, myCards[i].cardIndex);});
      $('#'+myCards[i].cardIndex+'Decline').click(function(){cardDecline(myCards, myCards[i].cardIndex)});
      $('#'+myCards[i].cardIndex+'Decline').css("color","#a6a6a6");
    } else {
      gameOver(myCards, i);
    }
  }
  
  //Card accept
  function cardAccept(myCards, i) {
      //Updating Discard pile
      sessionStorage.setItem(myCards[i].cardIndex, myCards[i].cardIndex );

      //Updating Inventory
      addInventory(myCards[i].cardName);
      

      //Hide card and show the next card 
      var nextCardIndex = nextCard(myCards),
          date = new Date(),
          day = date.getDay(),
          status = document.querySelectorAll("."+myCards[i].multiplier);

      $('#'+myCards[i].cardIndex).css('visibility','hidden');
      showCard(myCards, nextCardIndex);

      //Apply multiplier
      status.forEach(
        function(node) {
          switch (myCards[i].sign) {
            case '+':
              if (node.text == "   ") {
                var res = node.text.replace("   ", "///");
                node.innerHTML = res;
              }
              break;
            case '-':
              if (node.text == "///") {
                var res = node.text.replace("///", "   ");
                node.innerHTML = res;
              }
              break;
            case '*':
            // Checks if tomorrow is thursday
              if( day === 3) {
                var res = node.text.replace("   ", "///");
                node.innerHTML = res;
              }
              break;
          }
        }
      )
      //check win condition
      winCondition(myCards, nextCardIndex)
      
  }

  //Card Decline
  function cardDecline(myCards, i){
    sessionStorage.setItem(myCards[i].cardIndex, myCards[i].cardIndex );
    var discardedCards = Object.keys(sessionStorage);
    //Hide card and show the next card
    var nextCardIndex = nextCard(myCards);
    $('#'+myCards[i].cardIndex).css('visibility','hidden');
    if (discardedCards.length < myCards.length) {
      showCard(myCards, nextCardIndex);
    }
  }

  //Draw a random card from the deck
  function nextCard(myCards) {
      //This loop ensures no accepted cards are played twice
      var discardedCards = Object.keys(sessionStorage);
      var randX = Math.floor(Math.random() * myCards.length);
      var filteredArray = discardedCards.filter(element => element == randX);
      do {
        randX = Math.floor(Math.random() * myCards.length);
        filteredArray = discardedCards.filter(element => element == randX);
      }
      while(filteredArray.length > 0 && discardedCards.length < myCards.length);
      //Out of cards
      if(discardedCards.length === myCards.length) {
        $(".voice").css({"animation-name":"blinkRed", "animation-duration":"1s", "animation-iteration-count": "infinite"});
        //breakCat animation
        $("#avatar p").css({"animation-name":"rotateCat", "animation-duration":"1s", "animation-direction":"alternate", "animation-iteration-count": "infinite"});
        $("#avatar2 p").css({"animation-name":"rotateCat", "animation-duration":"0.5s", "animation-iteration-count": "infinite"});
        $(".eyes").css({"color":"#f71a0a"});        
        $(".eyes").text("~");
        $("")   
        $(".voice").text("NIKS4ME?");   
        setTimeout(resetGame, 5000, 1);
      } else {
        var nextCardIndex = randX;{
          return nextCardIndex;
      }
        
    }
  }
  //Inventory
  function addInventory(item) {
    let j=0; 
    for(let i=1;i<6;i++) {
      //Search for an empty item slot
      if ($(".itemSlot"+i)[0].text.length == 0){
        typeInventory(item, i, j);
        break;
      }
    }
  }
  //Typrewriter effect for inventory adds
  function typeInventory(item, i, j) {
    
      if (j < item.length) {
        $(".itemSlot"+i)[0].text += item.charAt(j);
        j++
        setTimeout(typeInventory, 50, item, i, j);
    }
  }
  
  //get Tutorial
  function getTutorial(i) {
    let tutorialArray = $('#tutorialArray')[0].innerHTML.trim();
      tutorialArray = tutorialArray.replace(/[\n\r]/g, '');
      tutorialArray = JSON.parse(tutorialArray);
      howToPlay(tutorialArray, i)
  }
  //Read tutorial lines
  function howToPlay(tutorialArray, i) {
      let j=0;
      for (let i=0;i<=3;i++) {
        setTimeout(typeTutorial, 6500*i, tutorialArray.tutorial[i],i,j);
      }
    }
  //word effect for tutorial
  function typeTutorial (tutorialLine, i, j) {
    let words = tutorialLine.split(" ");
    if (j < words.length) {
      $("#howToPlay p")[i].innerHTML += words[j] + " ";
      j++;
      setTimeout(typeTutorial, 250, tutorialLine, i, j);
    }
  }
  

  //You have won
  function winCondition(myCards, nextCardIndex){
    
    let interest = $('.interest')[0].text,
        health = $('.health')[0].text,
        hunger = $('.hunger')[0].text;

    if(interest == "///" && health == "///" && hunger == "///") {
      $(".voice").text("SATISFIED!");
      $(".voice").css({"animation-name":"blinkGreen", "animation-duration":"1s", "animation-iteration-count": "infinite"});
      //determines final score/eyes 
      for(let i=1;i<6;i++) {
        if($(".itemSlot"+i)[0].text.length == 0) {
          $(".eyes").text(i-1);
          break;
          } else {
            $(".eyes").text(5);
          }
      }
      //search for textures in avatar ascii art WIP
      for (let i=0;i<28;i++) {
        let avatarText = $('#avatar p')[i].innerHTML;
        avatarText = avatarText.replace(/[G]/g, 'P');
      }
      $(".eyes").css({"color":"#08ec08", "font-weight":"900"});
      $('#'+myCards[nextCardIndex].cardIndex).css('visibility','hidden');
      $("#resetTable").css("visibility" , "visible");
      $('#resetTable input')[0].value ="ENJOY";
      $("#resetTable").click(function() {endScene(1)});
    }
  }
  function gameOver (myCards, i) {
      $('#'+myCards[i].cardIndex).css('visibility','hidden');
      $(".voice").text("GAME  OVER");
      $(".eyes").text("X");         
      $(".voice").css({"animation-name":"blinkRed", "animation-duration":"1s", "animation-iteration-count": "infinite"});
      $(".eyes").css({"color":"#f71a0a"});
      $("#resetTable").css("visibility" , "visible");
      $("#resetTable").click(function() {endScene(0)});
  }
  //credits
  function endScene (i) {
    if(i == 1){
      $('#HUD').css("visibility", "hidden");
      $('#resetTable').css("visibility", "hidden");
      $('#howToPlay').css("visibility", "hidden");
      $('#credits').css("visibility", "visible");
      setTimeout(resetGame, 10000);
    } else if(i == 0) {
      resetGame()
    }
  }
  function resetGame () {
    location.reload();
  }
        pub.setup = function () {
          //are we portrait or landscape?
          if (window.innerHeight > window.innerWidth) {
            $(":button").css("font-size", "1vh");
          } else {
            $(":button").css("font-size", "1vw");
          }
          //Begin game
          $("#startHere").click(prepareGame);
        };
        return pub;
        }());

        $(document).ready(Main.setup);
