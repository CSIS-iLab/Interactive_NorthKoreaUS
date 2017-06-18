var theData = d3.csv("USKoreaData.csv",makeStuff);
const calendar = d3.select("#calendar");

var makeAnnotations;

function makeStuff(theData){

	var NegoMax = 0;
	var ProvMax = 0;
	
	for(var i=0;i<theData.length;i++){
		if(theData[i].Nego>NegoMax){
			NegoMax=theData[i].Nego;
		}
		if(theData[i].Prov>ProvMax){
			ProvMax=theData[i].Prov;
		}
	}
	
	var provColor = d3.scaleQuantize()
	.domain([0,ProvMax])
	.range(["#fee5d9","#fcae91","#fb6a4a","#cb181d"]);

	var negoColor = d3.scaleQuantize()
	.domain([0,NegoMax])
	.range(["#eff3ff", "#bdd7e7", "#6baed6","#2171b5"]);

	calendar.selectAll('g')
	.data(theData)
	.enter()
	.append("g")
	.attr("class","row");

	d3.selectAll(".row")
	.append("rect")
	.attr("class","box nego")
	.attr("x",function(d,i){return ((30*i)%360)+35})
	.attr("y",function(d,i){return (15*Math.floor(i/12))+26})
	.attr('width','15')
	.attr('height','15')
	.attr('data',function(d){return d.Date;})
	.attr("fill",function(d){if(d.Nego==0){return "white"} else return negoColor(d.Nego)})
	.text(function(d){return d.Nego;})

	d3.selectAll(".row")
	.append("rect")
	.attr("class","box prov")
	.attr('width','15')
	.attr('height','15')
	.attr('data',function(d){return d.Date;})
	.attr("x",function(d,i){return (15+(30*i)%360)+35})
	.attr("y",function(d,i){return (15*Math.floor(i/12))+26})
	.attr("fill",function(d){if(d.Prov==0){return "white"} else return provColor(d.Prov)})
	.text(function(d){return d.Prov;})

	var xScale =  d3.scaleBand()
	.domain(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])
	.range([0, 360]);
	var xAxis = d3.axisTop(xScale)
	.tickSizeOuter(0);

	calendar.append("g")
	.attr('height','25px')
	.attr("transform", "translate(35,25)")
	.attr('id','xAxis')
	.call(xAxis)
	.selectAll("text")
	.attr("transform", "rotate(-45 0,0) translate(0,0) ")
	.style("text-anchor", "start");

	var yScale =  d3.scaleTime()
	.domain([new Date(1989, 5, 1), new Date(2017, 5, 1)])
	.range([0, 420]);
	var yAxis = d3.axisLeft(yScale)
	.ticks(27)
	.tickSizeOuter(0);

	calendar.append("g")
	.call(yAxis)
	.attr("transform","translate(35,25)");
	calLeftPosition();
	windowResize();

	var waypointAction1 = new Waypoint({
		element: document.getElementById('calendar'),
		handler: function(direction) {
			if(direction==="down"){
				action1on();
			}
			else{
				calendar.style("position","absolute")
						.style("top",document.getElementById('calendar').getBoundingClientRect.top)
				calLeftPosition();
				action1off();
			}
		}
	});

	var waypointAction2 = new Waypoint({
		element: document.getElementById('para5'),
		handler: function(direction) {
			if(direction==="down"){
				action1off();
				action2on();
			}
			else{
				action1on();
				action2off();
			}
		},
		offset: document.getElementById('calendar').clientHeight-document.getElementById('para5').clientHeight
	});

	var waypointAction3 = new Waypoint({
		element: document.getElementById('para6'),
		handler: function(direction) {
			if(direction==="down"){
				action2off();
				action3on();
			}
			else{
				action3off();
				action2on();
			}
		},
		offset: document.getElementById('calendar').clientHeight-document.getElementById('para6').clientHeight
	});

	var waypointAction4 = new Waypoint({
	    element: document.getElementById('section2'),
	    handler: function(direction) {
	    	var t = d3.transition()
    		.duration(1000)
    		.ease(d3.easeQuadInOut);

	    	if(direction==="down"){
	    		d3.select("#calendar")
	    		.transition(t)
    			.attr("viewBox","0 0 395 100");
    			action3off();
	    	}
	    	else{
	    		d3.select("#calendar")
	    		.transition(t)
    			.attr("viewBox","0 0 395 445");
    			action3on();
	    	}
	    },
	    offset: document.getElementById('calendar').clientHeight-document.getElementById('section2').clientHeight
	});

	makeWaypoint5();
	makeWaypoint6();
	
/*
	var WaypointImage1 = new Waypoint({
		element: document.getElementById('hwbush'),
		handler: function(direction){
			if(direction=='down'){
				//console.log("sup");
				d3.select('#hwbush')
				.style("width",document.getElementById('hwbush').getBoundingClientRect().width)
				.style("height",document.getElementById('hwbush').getBoundingClientRect().height)
				.style("position",null)
				.style("left",document.getElementById('hwbush').getBoundingClientRect().left)
				.style("top","20px")
				.style("position","fixed");
				
				d3.select('#ilsung')
				.style("width",document.getElementById('ilsung').getBoundingClientRect().width)
				.style("height",document.getElementById('ilsung').getBoundingClientRect().height)
				.style("position",null)
				.style("left",document.getElementById('ilsung').getBoundingClientRect().left)
				.style("top","20px")
				.style("position","fixed");

				d3.select("#action1")
    			.style("position","fixed")
    			.style("top","0px")
    			.style("left",window.innerWidth/2-(document.getElementById('action1').getBoundingClientRect().width/2))
			}
			else{
				
				d3.select('#hwbush')
					.style("position","relative")
					.style("top",null)
					.style("left",null);
				
				d3.select('#ilsung')
					.style("position","relative")
					.style("top",null)
					.style("left",null);
				
				d3.select("#action1")
					.style("position","relative")
					.style("top",null)
					.style("left",null);
			}

		},
		offset: 20
	});

	var WaypointImage2 = new Waypoint({
		element: document.getElementById('para6'),
		handler: function(direction){
			if(direction==='down'){
				d3.select('#hwbush')
				.style("position","absolute")
				.style("top",document.body.scrollTop)
				.style("left",document.getElementById('hwbush').getBoundingClientRect().left);
			}
			else{
				d3.select('#hwbush')
				.style("position","fixed")
				.style("top","20px")
				.style("left",document.getElementById('hwbush').getBoundingClientRect().left);
			}
		},
		offset: document.getElementById('hwbush').getBoundingClientRect().height-document.getElementById('para6').getBoundingClientRect().height
	});
*/
	
}

function windowResize(){
	calendarShortHeight = getCalendarShortHeight();
	d3.selectAll(".leftImage").call(placeLeftImage,this);
	d3.selectAll(".rightImage").call(placeRightImage,this);
	document.getElementById('clinton').style.top = document.getElementById('para10').offsetTop;
	calLeftPosition();
}

window.onresize = windowResize;