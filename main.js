(function($){
 $.fn.Renderer = function(canvas)
 {
  var canvas = $(canvas).get(0);
  var ctx = canvas.getContext("2d");
  var particleSystem;

  var that = {
   init:function(system){
    //начальная инициализация
    particleSystem = system;
    particleSystem.screenSize(canvas.width, canvas.height); 
    particleSystem.screenPadding(80);
    that.initMouseHandling();
   },
      
   redraw:function(){
    //действия при перересовке
    ctx.fillStyle = "white"; //белым цветом
    ctx.fillRect(0,0, canvas.width, canvas.height); //закрашиваем всю область
   
    particleSystem.eachEdge( //отрисуем каждую грань
     function(edge, pt1, pt2){ //будем работать с гранями и точками её начала и конца
      ctx.strokeStyle = "rgba(0,0,0, .333)"; //грани будут чёрным цветом с некой прозрачностью
      ctx.lineWidth = 1; //толщиной в один пиксель
      ctx.beginPath();  //начинаем рисовать
      ctx.moveTo(pt1.x, pt1.y); //от точки один
      ctx.lineTo(pt2.x, pt2.y); //до точки два
      ctx.stroke();
    });
 
    particleSystem.eachNode( //теперь каждую вершину
     function(node, pt){  //получаем вершину и точку где она
      var w = 5;   //ширина квадрата
      ctx.fillStyle = "black"; //с его цветом понятно
      ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w); //рисуем
      ctx.fillStyle = ""; //цвет для шрифта
      ctx.font = 'italic 13px sans-serif'; //шрифт
      ctx.fillText (node.name, pt.x+8, pt.y+8); //пишем имя у каждой точки
    });       
   },
  
   initMouseHandling:function(){ //события с мышью
    var dragged = null;   //вершина которую перемещают
    var handler = {
     clicked:function(e){ //нажали
      var pos = $(canvas).offset(); //получаем позицию canvas
      _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top); //и позицию нажатия кнопки относительно canvas
      dragged = particleSystem.nearest(_mouseP); //определяем ближайшую вершину к нажатию
      if (dragged && dragged.node !== null){
       dragged.node.fixed = true; //фиксируем её
      }
      $(canvas).bind('mousemove', handler.dragged); //слушаем события перемещения мыши
      $(window).bind('mouseup', handler.dropped);  //и отпускания кнопки
      return false;
     },
     dragged:function(e){ //перетаскиваем вершину
      var pos = $(canvas).offset();
      var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
 
      if (dragged && dragged.node !== null){
       var p = particleSystem.fromScreen(s);
       dragged.node.p = p; //тянем вершину за нажатой мышью
      }
 
      return false;
     },
     dropped:function(e){ //отпустили
      if (dragged===null || dragged.node===undefined) return; //если не перемещали, то уходим
      if (dragged.node !== null) dragged.node.fixed = false; //если перемещали - отпускаем
      dragged = null; //очищаем
      $(canvas).unbind('mousemove', handler.dragged); //перестаём слушать события
      $(window).unbind('mouseup', handler.dropped);
      _mouseP = null;
      return false;
     }
    }
    // слушаем события нажатия мыши
    $(canvas).mousedown(handler.clicked);

   },
      
  }
  return that;
 }    
  
})(this.jQuery)

 function initArbor(){
	sys = arbor.ParticleSystem(1000); // создаём систему
	sys.parameters({gravity:false,friction:0.001,repulsion:10000,dt:0.0032}); // гравитация выкл
	sys.renderer = $(this).Renderer("#canvas"); //начинаем рисовать в выбраной области

	$.getJSON("data.json", //получаем с сервера файл с данными
		function(data){
		$.each(data.nodes, function(i,node){
			sys.addNode(node.name); //добавляем вершину
		});
		
		$.each(data.edges, function(i,edge){
			sys.addEdge(sys.getNode(edge.src),sys.getNode(edge.dest)); //добавляем грань
		});
		}
	);
 }

function rndShift(){	
	shiftNode(rand(1, 10), 1, 10);
}

//### Рекурсивный вызов сдвигов ###

function rand(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//количество сдвигов для узлов
window.shifts = [];
//таймеры для узлов
window.timers = [];

function shiftNode(nodeId, min, max) {
	var nodeName = "node_" + nodeId;

	var node = sys.getNode(nodeName);
	
	// если в узле вдруг NaN, то ставим 0
	if (isNaN(window.shifts[nodeName]))
		window.shifts[nodeName] = 0;

	var randomNumberCase = rand(min, max);
	var PoM = rand(-max, max);
	if(PoM == 0) PoM = 1;
	var newX = node.p.x;
	var newY = node.p.y;
	if (randomNumberCase % 2 == 0)
	{
		// вычисляем новые координаты для узла
		newX += 0.3*(3/PoM);
		newY += 0.3*((-1*3)/PoM);
	}
	else
	{
		// вычисляем новые координаты для узла
		newY += 0.3*(3/PoM);
		newX += + 0.3*((-1*3)/PoM);
	}
	//console.log("node:", nodeId, " set(x:", newX, ", y:", newY, ")")
	node.p.x = newX;
	node.p.Y = newY;
	
	// увеличиваем счетчик сдвигов
	window.shifts[nodeName]++;
	return window.shifts[nodeName];
}

function recursiveShift() {
	
	var min = 1;
	var max = 10;
	
	// если узел подвинули N раз, то останаливаем таймер
	// todo - нужно знать количество узлов
	for(var i=1;i<=10;i++){
		if (window.shifts["node_" + i] >= i * 10){
			clearInterval(window.timers["node_" + i]);
			window.shifts["node_" + i] = 0;
		}
	}

	var nodeId = rand(min, max);
							
	var nodeName = "node_" + nodeId;
	
	if (nodeId != 0)
	{
		window.shifts[nodeName] = 0;
		window.timers[nodeName] = setInterval(function(){shiftNode(nodeId, min, max);}, 10)
	}
	setTimeout(recursiveShift, 3000);
}


  
  


