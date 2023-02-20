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
      console.log("portrait");
    } else {
      $(":button").css("font-size", "1vw");
      $("p#cardInPlay").css("font-size", "1vw");
      console.log("landscape");
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
            //Thursday bonus
              if( day === 4) {
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
    //Hide card and show the next card
    var nextCardIndex = nextCard(myCards);
    $('#'+myCards[i].cardIndex).css('visibility','hidden');
    showCard(myCards, nextCardIndex);
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
        resetGame();
      }
        var nextCardIndex = randX;{
        return nextCardIndex;
    }
  }
  function typeWriter(item, i, j) {
    
      if (j < item.length) {
        $(".itemSlot"+i)[0].text += item.charAt(j);
        j++
        setTimeout(typeWriter, 50, item, i, j);
    }
  }
  //Inventory
  function addInventory(item) {
    let j=0; 
    for(let i=1;i<6;i++) {
      //Search for an empty item slot
      if ($(".itemSlot"+i)[0].text.length == 0){
        typeWriter(item, i, j);
        break;
      }
    }
  }
  
  
  


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
      
      $(".eyes").css({"color":"#08ec08", "font-weight":"900"});
      $('#'+myCards[nextCardIndex].cardIndex).css('visibility','hidden');
      $("#resetTable").css("visibility" , "visible");
      $("#resetTable").click(resetGame);
      
    }
    
  }
  function gameOver (myCards, i) {
      $('#'+myCards[i].cardIndex).css('visibility','hidden');
      $(".voice").text("GAME  OVER");
      $(".eyes").text("X");
      $(".voice").css({"animation-name":"blinkRed", "animation-duration":"1s", "animation-iteration-count": "infinite"});
      $(".eyes").css({"color":"#f71a0a"});
      $("#resetTable").css("visibility" , "visible");
      $("#resetTable").click(resetGame);
  }
  function resetGame () {
    location.reload()
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
