$("document").ready(function() {

  function touchHandler(event) {
      var touch = event.changedTouches[0];

      var simulatedEvent = document.createEvent("MouseEvent");
          simulatedEvent.initMouseEvent({
          touchstart: "mousedown",
          touchmove: "mousemove",
          touchend: "mouseup"
      }[event.type], true, true, window, 1,
          touch.screenX, touch.screenY,
          touch.clientX, touch.clientY, false,
          false, false, false, 0, null);

      touch.target.dispatchEvent(simulatedEvent);
      event.preventDefault();
  }

  function init() {
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);
  }

  init();

  // Function to update rank card count and icon
  function updateRankCount(rankCard, count, action='UP'){
    action = action.toUpperCase();

    count = Math.abs(count);

    let rankCount = rankCard.querySelector('.rank-count');
    if (action=='UP'){
      rankCount.innerHTML = "<span><i class='fas fa-arrow-up'></i></span><p>"+ count +"</p>"
      rankCount.className='rank-count moveup';
    } else if (action=='DOWN') {
      rankCount.innerHTML = "<span><i class='fas fa-arrow-down'></i></span><p>"+ count +"</p>"
      rankCount.className='rank-count movedown';
    }
    
  }

  $(".rank-card").draggable({
    revert: true
  });

  $(".rank-parent").droppable({
    accept: '.rank-card',
    drop: function(event, ui) {
      let newRankCard = ui.draggable[0];
      let oldParent = newRankCard.parentElement;

      let start = parseInt(oldParent.getAttribute('num'));
      let end = parseInt(this.getAttribute('num'));

      let movement = start - end;

      let counter = start;

      if (movement > 0){
        for (let index = movement; index > 0; index--) {
          counter --;
          // Get the element to move
          let el = document.querySelector(".rank-parent[num='"+ counter +"']");
          
          let rnkCard = el.firstElementChild;
          el.removeChild(rnkCard);

          // Move down
          el.nextElementSibling.appendChild(rnkCard);

          // Update el
          updateRankCount(rnkCard, 1, action='down')
        }

        // Update the movement count for the new rankcard
        updateRankCount(newRankCard, movement)
      } else if (movement < 0) {
        for (let index = movement; index < 0; index++) {
          counter ++;
          // Get the element to move
          let el = document.querySelector(".rank-parent[num='"+ counter +"']");
          
          let rnkCard = el.firstElementChild;
          el.removeChild(rnkCard);

          // Move up
          el.previousElementSibling.appendChild(rnkCard);

          // Update el
          updateRankCount(rnkCard, 1)
        }

        // Update the movement count for the new rankcard
        updateRankCount(newRankCard, movement, action='down')
      }
      $(this).append($(ui.draggable));

      setCrowns()
    }
  });


  if ($('#updateOrder').length){
    $('#updateOrder').click(function(e){
      let board = document.getElementById('board');

      // Get the children
      let children = Array.from(board.children);

      let objArr = [];

      for (let index = 0; index < children.length; index++) {
        
        let parent = children[index];
        console.log(parent);

        // position, count, id, movement
        let position = parent.getAttribute('num');

        let rankCount = parent.querySelector('.rank-count');

        let count = rankCount.textContent;
        let movement = 0;
        if(rankCount.classList.contains('moveup')){
          movement = 1;
        }

        let rankCard = parent.querySelector('.rank-card');
        let id = rankCard.getAttribute('rankID');

        let rankObj = {
          'position': position,
          'count': count,
          'movement': movement,
          'id': id,
        }

        objArr.push(rankObj);
      }

      // Converting obj arr into json
      var jsonString = JSON.stringify(objArr);
      

      // Send with ajax
      $.ajax({
        type: "POST",
        url: "/ranks/updateOrder/",
        data: {'jsonString': jsonString},
        cache: false,
        success: function(data) {
          alert('Ranks order successfully updated');
        },
        error: function(xhr, status, error) {
          console.error(xhr);
        }
      });
    })
  }
});