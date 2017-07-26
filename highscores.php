<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

    <!--<meta name="description" content="">-->
    <!--<meta name="author" content="">-->
    <!--<link rel="icon" href="../../favicon.ico">-->

    <title>Gem Island</title>


    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Custom styles for this template -->
    <link href="css/cover.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="js/jquery.profanityfilter.js"></script>
</head>

<body>
<?php
require 'php/db_config.php';
$host = $db_config['host'];
$port = $db_config['port'];
$dbname = $db_config['dbname'];
$user = $db_config['user'];
$passwd = $db_config['passwd'];
$db = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$passwd");

require 'php/db_functions.php';
?>
<div class="container-fluid text-center">

    <div class="row" style="padding:20px;">
        <div class="col-md-4">

        </div>
        <div class="col-md-4">
            <nav class="">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    </button>
                    <div id="leftNavbar" class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-left masthead-nav">
                            <li class="active"><a href="#">Gem Island</a></li>
                        </ul>
                    </div><!--/.nav-collapse -->
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right masthead-nav">
                        <li><a href="/index.html">Home</a></li>
                        <li class="active"><a href="#">High Scores</a></li>
                        <li><a href="/credits.html">Credits</a></li>
                        <li><a href="https://github.com/tombrereton/threematch_js">Github</a></li>
                    </ul>
                </div><!--/.nav-collapse -->
            </nav>
        </div>
        <div class="col-md-4">

        </div>
    </div>

    <div class="row">
        <div class="col-lg-4">
            <h3>Level 1</h3>
            <?php
            echo getHighScores(0, 50);
            ?>
        </div>
        <div class="col-lg-4">
            <h3>Level 2</h3>
            <?php
            echo getHighScores(1, 50);
            ?>
        </div>
        <div class="col-lg-4">
            <h3>Level 3</h3>
            <?php
            echo getHighScores(2, 50);
            ?>
        </div>
    </div>


    <div class="cover-container">
        <div class="mastfoot">
            <div class="inner">
                <p>Cover template for <a href="http://getbootstrap.com">Bootstrap</a>, by <a
                            href="https://twitter.com/mdo">@mdo</a>.</p>
            </div>
        </div>
    </div>
</div>


<?php
pg_close($db);
?>
<!-- Bootstrap core JavaScript
================================================== -->
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
        integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>
<!--<script src="//cdn.jsdelivr.net/phaser/2.6.2/phaser.min.js"></script>-->
<script>
    $(document).profanityFilter({
        externalSwears: 'js/swearWords.json'
    });
</script>

<!-- Game javascript
================================================== -->
</body>
</html>
