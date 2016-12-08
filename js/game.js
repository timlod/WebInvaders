$(function () {

    function init() {
        $.getJSON('game.php?show=name',
            function (name) {
                $("#userName").append(name);
            });
        $.getJSON('game.php?show=highestScore',
            function (score) {
                if(score == null) {
                    $("#highScore").append(0);
                }else {
                    $("#highScore").append(score);
                }
            });
    }
    init();

});
