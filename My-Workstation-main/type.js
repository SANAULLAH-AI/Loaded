function googleSearch()
{
    var text=document.getElementById("search").value;
    var cl = text.replace(" ","+",text);
    var url='http://www.google.com/search?q='+cl;
    if (text == ""){
    window.alert("Type or speak what you wanna search")
    }
    else{window.location.href=url;}
    
}


const container = document.querySelector('.container');

window.addEventListener('scroll', () => {
  if (window.scrollY > 0) { 
    container.classList.add('scrolled');
  } else {
    container.classList.remove('scrolled');
  }
});

function voiceSearch() {
    const recognition = new webkitSpeechRecognition(); // or window.SpeechRecognition()
    recognition.lang = 'en-US';
    recognition.maxResults = 10;
  
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log('You said: ', spokenText);
      window.open('http://www.google.com/search?q=' + spokenText, '_blank');
    };
  
    recognition.onerror = (event) => {
      console.log('Error: ', event.error);
    };
  
    recognition.start();
  }
  
  document.querySelectorAll('#type').forEach(function(app) {
    app.addEventListener('mouseenter', function() {
      document.removeEventListener('mousemove', spark);
    });
    app.addEventListener('mouseleave', function() {
      document.addEventListener('mousemove', spark);
    });
  });
  
  document.querySelectorAll('.apps').forEach(function(app) {
    app.addEventListener('mouseenter', function() {
      document.removeEventListener('mousemove', spark);
    });
    app.addEventListener('mouseleave', function() {
      document.addEventListener('mousemove', spark);
    });
  });
  
  document.querySelectorAll('.applications').forEach(function(app) {
    app.addEventListener('mouseenter', function() {
      document.removeEventListener('mousemove', spark);
    });
    app.addEventListener('mouseleave', function() {
      document.addEventListener('mousemove', spark);
    });
  });


document.querySelector('.btn-88').addEventListener('mouseenter', function() {
  document.querySelector('.Gbox').style.display = 'block';
  document.removeEventListener('mousemove', spark);
});

document.querySelector('.Gbox').addEventListener('mouseleave', function() {
  document.querySelector('.Gbox').style.display = 'none';
  document.querySelector('.Gbox').style.pointerEvents = 'auto';
  document.addEventListener('mousemove', spark);
});




function spark(event) {
  if (event.target.classList.contains('ignore-sparkles') || event.target.classList.contains('btn-88') || event.target.classList.contains('Gbox')) {
    return;
  }
  let iy = document.createElement('div');
  iy.style.position = 'absolute';
  iy.style.width = '4px';
  iy.style.height = '4px';
  iy.style.background = '#0ef';
  iy.style.animation = 'anima 2s';
  iy.style.left = event.pageX + 'px';
  iy.style.top = event.pageY + 'px';
  iy.style.transform = `scale(${Math.random() * 20 + 1})`;
  iy.style.setProperty('--x', getRandomTransitioValue());
  iy.style.setProperty('--y', getRandomTransitioValue());
  document.body.appendChild(iy);
  setTimeout(() => {
    document.body.removeChild(iy);
  }, 2000);
}

function getRandomTransitioValue() {
  return `${Math.random() * 400 - 200}px`;
}

document.addEventListener('mousemove', spark);


function addAnimation() {
  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    @keyframes anima {
      0% {
        opacity: 1;
        transform: translate(0, 0);
      }
      100% {
        opacity: 0;
        transform: translate(var(--x), var(--y));
      }
    }
  `;
  document.head.appendChild(style);
}

addAnimation();

document.body.style.overflowX = 'hidden';


document.querySelector('.btn-88').style.zIndex = '1';





var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 8) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};
TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];
  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }
  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  var that = this;
  var delta = 200 - Math.random() * 100;
  if (this.isDeleting) { delta /= 2; }
  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};
window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { color:#fff;font-family:'sans sarif';}";
  document.body.appendChild(css);
};