(function($){
 var Renderer = function(canvas)
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

 $(document).ready(function(){
  sys = arbor.ParticleSystem(1000); // ������ �������
  sys.parameters({gravity:false,friction:0.001,repulsion:10000,dt:0.0032}); // ���������� ����
  sys.renderer = Renderer("#viewport") //�������� �������� � �������� �������

  $.getJSON("data.json", //�������� � ������� ���� � �������
   function(data){
    $.each(data.nodes, function(i,node){
     sys.addNode(node.name); //��������� �������
    });
    
    $.each(data.edges, function(i,edge){
     sys.addEdge(sys.getNode(edge.src),sys.getNode(edge.dest)); //��������� �����
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
						
						
//### ����������� ����� ������� ###

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

