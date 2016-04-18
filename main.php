<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Farm Frenzy</title>
<link rel="shortcut icon" href="images/duckright1.png">
<link rel="stylesheet" type="text/css" href="css/styles.css">
<link rel="stylesheet" type="text/css" href="css/hover.css">
</head>

<body>
<div id="final" style="background-image:url(images/background.jpg);">
<h1 id="farmFrenzy">Farm Frenzy</h1>
<?php 
$conn = new mysqli("localhost","phpwebdes","lynda","farmfrenzy");
if(!$conn)
	die("Error : ".$conn->connect_error);
if(isset($_POST['continue'])) {
	$name = $_POST['username'];
	$score= $_POST['score'];
	$sql = "INSERT INTO highscores (username,highscore)
	VALUES ('$name','$score')";
	if(!$conn->query($sql))
		echo 'Error : '.$conn->error;
	$select = "SELECT id,username,highscore
			   FROM highscores
			   ORDER BY highscore DESC";
	$result = $conn->query($select);
	$count=1;
	$num = 0;
	if ($result->num_rows > 0) {
    // output data of each row
		echo '<table id="table" cellspacing="5">'.'<tr id="heading">'.'<td class="heading">'.'Rank'.'</td><td class="heading">'.'Name'.'</td><td class="heading">'.'Money'.'</td>'.'</tr>';
    	while($row = $result->fetch_assoc()) {
			if($name == $row['username'] && $score == $row['highscore']) {
					echo '<tr id="myScore">'.'<td class="myScore">'.$count.'</td><td class="myScore">'.$row['username'].'</td><td class="myScore">'.$row['highscore'].'</td>'.'</tr>';
					$num++;		
			} else if($count<=5) {
				echo '<tr id="allScores">'.'<td class="allScores">'.$count.'</td><td class="allScores">'.$row['username'].'</td><td class="allScores">'.$row['highscore'].'</td>'.'</tr>';
				$num++;
			}
			if($num>=6)
				break;
			$count++;
		}
		echo '</table>';
	}
}
?>
<a href="index.php" id="newGameFinal" class="hvr-grow-shadow">New Game</a>
</div>
</body>
</html>