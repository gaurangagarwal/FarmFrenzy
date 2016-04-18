(function () {
	$(document).ready(function(e) {
		var game = {};
		
		var backgroundContent = document.getElementById("backgroundCanvas").getContext('2d');
		var mainContent = document.getElementById("mainCanvas").getContext('2d');
		var ducksContent = document.getElementById("ducks").getContext('2d');
		var grassContent = document.getElementById("grassCanvas").getContext('2d');
		var scoreContent = document.getElementById("scoreCanvas").getContext('2d');   //contains bucket,van, shed
		var eggContent = document.getElementById("eggCanvas").getContext('2d');
		var message = document.getElementById("message");
		var money = document.getElementById("money");
		var sellEggs = document.getElementById("sellEggs");
		var eggsCollected = document.getElementById("eggsCollected");
		var hungerLevel = document.getElementById("hungerLevel");
		var menuButton = document.getElementById("menuButton");
		var menu = document.getElementById("menu");
		var resume = document.getElementById("resume");
		var howToPlay = document.getElementById("howToPlay");
		var howToPlayImg = document.getElementById("howToPlayImg");
		var gamePausedMenu = document.getElementById("gamePausedMenu");
		var timer = document.getElementById("timer");
		var summary = document.getElementById("summary");
		var homeSceneMenu = document.getElementById("homeSceneMenu");
		var newGamePaused = document.getElementById("newGamePaused");
		
		game.clickSound  = new Audio('sounds/Click2.mp3');
		game.clickWell = new Audio('sounds/wellWater.wav');
		game.eggLay = new Audio('sounds/eggLay.wav');
		game.vehicleStart = new Audio('sounds/vehicleStart.wav');
		game.vehicleStop = new Audio('sounds/vehicleStop.wav');
		game.grassClick = new Audio('sounds/grassClick.wav');
		game.pickEgg = new Audio('sounds/clicks.wav');
		game.timeUp = new Audio ('sounds/Buzzer.mp3')
		
		game.imagesDone =0;
		game.images = [];
		game.height = 600;
		game.width = 1100;
		game.changeImageCounter = [];
		game.noOfDucks =3;
		game.money=60;
		game.fillWellMoney = 20;
		game.sellEggMoney = 10;
		game.maxEggs = 30;
		game.sendEggs =0;
		game.hungerLevel = 3;  // level high => eggs low
		game.hunger =0.1;  // when hunger reaches a value , a hunger level increases
		game.stop =1;
		game.timerSec =0;
		game.time = 2;
		game.timerMin =game.time;
		/*
		function start() {
			game.stop=1;
			homeSceneMenu.style.display = "block";
		};
		start();
		*/
		function startGame() {
			document.getElementById("newGame").onclick = function () {
				game.clickSound.play();
				clearInterval(game.startGame);
				//console.log('New Game');
				game.stop=0;
				homeSceneMenu.style.display = "none";
				onImageLoad();
			}
			document.getElementById("homeHowToPlay").onclick = function () {
				game.clickSound.play();
				homeSceneMenu.style.display = "none";
				howToPlayImg.style.display = "block";	
			}
			howToPlayImg.onclick = function () {
				
				game.clickSound.play();
				homeSceneMenu.style.display = "block";
				howToPlayImg.style.display = "none";	
			}
		}
		game.startGame = setInterval(function () { startGame()},2);
		
		game.main = {
			x : 200,
			y:110,
			heigth : 420,
			width : 700
		};
		//X : 70 , 740
		// Y : 25 , 390
		
		game.egg= {
			width : 15,
			height : 20,
			time : 1000
		};
		game.eggX = [];
		game.eggY = [];
		game.eggTime = [];
		game.noOfEggs = 0;
		
		game.ducks = [];
		
		for(i=0;i<game.noOfDucks;i++) {
			game.changeImageCounter[i] = 0;
			game.ducks[i] = {
				x: game.main.x + game.main.width*Math.random() - 40,
				y: game.main.y + game.main.heigth*Math.random() - 40,
				width : 60,
				height : 60,
				speed : 7 + i,  // on decrease , speed increases
				direction : Math.round(Math.random()*7),  // left =0 , right=1
				imageNo : 2,
				eating : 0  // not eating
			};
		}
		
		function loop() {
			if(game.stop==0) {
				requestAnimFrame(function() {
						loop();
				});
				update();
				render();
			} else  {
				if(game.timerMin!=0 || game.timerSec!=0)
					gamePaused();
				//loop();
			}
		}
		
		function gamePaused() {
			//console.log('hello');
			howToPlay.style.display = "block";
			resume.style.display = "block";
			gamePausedMenu.style.display = "block";
			newGamePaused.style.display = "block";
			resume.onclick = function () {
				game.clickSound.play();
				game.stop =0;
				howToPlay.style.display = "none";
				resume.style.display = "none";
				gamePausedMenu.style.display = "none";
				loop();	
			}
			howToPlay.onclick = function () {
				game.clickSound.play();
				howToPlay.style.display = "none";
				resume.style.display = "none";
				howToPlayImg.style.display = "block";	
			}
			howToPlayImg.onclick = function () {
				game.clickSound.play();
				//game.stop =0;
				howToPlay.style.display = "block";
				resume.style.display = "block";
				howToPlayImg.style.display = "none";
				loop();	
			}
		}
		function changeImage(duckNo, imageFrom , imageTo) {
			var duck = game.ducks[duckNo];
			if(duck.imageNo >= imageFrom && duck.imageNo < imageTo) {
				duck.imageNo++;
			} else if(duck.imageNo > imageFrom && duck.imageNo <= imageTo) {
				duck.imageNo--;
			}	
		};
		
		function initImages(paths) {
			game.imagesRequired = paths.length;
			for(i in paths) {
				//console.log(i);
				var img = new Image();
				img.src = paths [i];
				game.images[i] = img; 
				game.images[i].onload = function () {
					game.imagesDone++;	
				}
			}
		}
		//game.grass = [];
		
		game.grass = {
			width :178,
			height : 80
		};
		//0,170,170,230
		game.well = {
			x:0,
			y:160,
			width : 180,
			height : 200	
		};
		//120,330,50,80
		game.bucket = {
			x:120,
			y:300,
			width : 50,
			height : 80,
			full : 1,
			imageNo : 36	
		};
		
		//820,480,270,120
		game.van = {
			x : 845,
			y : 480,
			width : 260,
			height : 120,
			moveFor : 0,
			moveRev : 0,
			imageNo:41,
			extraDistTravel : 150
		};
		game.van.orgX = game.van.x;
		//0,410,200,190
		game.shed = {
			x : 0,
			y : 410,
			width : 200,
			height : 190
		};
		
		var imageLoad;
		function onImageLoad() {
			if(game.imagesDone>= game.imagesRequired) {
				//clearInterval(imageLoad);
				giveDirection();
				loop();	
				//changeImage();
			} else {
				setTimeout(function () {
					onImageLoad();	
				},100);
			}
		}
		
		var createNo = function (no1 , no2 , no3) {  // randomly gives direction if duck touches boundary
			var x = Math.round(Math.random()*7);
			while (x==no1 || x==no2 || x==no3) {
				x = Math.round(Math.random()*7);
			}
			switch(x) {
				case 0: image =  2;   break; // right
				case 1: image =  6;   break;  // left
				case 2: image =  10;  break;  // front
				case 3:	image =  13;  break;  // back
				case 4: image =  16;	break;  // backleft
				case 5: image =  19;	break;  // backright
				case 6: image =  22;	break;  // frontleft
				case 7: image =  25;	break;  // frontright
			}
		};
		
		game.gotoGrass = 0;
		game.grassX = [];
		game.grassY = [];
		game.grassAge = [];
		//var k =0;
		function duckRunToGrass(e) {
			//$(document).click(function(e) {
				
				//var grassX = e.offsetX;
				//var grassY = e.offsetY;
				//if((e.offsetX > game.main.x) && (e.offsetX < game.main.x + game.main.width) && (e.offsetY>game.main.y) && (e.offsetY < game.main.y + game.main.heigth)) {
					//grassContent.drawImage(game.images[28],e.offsetX - 56,e.offsetY-20,114,41);
					game.grassX[game.gotoGrass] = e.offsetX- game.grass.width/2;
					game.grassY[game.gotoGrass] = e.offsetY- game.grass.height/2;
					game.grassAge[game.gotoGrass] = 200;
					game.grassAgeVal = game.grassAge[game.gotoGrass];  // used in decrease grass
					grassContent.drawImage(game.images[30],game.grassX[game.gotoGrass],game.grassY[game.gotoGrass], game.grass.width ,game.grass.height);
					//game.grassX[game.gotoGrass] = (e.offsetX - 56);
					//game.grassY[game.gotoGrass] = (e.offsetY - 20);
					//console.log(game.gotoGrass , game.grassX);				
					game.gotoGrass++;
		}
		function duckFaceGrass() {
			for(i=0;i<game.noOfDucks;i++) {
				var duck = game.ducks[i];
				duck.prevX = duck.x;
				duck.prevY = duck.y;
				if(duck.x >= game.grassX[0] && duck.y >= game.grassY[0]) {
					duck.imageNo = 16;
				} else if(duck.x >= game.grassX[0] && duck.y <= game.grassY[0]){
					duck.imageNo = 22;
				}  else if(duck.x <= game.grassX[0] && duck.y >=game.grassY[0]){
					duck.imageNo = 19;
				}  else if(duck.x <= game.grassX[0] && duck.y <=game.grassY[0]){
					duck.imageNo = 25;
				}
			}
		}
		/*function moveVan () {
			//while(game.van.x < game.width+100) {
				scoreContent.clearRect(game.van.x,game.van.y,0.05,game.van.height);//van
				game.van.x +=25;
				scoreContent.drawImage(game.images[41],game.van.x,game.van.y,game.van.width,game.van.height);//van
			//}
		}*/
		
		game.mouseClick = false;
		
		$(document).mousedown(function(e) {
            game.mouseClick = true;
			game.mouseClickWhere = e;
        });	
		$(document).mouseup(function(e) {
            game.mouseClick = false;
        });
		
		
		game.rangeX = game.ducks[0].width;
		game.rangeY = 20;
		game.rand = [];
		for(i=0;i<game.noOfDucks;i++)
			game.rand[i]=0;
		
function update() {
	game.num = Math.round(Math.random()*2);
	for(i=0;i<game.noOfDucks;i++) {
		//game.eating[i] =0;	
		game.changeImageCounter[i]++;
		ducksContent.clearRect(game.main.x - 2*game.ducks[i].width ,game.main.y - game.ducks[i].height ,game.main.width + 4*game.ducks[i].width ,game.main.heigth + 2*game.ducks[i].height);
		if((game.ducks[i].x + game.ducks[i].width) >= (game.main.x + game.main.width))  { //goes right
			if(game.num==0) {
				game.ducks[i].imageNo = 6;
			} else if(game.num==1) {
				game.ducks[i].imageNo = 16;
			} else {
				game.ducks[i].imageNo = 22;
			}
		}
		else if(game.ducks[i].x <= game.main.x) {	 // goes left
			//game.ducks[i].imageNo = 2
			if(game.num==0) {
				game.ducks[i].imageNo = 2;
			} else if(game.num==1) {
				game.ducks[i].imageNo = 19;
			} else {
				game.ducks[i].imageNo = 25;
			}
		}
		else if((game.ducks[i].y + game.ducks[i].height) >= (game.main.y + game.main.heigth)) {	 // goes boottom
			//game.ducks[i].imageNo = 13;
			if(game.num==0) {
				game.ducks[i].imageNo = 13;
			} else if(game.num==1) {
				game.ducks[i].imageNo = 16;
			} else {
				game.ducks[i].imageNo = 19;
			}
		}
		else if(game.ducks[i].y <= game.main.y) {	 // goes top
			//game.ducks[i].imageNo = 10;
			if(game.num==0) {
				game.ducks[i].imageNo = 10;
			} else if(game.num==1) {
				game.ducks[i].imageNo = 22;
			} else {
				game.ducks[i].imageNo = 25;
			}
		}
		
		if(game.changeImageCounter[i] >=game.ducks[i].speed) {
		/*	var eggHona = Math.random()*100;
			if(eggHone%17==0)   // create a rand no check weather egg comes or not
				eggHona = 1;
			else 
				eggHona =0;*/		
				
			if(game.ducks[i].imageNo>=2 && game.ducks[i].imageNo<=5 && game.ducks[i].eating==0) {   // right
				changeImage(i,2,5);
				game.ducks[i].x +=7;	
			} else if(game.ducks[i].imageNo>=6 && game.ducks[i].imageNo<=9 && game.ducks[i].eating==0) {  //left 
				changeImage(i,6,9);
				game.ducks[i].x -=7;	
			} else if (game.ducks[i].imageNo>=10 && game.ducks[i].imageNo<=12) {  // front
				changeImage(i,10,12);
				game.ducks[i].y +=10;
			} else if (game.ducks[i].imageNo>=13 && game.ducks[i].imageNo<=15) {   //back
				changeImage(i,13,15);
				game.ducks[i].y -=7;
			}else if (game.ducks[i].imageNo>=16 && game.ducks[i].imageNo<=18) {    // backleft
				changeImage(i,16,18);
				if(game.gotoGrass) {
					//var rand=0;
					if(game.rand[i]==0)
						game.rand[i] = Math.random()*120; 
					game.ducks[i].x -= (game.ducks[i].prevX - (game.grassX[0]  + game.rand[i]))/8;
					game.ducks[i].y -= (game.ducks[i].prevY - (game.grassY[0] + i*6- game.ducks[i].height/2))/8;
					if(Math.abs(game.ducks[i].x - game.grassX[0])<=(game.rangeX + game.rand[i])  && Math.abs(game.ducks[i].y -(game.grassY[0] + i*6 - game.ducks[i].height/2 )) <= game.rangeY)  {
						game.rand[i] =0;
						game.ducks[i].imageNo = 29;
					}
				} else {
					game.ducks[i].x -=7;
					game.ducks[i].y -=7;
				}
			}
			else if (game.ducks[i].imageNo>=19 && game.ducks[i].imageNo<=21) {   // backright
				changeImage(i,19,21);
				
				if(game.gotoGrass) {
					//var rand=0;
					if(game.rand[i]==0)
						game.rand[i] = Math.random()*120; 
					game.ducks[i].x += Math.abs(game.ducks[i].prevX - (game.grassX[0] + game.rand[i]))/8;
					game.ducks[i].y -= (game.ducks[i].prevY - (game.grassY[0] + i*6- game.ducks[i].height/2))/8;
					if(Math.abs(game.ducks[i].x - game.grassX[0]) <= (game.rangeX + game.rand[i]) && Math.abs(game.ducks[i].y - (game.grassY[0] + i*6 - game.ducks[i].height/2 )) <= game.rangeY) {
						game.rand[i] = 0;
						game.ducks[i].imageNo = 28; 
					}
				} else {
					game.ducks[i].x +=7;
					game.ducks[i].y -=7;
				}
			}
			else if (game.ducks[i].imageNo>=22 && game.ducks[i].imageNo<=24) {     // frontleft
				changeImage(i,22,24);                             
				if(game.gotoGrass) {
				//	console.log(game.gotoGrass);
					//var rand=0;
					if(game.rand[i]==0)
						game.rand[i] = Math.random()*120; 
					game.ducks[i].x -= (game.ducks[i].prevX - (game.grassX[0] + game.rand[i]))/8;
					game.ducks[i].y -= (game.ducks[i].prevY - (game.grassY[0] + i*6- game.ducks[i].height/2))/8;
					if(Math.abs(game.ducks[i].x - game.grassX[0]) <= (game.rangeX + game.rand[i])  && Math.abs(game.ducks[i].y - (game.grassY[0] + i*6 - game.ducks[i].height/2 )) <= game.rangeY) {
						game.rand[i] = 0;
						game.ducks[i].imageNo = 29; 
					}
				} else {
					game.ducks[i].x -=7;
					game.ducks[i].y +=7;
				}
			}
			else if (game.ducks[i].imageNo>=25 && game.ducks[i].imageNo<=27) {      // frontright
				changeImage(i,25,27);
				if(game.gotoGrass) {
					//var rand=0;
					if(game.rand[i]==0)
						game.rand[i] = Math.random()*120; 
					game.ducks[i].x -= (game.ducks[i].prevX - (game.grassX[0] + game.rand[i]))/8;
					game.ducks[i].y -= (game.ducks[i].prevY - (game.grassY[0] + i*6- game.ducks[i].height/2))/8;
					if(Math.abs(game.ducks[i].x - game.grassX[0]) <= (game.rangeX + game.rand[i])  && Math.abs(game.ducks[i].y - (game.grassY[0] + i*6 - game.ducks[i].height/2 )) <= game.rangeY) {
						game.rand[i] = 0;
						game.ducks[i].imageNo = 28; 
					}
				} else {
					game.ducks[i].x +=7;
					game.ducks[i].y +=7;
				}
			}
			else if (game.ducks[i].imageNo==28 || (game.ducks[i].eating ==1 && game.ducks[i].imageNo==3)) { // eating images// 7=>29 , 3=>28
				var x = Math.round(Math.random());
				if(x==0)  {
					game.ducks[i].imageNo=28;
				} else { 
					game.ducks[i].imageNo=3;
				}
				game.ducks[i].eating = 1;
			}
			else if (game.ducks[i].imageNo==29 || (game.ducks[i].eating ==1 && game.ducks[i].imageNo==7)) { // eating images// 7=>29 , 3=>28
				var x = Math.round(Math.random());
				if(x==0) {
					game.ducks[i].imageNo=29;
				} else { 
					game.ducks[i].imageNo=7;
				}
				game.ducks[i].eating = 1;
			}
			
			// to decrease grass
			//68 // 100 // 144
			if(game.ducks[i].imageNo==29  || game.ducks[i].imageNo==28 || game.ducks[i].eating==1) {
				game.hunger-=3;
				game.grassAge[0]--;
				if(game.grassAge[0] <= 0) {
					//console.log('<=0');
					grassContent.clearRect(game.grassX[0],game.grassY[0], game.grass.width,game.grass.height);
					//console.log(game.grassX);
					game.grassX.splice(0,1);
					game.grassY.splice(0,1);
					game.grassAge.splice(0,1);
					game.gotoGrass--;
					//console.log(game.grassX , game.gotoGrass);
					for(j=0; j<game.noOfDucks;j++) {
						game.ducks[j].eating = 0;
						var x = Math.round(11*Math.random());
						game.ducks[j].imageNo = 16+x;
					}
					if(game.gotoGrass) {
						duckFaceGrass();
						grassContent.drawImage(game.images[30],game.grassX[0],game.grassY[0], game.grass.width ,game.grass.height);			
					}
					//giveDirection();	// after grass is over ducks need to move randomly
					/*switch(game.ducks[i].direction) {
						case 0: game.ducks[i].imageNo = 2;break; // right
						case 1: game.ducks[i].imageNo = 6;break;  // left
						case 2: game.ducks[i].imageNo = 10;break;  // front
						case 3:	game.ducks[i].imageNo = 13;break;  // back
						case 4: game.ducks[i].imageNo = 16;break;  // backleft
						case 5: game.ducks[i].imageNo = 19;break;  // backright
						case 6: game.ducks[i].imageNo = 22;break;  // frontleft
						case 7: game.ducks[i].imageNo = 25;break;  // frontright
					}*/
				} else if(game.grassAge[0] <= game.grassAgeVal/4) {
					grassContent.clearRect(game.grassX[0],game.grassY[0], game.grass.width,game.grass.height);
					grassContent.drawImage(game.images[33],game.grassX[0],game.grassY[0], game.grass.width ,game.grass.height);				
				} else if(game.grassAge[0] <= 2*game.grassAgeVal/4) {
					grassContent.clearRect(game.grassX[0],game.grassY[0], game.grass.width,game.grass.height);
					//console.log('<=2/4');
					//grassContent.clearRect(game.grassX[0],game.grassY[0], 100 ,game.grass.height);
					grassContent.drawImage(game.images[32],game.grassX[0],game.grassY[0], game.grass.width ,game.grass.height);		
				} else if(game.grassAge[0] <= 3*game.grassAgeVal/4) {
					//console.log('<=3/4');
					grassContent.clearRect(game.grassX[0],game.grassY[0], game.grass.width,game.grass.height);
					//grassContent.clearRect(game.grassX[0],game.grassY[0], 68 ,game.grass.height);
					grassContent.drawImage(game.images[31],game.grassX[0],game.grassY[0], game.grass.width ,game.grass.height);		
				} 
			}
			
			game.changeImageCounter[i]=0;	
		}
	}
	for(i in game.eggX) {
		if(game.eggTime[i]>0) {
			if(game.eggTime%2==0)
				eggContent.clearRect(game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);		
		}
		if(game.eggTime[i]<=0) {
			eggContent.clearRect(game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
			game.eggX.splice(i,1);
			game.eggY.splice(i,1);
			game.eggTime.splice(i,1);
	   }	
	}
	if(game.eggX.length==0) {
		eggContent.clearRect(0,0,game.main.width,game.main.heigth);	
	}
	game.hunger += 0.7;
	if(game.hunger>1000 && game.hungerLevel<5) {
		game.hungerLevel++;
		game.hunger=0;
	} else if(game.hunger<=0 && game.hungerLevel>1) {
		game.hungerLevel--;
		game.hunger =400;	
	}
	
	menu.onclick = function () {
		if(game.stop==0)  {
			game.stop=1;
			game.clickSound.play();
		}
	}
	
}
		/*
		game.mouseOver = false;
		function checkMouse () {
			$(document).mouseover(function() {
				game.mouseOver = true;
			});
			$(document).mouseout(function() {
                game.mouseOver = false;
            });
			$(document).mousemove(function(e) {
                game.mouseOverWhereX = e.pageX;
				game.mouseOverWhereY = e.pageY;
            });
			//console.log(game.mouseOverWhereY);
		};*/
	
		
function render() {
	// grass width = 178; 178/2 = 89;   grass height 80;  40,
	//X : 90 , 705 // from where the click shoould be allowed
	// Y : 70 , 375
	//$(document).mousedown(function(e) {
	
	if(game.mouseClick) {
		//console.log(game.bucket.full);
		game.mouseClick= false;
		var e = game.mouseClickWhere;
		for(i in game.eggX) {
			if((e.offsetX >= game.eggX[i]-10) && (e.offsetX <= game.eggX[i]+ game.egg.width+10) && (e.offsetY>=game.eggY[i]) && (e.offsetY <= game.eggY[i] + game.egg.height+20)) {
				game.noOfEggs++;
				if(game.noOfEggs>game.maxEggs) {
					 displayMessage('No space available');
				}else {
					game.pickEgg.play();
					eggContent.clearRect(game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
					game.eggX.splice(i,1);
					game.eggY.splice(i,1);
					game.eggTime.splice(i,1);
				}
			}
		}
		if((e.offsetX > game.main.x+90) && (e.offsetX <= game.main.x + game.main.width-95) && (e.offsetY>=game.main.y+70) && (e.offsetY <= game.main.y + game.main.heigth-45) && game.bucket.full==1) {
			game.grassClick.play();
			//game.hunger -=1000;
			game.bucket.full=0;
			duckRunToGrass(e);
			if(game.gotoGrass==1)
				duckFaceGrass();
		}
		else if((e.offsetX >= game.well.x) && (e.offsetX <= game.well.x + game.well.width) && (e.offsetY>=game.well.y) && (e.offsetY <= game.well.y + game.well.height)) {
			//console.log('hello');
			game.clickSound.play();
			scoreContent.clearRect(game.bucket.x,game.bucket.y,game.bucket.width,game.bucket.height);
			if(game.bucket.full==0) {
				game.clickWell.play();
				game.money -= game.fillWellMoney;
			}
			if(game.money>=0) {
				game.bucket.full = 1;
			} else {
				displayMessage('No much money available');
				game.money += game.fillWellMoney;
			}
			//money.innerHTML = 'Money : $'+ game.money;
		}
	}
	
// }
	mainContent.drawImage(game.images[34],game.well.x,game.well.y,game.well.width,game.well.height); 
	$(document).mousemove(function(e) {
		game.mouseOverWhereX = e.pageX-100; // because margin of canvas is 100 
		game.mouseOverWhereY = e.pageY;
	});
	//console.log(game.mouseOverWhereY , game.well.y , game.well.height);
	//console.log(game.mouseOverWhereX , game.well.x , game.well.width);	
	if((game.mouseOverWhereX >= game.well.x) && (game.mouseOverWhereX <= game.well.x + game.well.width+10) && (game.mouseOverWhereY>=game.well.y) && (game.mouseOverWhereY <= game.well.y + game.well.height+10)) {
		//console.log('Over well');
		mainContent.clearRect(game.well.x,game.well.y,game.well.width,game.well.height); 	
		mainContent.drawImage(game.images[35],game.well.x,game.well.y,game.well.width,game.well.height);
	} else {
		//console.log('Not Over well');
		mainContent.clearRect(game.well.x,game.well.y,game.well.width,game.well.height); 	
		mainContent.drawImage(game.images[34],game.well.x,game.well.y,game.well.width,game.well.height); 	
	}
	
	for(i in game.eggX) {
		game.eggTime[i]--;
		 eggContent.clearRect(game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
	   if((game.mouseOverWhereX >= game.eggX[i]-10) && (game.mouseOverWhereX <= game.eggX[i] + game.egg.width+10) && (game.mouseOverWhereY>=game.eggY[i]) && (game.mouseOverWhereY <= game.eggY[i] + game.egg.height+20)) {
		  //eggContent.clearRect(game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
		  eggContent.drawImage(game.images[39],game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
	   } else {
		  eggContent.clearRect(game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
		  eggContent.drawImage(game.images[38],game.eggX[i],game.eggY[i],game.egg.width, game.egg.height);
	   }
	   
	}

	backgroundContent.drawImage(game.images[0],0,0,game.width,game.height);
	mainContent.drawImage(game.images[1],game.main.x,game.main.y,game.main.width,game.main.heigth);   // the main content area
	scoreContent.drawImage(game.images[40],game.shed.x,game.shed.y,game.shed.width,game.shed.height); // shed
	
	if(game.noOfEggs>=game.maxEggs) {
		game.noOfEggs = game.maxEggs;
	}
	var high = Math.floor(game.noOfEggs/10);   
	//console.log(high);
	var till =10;  // egg in shed
	for(i=0;i<=high;i++) {
	  if(i==high) {
		  till = game.noOfEggs - high*10;
	  }
	  for(j=0;j<till;j++) {
		eggContent.drawImage(game.images[38],22+j*game.egg.width,465+45*i,game.egg.width,game.egg.height);
	  }
	}
	
	if(game.noOfEggs==0) { //clear eggs in shed
		for(i=0;i<3;i++) {
		  for(j=0;j<10;j++) {
			eggContent.clearRect(22+j*game.egg.width,465+45*i,game.egg.width,game.egg.height);
		  }
		}
	}
	//scoreContent.font = "30px AR JULIAN";
	//scoreContent.fillStyle = "white";
	//scoreContent.clearRect(900,30,300,300);
	//scoreContent.fillText('Eggs  : ' + game.noOfEggs,900,50);
	//scoreContent.fillStyle = "white";
	//scoreContent.fillRect(900,70,150,50);
	//scoreContent.fillStyle = "green";
	//scoreContent.fillText('Sell Eggs',900,100);
/*	var message = document.getElementById("message");
	if(game.noOfEggs>=game.maxEgss) {
		message.style.display = "block";
		message.innerHTML = "No space available";
		game.messageClear = setTimeout (function () {
			message.style.display = "none";
		},500); 
	}*/
	
	sellEggs.innerHTML = 'Sell Eggs';
	sellEggs.onclick = function () {
		game.clickSound.play();
		if(game.noOfEggs>0 && game.van.x<=game.van.orgX) {
			game.vehicleStart.play();
			game.sendEggs = game.noOfEggs;
			game.noOfEggs =0;
			game.van.moveFor =1;	
		} else {
			displayMessage('Not Possible')	
		}
	}
	
	eggsCollected.innerHTML = 'Eggs : '+ game.noOfEggs ;
	hungerLevel.innerHTML = "Hunger Level : " + game.hungerLevel;
	menu.innerHTML= "Menu";
	
	money.innerHTML = 'Money : $'+ game.money;
	money.style.display = "block";
	eggsCollected.style.display = "block";
	sellEggs.style.display = "block";
	hungerLevel.style.display = "block";
	menu.style.display = "block";
	timer.style.display = "block";
	/*menu.style.display = "block";*/
	//scoreContent.clearRect(30,30,300,300);
	//scoreContent.font = "30px AR JULIAN";
	//scoreContent.fillStyle = "white";
	//scoreContent.fillText('Money : ' + game.money,30,45);
	
	//scoreContent.drawImage(game.images[38],970,30,game.egg.width,game.egg.height);
	//$("#mainCanvas").css('border','5px solid red');
	//scoreContent.fillStyle = "blue"; // hungerLevel
	//scoreContent.createLinearGradient(960,280+i*27,40,25);
	//scoreContent.clearRect(920,10,170,33);
	for(i=0;i<5;i++) {
		var grd = scoreContent.createLinearGradient(920+i*29,10,25+920+i*29,33+10);
		/*grd.addColorStop(0,"white");
		if(game.hungerLevel<=3)	
			grd.addColorStop(1,"green");
		else 
			grd.addColorStop(1,"red");*/
		scoreContent.clearRect(920+i*29,10,170,33);	
		switch(game.hungerLevel) {
			case 1: grd.addColorStop(0,"#3bff21");
					grd.addColorStop(1,"#076c07");
					break;
			case 2: grd.addColorStop(0,"#d5ce0b");
					grd.addColorStop(1,"#fbf803");
					break;
			case 3: grd.addColorStop(0,"#2514ff");
					grd.addColorStop(1,"#2fc0df");
					break;
			case 4: grd.addColorStop(0,"#7a4205");
					grd.addColorStop(1,"#ffb400");
					break;
			case 5:	grd.addColorStop(0,"#7e0c06");
					grd.addColorStop(1,"#f32807");
					break;
		}
		scoreContent.fillStyle = grd;
		//scoreContent.fillStyle = "blue";
		scoreContent.fillRect(920+i*29,10,25,33);
	}
	//console.log(game.hunger);
	//console.log( game.hungerLevel);
/*	for(i=0;i<5;i++) {
		scoreContent.clearRect(920+i*29,10,170,33);
	}*/
	
	scoreContent.drawImage(game.images[game.bucket.imageNo + game.bucket.full],game.bucket.x,game.bucket.y,game.bucket.width,game.bucket.height);   // the bucket
	
	scoreContent.clearRect(game.van.x,game.van.y,game.van.width,game.van.height);
	if(game.van.moveFor==1 && game.van.x<game.width+ game.van.extraDistTravel && game.van.imageNo ==41) {
		game.van.moveRev =0;
		game.van.x+=1.5;
	}
	if(game.van.moveRev==1 && game.van.x>game.van.orgX && game.van.imageNo==42) 
		game.van.x-=1.5;
	if(game.van.moveRev==1 && game.van.x>game.van.orgX && game.van.imageNo==42 && game.van.x<game.van.orgX+75) 
		game.vehicleStop.play();	
	if(game.van.x<=game.van.orgX) {
		game.van.imageNo = 41;
		game.money += game.sellEggMoney*game.sendEggs;
		game.sendEggs = 0;		
	}
	scoreContent.drawImage(game.images[game.van.imageNo],game.van.x,game.van.y,game.van.width,game.van.height); //van
	if(game.van.moveFor==1 && game.van.x >=(game.width + game.van.extraDistTravel)) {
		game.van.imageNo = 42;
		game.van.moveFor=0;
		game.van.moveRev=1;	
	}
	//game.hungerLevel =0;
	for(i=0;i<game.noOfDucks;i++) {
		var ducks = game.ducks[i];
		var num = 5 - game.hungerLevel;
		//501*5 => 0, 501*4 =>1 , 501*3 =>2 , 501*0=>5   
		var eggRand = Math.round(Math.random()*501*num);
		if(eggRand%501==0 && eggRand!=0)  {  // create a rand no check weather egg comes or not
			//if(game.eggLay.play())	
				//game.eggLay.stop();
			game.eggLay.play();
			game.eggX.push(ducks.x+25);
			game.eggY.push(ducks.y+35);
			game.eggTime.push(game.egg.time);
			//console.log(game.eggX);
			eggContent.drawImage(game.images[38],ducks.x+25,ducks.y+35, game.egg.width,game.egg.height);					
		}
		ducksContent.drawImage(game.images[ducks.imageNo],ducks.x,ducks.y,ducks.width,ducks.height);
	} 
	for(i=1;i<game.gotoGrass;i++) {
		grassContent.drawImage(game.images[30],game.grassX[i],game.grassY[i],game.grass.width ,game.grass.height);			
	}
	//});
}

		//backgroundContent.font = "Bold 50px Jokerman";
		//backgroundContent.fillStyle = "white";
		//backgroundContent.fillText('Loading..',game.width/2 -60 ,game.height/2);
		initImages(['images/background.jpg','images/main5.png', /*2*/'images/duckright1.png','images/duckright2.png' , 'images/duckright3.png' , 'images/duckright4.png', /*6*/'images/duckleft1.png','images/duckleft2.png' , 'images/duckleft3.png','images/duckleft4.png', /*10*/'images/duckfront1.png','images/duckfront2.png' , 'images/duckfront3.png', /*13*/'images/duckback1.png','images/duckback2.png','images/duckback3.png' , /*16*/'images/duckbackleft1.png','images/duckbackleft2.png','images/duckbackleft3.png', /*19*/'images/duckbackright1.png' , 'images/duckbackright2.png' , 'images/duckbackright3.png', /*22*/'images/duckfrontleft1.png' ,'images/duckfrontleft2.png' , 'images/duckfrontleft3.png', /*25*/'images/duckfrontright1.png' , /*26*/'images/duckfrontright2.png',/*27*/'images/duckfrontright3.png',/*28*/'images/duckeatright.png',/*29*/'images/duckeatleft.png',/*30*/'images/grass1.png',/*31*/'images/grass2.png',/*32*/'images/grass3.png',/*33*/'images/grass4.png',/*34*/'images/well.png',/*35*/'images/well2.png',/*36*/'images/bucketEmpty.png',/*37*/'images/bucketFull.png',/*38*/'images/egg1.png',/*39*/'images/egg2.png',/*40*/'images/shed.png',/*41*/'images/van1.png',/*42*/'images/van2.png']);

		//onImageLoad();
		//start();
		function displayMessage (msg) {
			clearInterval(game.messageClear);
			message.style.display = "block";
					message.innerHTML = msg;
					game.messageClear = setTimeout (function () {
						message.style.display = "none";
			},1000);
		};
		
		function giveDirection() {
			for(i=0;i<game.noOfDucks;i++) {
				switch(game.ducks[i].direction) {
					case 0: game.ducks[i].imageNo = 2;break; // right
					case 1: game.ducks[i].imageNo = 6;break;  // left
					case 2: game.ducks[i].imageNo = 10;break;  // front
					case 3:	game.ducks[i].imageNo = 13;break;  // back
					case 4: game.ducks[i].imageNo = 16;break;  // backleft
					case 5: game.ducks[i].imageNo = 19;break;  // backright
					case 6: game.ducks[i].imageNo = 22;break;  // frontleft
					case 7: game.ducks[i].imageNo = 25;break;  // frontright
				}
			}
		};
		
		
		// timer is here
		var time =  (function() {
			if(game.timerMin<=0 && game.timerSec<=0) {
				game.stop=1;
				clearInterval(timeGoing);
				timer.innerHTML = "Time's Up !!";
				game.timeUp.play();
				//summary.innerHTML = "Money Earned <br>" + "&nbsp; &nbsp; &nbsp; $ " + game.money ; 
				document.getElementById("score").value = game.money;
				summary.style.display = "block";
				document.getElementById("score").style.display = "none";
				//setTimeout(location.reload() ,5000);
			}
			if(game.timerSec<0) {
				game.timerMin--;
				game.timerSec =59;	
			}
			if(game.timerSec<10)
				game.timerSec = '0' + game.timerSec;
			timer.innerHTML = "Timer <br>" + "0" +game.timerMin +":" +game.timerSec;	
		});
		time();
		var timeGoing = setInterval(function () {
			if(game.stop==0) {
				game.timerSec--;
				time();
			}
		},1000);
		
		
		/*document.getElementById("newGame").onclick = function() {
			game.stop=0;
			homeSceneMenu.style.display = "none";
			onImageLoad();
		};*/	
	});
})();



window.requestAnimFrame = (function(){      // code copied from 				http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  	return   window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||   // chrome and safari
          	window.mozRequestAnimationFrame    ||   // mozilla
			window.oRequestAnimationFrame    ||     // opera
			window.msRequestAnimationFrame    ||    // IE
          	function( callback ){
            	window.setTimeout(callback, 1000 / 60);
          	};
})();