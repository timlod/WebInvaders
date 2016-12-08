$(function () {

    function init() {
        $.getJSON('game.php?show=name',
            function (name) {
                // console.log(name);
                if(name == null) {
                    $("#userName").append("No Name");
                }else {
                    $("#userName").append(name);
                }

            });
        // console.log("yo");
        $.getJSON('game.php?show=highestScore',
            function (score) {
                // console.log(score);
                if(score == null) {
                    $("#highScore").append(0);
                }else {
                    $("#highScore").append(score);
                }
            });
    }


    function addScore(score) {
        // console.log("want to add score");
        $.post('game.php?addHighscore=new', { score: score })
            .done(function(data) {
                // console.log(data)
               // console.log("added score");
            });

        return false;
    }


    init();
    // addScore(236);

});
