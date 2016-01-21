(function($){
 var Renderer = function(canvas)
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

 $(document).ready(function(){
  sys = arbor.ParticleSystem(1000); // создаём систему
  sys.parameters({gravity:false,friction:0.001,repulsion:10000,dt:0.0032}); // гравитация выкл
  sys.renderer = Renderer("#viewport") //начинаем рисовать в выбраной области

  $.getJSON("data.json", //получаем с сервера файл с данными
   function(data){
    $.each(data.nodes, function(i,node){
     sys.addNode(node.name); //добавляем вершину
    });
    
    $.each(data.edges, function(i,edge){
     sys.addEdge(sys.getNode(edge.src),sys.getNode(edge.dest)); //добавляем грань
    });
  });
  

$("#go").click(function() 
	{
		//var kek = 1;
		//console.table(window.timerId);
		//for (kek=1; kek <= 10; kek++)
		//{
			//clearInterval(window.timerId["node_"+kek]);
			//console.log("timerId="+window.timerId["node_"+kek]);
			//console.log("shift="+window.shift["node_"+kek]);
		//}
		var minNumber = 1;
								var maxNumber = 10;
								var randomNumberNode = 0;
								var randomNumberCase = 0;
								var randomNumberPoM = 0;
								randomNumberFromRange(minNumber, maxNumber);
								
								function randomNumberFromRange(min,max)
								{
									randomNumberNode = Math.floor(Math.random()*(max-min+1)+min);
									
									randomNumberCase = Math.floor(Math.random()*(max-min+1)+min);
									
									randomNumberPoM = Math.floor(Math.random()*(max-(min-11)+1)+(min-11));
								}
		var node = sys.getNode("node_"+randomNumberNode);
		console.log(node);
		sys.tweenNode(node, 1, {color:"red", tvoya:"mamka"});
		
	}
);
						
						
//### Рекурсивный вызов сдвигов ###

var timerId = setTimeout(function func() {
								window.shift=[];
								window.timerId = [];
								
								var minNumber = 1;
								var maxNumber = 10;
								var randomNumberNode = 0;
								var randomNumberCase = 0;
								var randomNumberPoM = 0;
								randomNumberFromRange(minNumber, maxNumber);
								
								function randomNumberFromRange(min,max)
								{
									randomNumberNode = Math.floor(Math.random()*(max-min+1)+min);
									
									randomNumberCase = Math.floor(Math.random()*(max-min+1)+min);
									
									randomNumberPoM = Math.floor(Math.random()*(max-(min-11)+1)+(min-11));
								}
								
								var node = sys.getNode("node_"+randomNumberNode);
								
								function draw123()
								{
								 if (window.shift["node_"+randomNumberNode] >= randomNumberNode*10){clearInterval(window.timerId["node_"+randomNumberNode]);}
								 
								 if (randomNumberCase % 2 == 0)
									{
										 node.p.x = node.p.x + 0.3*(3/randomNumberPoM);
										 node.p.y = node.p.y + 0.3*((-1*3)/randomNumberPoM);
										 window.shift["node_"+randomNumberNode]++;
										//console.log(window.shift["node_"+randomNumberNode]);
									}
								 else
									 {
										node.p.y = node.p.y + 0.3*(3/randomNumberPoM);
										node.p.x = node.p.x + 0.3*((-1*3)/randomNumberPoM);
										window.shift["node_"+randomNumberNode]++;
										//console.log(window.shift["node_"+randomNumberNode]);
									}
								
								}
								
									//console.clear();
									console.log("randomNumberPom="+randomNumberPoM);
									console.log("randomNumberNode="+randomNumberNode);
									console.log("randomNumberCase="+randomNumberCase);
									if (randomNumberNode != 0, randomNumberCase != 0, randomNumberPoM !=0)
									{
										
										window.shift["node_"+randomNumberNode] = 0;
										window.timerId["node_"+randomNumberNode] = setInterval(function(){draw123();}, 1)
                                        
										//console.log(window.timerId);
									}
								timerId = setTimeout(func, 122000);
},122000);


  
  
  
 })

 
})(this.jQuery)

