window.addEventListener("load", function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const currentLineWidth = document.getElementById("lineWidth");
    let isMouseDown = false,
        lineWidth = 1,
        coords = [],
        angle = 0;
  
    
    canvas.addEventListener('mousedown', beginDraw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mousemove', drawLMB);
    canvas.addEventListener('mousemove', erase);
    
    document.getElementById("clear").addEventListener('click', clear);
    document.getElementById('rotateRight').addEventListener('click', rotateRight);
    document.getElementById('rotateLeft').addEventListener('click', rotateLeft);
    document.getElementById('save').addEventListener('click', saveTolocalStorage);
    document.getElementById('replay').addEventListener('click', replay);

    currentLineWidth.addEventListener('click', changeLineWidth);
    document.addEventListener('contextmenu', preventContextmenu);
    createPalette(document.getElementById("palette"));
  


    function erase(e) {   
      if(isMouseDown & e.which === 3 ) {
          ctx.globalCompositeOperation = 'destination-out';
          draw(e);
      }
    }
  
    function preventContextmenu(e){
      const elem = e.target.className;
      if (elem == 'canvas') {
        e.preventDefault();
      }
    }
  
    function drawLMB(e) {
      if(isMouseDown & e.button === 0) {
        coords.push([e.offsetX, e.offsetY]);
        draw(e);
        ctx.lineWidth = lineWidth * 2;
      }  
    }
  
    function beginDraw(){
      isMouseDown = true;
      ctx.beginPath();
    }
  
    function stopDraw(e){
      isMouseDown = false;
      ctx.globalCompositeOperation = "source-over";
      coords.push('endPath');
    }
  
    function draw(e) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(e.offsetX, e.offsetY, lineWidth, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    }
  
    function rotateRight() {  
      angle += 90;
      canvas.style.transform = `rotate(${angle}deg)`;
    }
  
    function rotateLeft() {
      angle -= 90;
      canvas.style.transform = `rotate(${angle}deg)`;
    }
  
    function saveTolocalStorage () {
      localStorage.setItem('coords', JSON.stringify(coords));
      ctx.beginPath();
    }
  
    function replay () {
  
      coords = JSON.parse(localStorage.getItem('coords'));
      clear();
      const timer = setInterval(function () {
        if (!coords.length) {
          clearInterval(timer);
          ctx.beginPath();
          return;
        }
      const crd = coords.shift();
      let e = {
        offsetX: crd["0"],
        offsetY: crd["1"]
      };  
      
      draw(e);
      }, 10);
      
    }
  
    function changeColor(e) {
      ctx.strokeStyle = e.target.style.backgroundColor;
      ctx.fillStyle = e.target.style.backgroundColor;
    }
  
    function createPalette() {
  
      for (let r = 0, max = 3; r <= max; r++) {
        for (let g = 0; g <= max; g++) {
          for (let b = 0; b <= max; b++) {
            const paletteBlock = document.createElement('div');
            paletteBlock.className = 'button';
            paletteBlock.addEventListener('click', changeColor);
  
            paletteBlock.style.backgroundColor = (
              'rgb(' + Math.round(r * 255 / max) + ", "
              + Math.round(g * 255 / max) + ", "
              + Math.round(b * 255 / max) + ")"
            );
  
            document.getElementById('palette').appendChild(paletteBlock);
          }
        }
      }
    }
  
    function clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    function changeLineWidth() {
      lineWidth = currentLineWidth.value;
    }
    
    });