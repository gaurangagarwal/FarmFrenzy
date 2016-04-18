<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Farm Frenzy</title>
<link rel="shortcut icon" href="images/duckright1.png">
<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/hover.css">
<!--link rel="stylesheet" type="text/css" href="css/jquery-ui.css"-->
</head>

<body>


<canvas id="backgroundCanvas" width="1100" height="600"></canvas>
<canvas id="mainCanvas" width="1100" height="600"></canvas>
<canvas id="grassCanvas" width="1100" height="600"></canvas>
<canvas id="scoreCanvas" width="1100" height="600"></canvas>
<canvas id="eggCanvas" width="1100" height="600"></canvas> 
<canvas id="ducks" width="1100" height="600"></canvas>


<div id="homeSceneMenu" style="background-image:url(images/background.jpg);">
	<img src="images/duckright1.png" width="80" height="80" style="position:absolute; top:175px; left:320px">
    <img src="images/duckleft1.png" width="80" height="80" style="position:absolute; top:175px; left:740px">
	<h1 id="farmFrenzy">Farm Frenzy</h1>
    <a id="newGame" class="hvr-glow" >New Game</a>
    <a id="homeHowToPlay" class="hvr-glow">How To Play</a>
</div>

<div id="money" class="info"></div>
<div id="eggsCollected" class="info"></div>
<div id="message" class="info"></div>
<div id="hungerLevel" class="info"></div>
<div id="menuButton" class="info"></div>
<!--<div id="summary" class="info"></div>-->
<div id="timer" class="info"></div>

<a id="menu" class="info" style="cursor:pointer"></a>
<div id="gamePausedMenu" class="info">
    <span style="font-size:26px; text-decoration:underline">Game Paused</span>
    <a id="resume" class="info" style="cursor:pointer">Resume</a>
    <a id="newGamePaused" class="info" style="cursor:pointer" href="index.php">New Game</a>
    <a id="howToPlay" class="info" style="cursor:pointer">How To Play</a>
</div>
<a id="sellEggs" href="#" class="hvr-glow"></a>
<img src="images/howToPlay.jpg" id="howToPlayImg">
<form id="summary" class="info" method="post" action="main.php">
	Enter Your name :<br> 
    <input id="username" type="text" name="username" value="NoName">
    <input id="score" type="number" name="score"><br>
    <input type="submit" id="continue" name="continue" class="hvr-glow">
</form>


<script src="js/jquery-1.11.2.min.js"></script>
<script src="js/myscript.js"></script>
<!--script src="js/jquery.js"></script>
<script src="js/jquery-ui.js"></script-->
</body>
</html>
