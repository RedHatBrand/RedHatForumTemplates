(function (global) {
  var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display="block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};

  var artworkColor         = global.artworkColor;
  var artworkZoom          = global.artworkZoom;
  var screenOnly          = global.screenOnly;

  var BackgroundArtwork = (function() {

    var COLORS = {
      purple: { hex: '#3B0083', rgb: { r: 59, g: 0, b: 131 } },
      red: { hex: '#E05B00', rgb: { r: 224, g: 91, b: 0 } },
      blue: { hex: '#00B9E4', rgb: { r: 0, g: 185, b: 228 } },
      green: { hex: '#92D400', rgb: { r: 146, g: 212, b: 0 } },
      yellow: { hex: '#E59200', rgb: { r: 229, g: 146, b: 0 } }
    };

    var ROW_COUNT = 30,
        COLUMN_COUNT = 4,
        COLUMN_SEGMENTS = 40;

    var MOVEMENT_OFFSET_STRENGTH = 240;
    var MOVEMENT_OFFSET = [0.7, 0.4, 1.2, 0.3];

    var SIMPLIFIED = /firefox\/\d+\.?\d+/gi.test( navigator.userAgent );

    var currentColor = JSON.parse( JSON.stringify( COLORS.red.rgb ) );

    var zoom = { value: 1 };

    var initialized = false;
    var canvas,
        context,
        time = 0,
        firstFrame = true;

    var width = document.body.clientWidth,
        height = document.body.clientHeight;

    console.log("Width:"+width+", Height:"+height)

    var lines = [];

    function init() {

      if( initialized === true ) return false;
      initialized = true;

      canvas = document.querySelector( 'canvas' );
      context = canvas.getContext( '2d' );

      stats = new Stats();

      if( !canvas.classList.contains( 'stats-hidden' ) ) {
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
      }

      setup();
      layout();
      render(Date.now());
      checkRevealBackground();

      window.addEventListener( 'resize', layout, false );

      if( window.Reveal ) {
        window.Reveal.addEventListener( 'slidechanged', checkRevealBackground );
      }

    }

    function setup() {

      for( var i = 0; i < ROW_COUNT; i++ ) {

        var line = {
          index: i,
          offset: Math.random() * 0.03,
          points: [],
          midpoints: [],
          alpha: i / ROW_COUNT
        };

        for( var j = 0; j < COLUMN_COUNT; j++ ) {
            line.points.push({
              index: j,
              nx: 0,
              ny: 0,
              ty: 0,
              x: 0,
              y: height/2
            });
        }

        lines.push( line );

      }

    }

    function render( t ) {

      time = t;

      if( !canvas.classList.contains( 'stats-hidden' ) ) stats.update();

      var currentColorString = 'rgb('+ Math.round(currentColor.r) +','+ Math.round(currentColor.g) +','+ Math.round(currentColor.b) +')';

      context.clearRect( 0, 0, width, height );
      context.save();

      if( zoom.value !== 1 ) {
        context.translate(width/2, height/2);
        context.scale(zoom.value, zoom.value);
        context.translate(-width/2, -height/2);
      }

      var paddingYList = [
        height * ( 0.3 + ( Math.cos(time*0.0003) * 0.3 ) ),
        height * ( 0.49 + ( Math.sin(time*0.0003) * 0.2 ) ),
        height * ( 0.6 + ( Math.sin(time*0.0005) * 0.3 ) ),
        height * ( 0.49 + ( Math.sin(time*0.0003) * 0.2 ) ),
      ];

      var currentHeightList = [
        height - paddingYList[0] * 2,
        height - paddingYList[1] * 2,
        height - paddingYList[2] * 2,
        height - paddingYList[3] * 2
      ];

      var paddingX = -width * 0.1;

      lines.forEach( function( line, i ) {
        line.points.forEach( function( point, j ) {
          point.nx = paddingX + ((width-paddingX*2) / (COLUMN_COUNT-1) * j);
          point.ny = paddingYList[j] + ( currentHeightList[j] / ROW_COUNT * i ) * zoom.value;
        } );

        renderLine( line, true );
      } );

      var gridLines = [
        lines[0],
        lines[Math.round(lines.length*0.1)],
        lines[Math.round(lines.length*0.9)],
        lines[lines.length-1]
      ];

      gridLines[0].midpoints.forEach( function( point, m ) {
        var p1 = gridLines[0].midpoints[m],
            p2 = gridLines[1].midpoints[m-2],
            p3 = gridLines[2].midpoints[m-4],
            p4 = gridLines[3].midpoints[m-5];

        if( p1 && p2 && p3 && p4 ) {
          context.moveTo( p1.x, p1.y );
          context.bezierCurveTo( p2.x, p2.y, p3.x, p3.y, p4.x, p4.y );
        }
      } );

      if( !SIMPLIFIED ) {
        context.shadowBlur = 10;
        context.shadowColor = currentColorString;
      }

      context.lineWidth = 1;
      context.strokeStyle = currentColorString;
      context.stroke();

      context.beginPath();

      renderLine( lines[lines.length-1] );

      context.lineWidth = 6;
      context.strokeStyle = currentColorString;
      context.stroke();
      context.restore();

      firstFrame = false;

      window.requestAnimationFrame( render );

    }

    function renderLine( line, update ) {

      var p1 = line.points[0],
          p2 = line.points[1],
          p3 = line.points[2],
          p4 = line.points[3];

      if( update ) {
        p1.x = p1.nx;
        p1.ty = p1.ny + Math.sin( time * 0.0005 * MOVEMENT_OFFSET[0] + line.offset ) * MOVEMENT_OFFSET_STRENGTH;

        p2.x = p2.nx;
        p2.ty = p2.ny + Math.sin( time * 0.0006 * MOVEMENT_OFFSET[1] + line.offset ) * MOVEMENT_OFFSET_STRENGTH;

        p3.x = p3.nx;
        p3.ty = p3.ny + Math.sin( time * 0.0005 * MOVEMENT_OFFSET[2] + line.offset ) * MOVEMENT_OFFSET_STRENGTH;

        p4.x = p4.nx;
        p4.ty = p4.ny + Math.sin( time * 0.0005 * MOVEMENT_OFFSET[3] + line.offset ) * MOVEMENT_OFFSET_STRENGTH;

        var speed = 0.015 + ( ( line.index / ROW_COUNT ) * 0.15 );

        p1.y += ( p1.ty - p1.y ) * speed;
        p2.y += ( p2.ty - p2.y ) * speed;
        p3.y += ( p3.ty - p3.y ) * speed;
        p4.y += ( p4.ty - p4.y ) * speed;

        if( firstFrame ) {
          p1.y = p1.ty;
          p2.y = p2.ty;
          p3.y = p3.ty;
          p4.y = p4.ty;
        }

        line.midpoints.length = 0;

        for( var x = 0; x < COLUMN_SEGMENTS; x++ ) {
          line.midpoints.push({
            x: getBezierPoint( x/COLUMN_SEGMENTS, p1.x, p2.x, p3.x, p4.x ),
            y: getBezierPoint( x/COLUMN_SEGMENTS, p1.y, p2.y, p3.y, p4.y )
          });
        }
      }

      context.moveTo( p1.x, p1.y );
      context.bezierCurveTo( p2.x, p2.y, p3.x, p3.y, p4.x, p4.y );

    }

    function layout() {

      width = screenOnly ? document.body.clientWidth : document.body.clientWidth * 4.16666667;
      height = screenOnly ? document.body.clientHeight : document.body.clientHeight * 4.16666667;

      if( SIMPLIFIED ) {
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        width = Math.min( width, 800 );
        height = Math.min( height, 600 );
      }

      canvas.width = width;
      canvas.height = height;

    }

    function setColor( color ) {

      currentColor.r = color.r;
      currentColor.g = color.g;
      currentColor.b = color.b;

    }

    function setZoom( factor ) {

      zoom.value = factor;

    }

    function checkRevealBackground() {

      var slide = window.Reveal && window.Reveal.getCurrentSlide();

      if( slide ) {
          container.classList.remove( 'hidden' );

          if( slide.classList.contains( 'mesh-hidden' ) ) {
            container.classList.add( 'hidden' );
          }
          else if( slide.classList.contains( 'mesh-blue' ) ) {
            setColor( colors.blue );
          }
          else if( slide.classList.contains( 'mesh-green' ) ) {
            setColor( colors.green );
          }
          else {
            setColor( colors.red );
          }

          if( slide.classList.contains( 'mesh-zoom' ) ) {
            setZoom( 2 );
          }
          else {
            setZoom( 1 );
          }
      }

    }

    function getBezierPoint( t, a, b, c, d ) {

      var t2 = t * t;
      var t3 = t2 * t;

      return a + (-a * 3 + t * (3 * a - a * t)) * t
              + (3 * b + t * (-6 * b + b * 3 * t)) * t
              + (c * 3 - c * 3 * t) * t2
              + d * t3;

    }

    return {

      init: init,
      setZoom: setZoom,
      setColor: setColor

    }

  })();


  var artworkInitInterval = setInterval(function() {
    if( document.readyState === 'complete' ) {
        clearInterval( artworkInitInterval );

        if( !document.body.querySelector( '.mesh-disabled' ) ) {
          BackgroundArtwork.init();
        }
    }
  }, 50); 
  if (!screenOnly) {
    var captureArtwork = setTimeout(function() {
      var canvas = document.getElementsByTagName("canvas")[0];
      var img    = canvas.toDataURL("image/png");
      var imgObj = new Image();
      imgObj.src = img;
      imgObj.style.backgroundColor = canvas.style.backgroundColor;
      canvas.parentNode.insertBefore(imgObj, document.getElementsByClassName("canvas-overlay")[0]);
      canvas.outerHTML = "";
    }, 100);
  }

  BackgroundArtwork.setColor( artworkColor );
  BackgroundArtwork.setZoom( artworkZoom );

})(window);
