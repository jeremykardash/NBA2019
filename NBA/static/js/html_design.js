window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 15) {
      document.getElementById("header_scroll").style.fontSize = "30px";
      document.getElementById("header_scroll").style.height = "40px";
    } else {
      document.getElementById("header_scroll").style.fontSize = "90px";
      document.getElementById("header_scroll").style.height = "240px";
    }
    console.log("I'm a scrolling!");
  }
