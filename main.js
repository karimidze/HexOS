(function($){
 $.fn.Renderer = function(canvas)
 {
  var canvas = $(canvas).get(0);
  var ctx = canvas.getContext("2d");
  var particleSystem;

  var that = {
   init:function(system){
    //��������� �������������
    particleSystem = system;
    particleSystem.screenSize(canvas.width, canvas.height); 
    particleSystem.screenPadding(80);
    that.initMouseHandling();
   },
      
   redraw:function(){
    //�������� ��� �����������
    ctx.fillStyle = "white"; //����� ������
    ctx.fillRect(0,0, canvas.width, canvas.height); //����������� ��� �������
   
    particleSystem.eachEdge( //�������� ������ �����
     function(edge, pt1, pt2){ //����� �������� � ������� � ������� � ������ � �����
      ctx.strokeStyle = "rgba(0,0,0, .333)"; //����� ����� ������ ������ � ����� �������������
      ctx.lineWidth = 1; //�������� � ���� �������
      ctx.beginPath();  //�������� ��������
      ctx.moveTo(pt1.x, pt1.y); //�� ����� ����
      ctx.lineTo(pt2.x, pt2.y); //�� ����� ���
      ctx.stroke();
    });
 
    particleSystem.eachNode( //������ ������ �������
     function(node, pt){  //�������� ������� � ����� ��� ���
      var w = 5;   //������ ��������
      ctx.fillStyle = "black"; //� ��� ������ �������
      ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w); //������
      ctx.fillStyle = ""; //���� ��� ������
      ctx.font = 'italic 13px sans-serif'; //�����
      ctx.fillText (node.name, pt.x+8, pt.y+8); //����� ��� � ������ �����
    });       
   },
  
   initMouseHandling:function(){ //������� � �����
    var dragged = null;   //������� ������� ����������
    var handler = {
     clicked:function(e){ //������
      var pos = $(canvas).offset(); //�������� ������� canvas
      _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top); //� ������� ������� ������ ������������ canvas
      dragged = particleSystem.nearest(_mouseP); //���������� ��������� ������� � �������
      if (dragged && dragged.node !== null){
       dragged.node.fixed = true; //��������� �
      }
      $(canvas).bind('mousemove', handler.dragged); //������� ������� ����������� ����
      $(window).bind('mouseup', handler.dropped);  //� ���������� ������
      return false;
     },
     dragged:function(e){ //������������� �������
      var pos = $(canvas).offset();
      var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);
 
      if (dragged && dragged.node !== null){
       var p = particleSystem.fromScreen(s);
       dragged.node.p = p; //����� ������� �� ������� �����
      }
 
      return false;
     },
     dropped:function(e){ //���������
      if (dragged===null || dragged.node===undefined) return; //���� �� ����������, �� ������
      if (dragged.node !== null) dragged.node.fixed = false; //���� ���������� - ���������
      dragged = null; //�������
      $(canvas).unbind('mousemove', handler.dragged); //�������� ������� �������
      $(window).unbind('mouseup', handler.dropped);
      _mouseP = null;
      return false;
     }
    }
    // ������� ������� ������� ����
    $(canvas).mousedown(handler.clicked);

   },
      
  }
  return that;
 }    
  
})(this.jQuery)

 function initArbor(){
	sys = arbor.ParticleSystem(1000); // ������ �������
	sys.parameters({gravity:false,friction:0.001,repulsion:10000,dt:0.0032}); // ���������� ����
	sys.renderer = $(this).Renderer("#canvas"); //�������� �������� � �������� �������

	$.getJSON("data.json", //�������� � ������� ���� � �������
		function(data){
		$.each(data.nodes, function(i,node){
			sys.addNode(node.name); //��������� �������
		});
		
		$.each(data.edges, function(i,edge){
			sys.addEdge(sys.getNode(edge.src),sys.getNode(edge.dest)); //��������� �����
		});
		}
	);
 }

function rndShift(){	
	shiftNode(rand(1, 10), 1, 10);
}

//### ����������� ����� ������� ###

function rand(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//���������� ������� ��� �����
window.shifts = [];
//������� ��� �����
window.timers = [];

function shiftNode(nodeId, min, max) {
	var nodeName = "node_" + nodeId;

	var node = sys.getNode(nodeName);
	
	// ���� � ���� ����� NaN, �� ������ 0
	if (isNaN(window.shifts[nodeName]))
		window.shifts[nodeName] = 0;

	var randomNumberCase = rand(min, max);
	var PoM = rand(-max, max);
	if(PoM == 0) PoM = 1;
	var newX = node.p.x;
	var newY = node.p.y;
	if (randomNumberCase % 2 == 0)
	{
		// ��������� ����� ���������� ��� ����
		newX += 0.3*(3/PoM);
		newY += 0.3*((-1*3)/PoM);
	}
	else
	{
		// ��������� ����� ���������� ��� ����
		newY += 0.3*(3/PoM);
		newX += + 0.3*((-1*3)/PoM);
	}
	//console.log("node:", nodeId, " set(x:", newX, ", y:", newY, ")")
	node.p.x = newX;
	node.p.Y = newY;
	
	// ����������� ������� �������
	window.shifts[nodeName]++;
	return window.shifts[nodeName];
}

function recursiveShift() {
	
	var min = 1;
	var max = 10;
	
	// ���� ���� ��������� N ���, �� ������������ ������
	// todo - ����� ����� ���������� �����
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


  
  


