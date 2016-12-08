$(function () {

    function init() {
        $.getJSON('game.php?show=name',
            function (name) {
                $("#userName").append(name);
            });
        $.getJSON('game.php?show=highestScore',
            function (score) {
                console.log(score);
                $("#highScore").append(score);
            });
    }
    init();

});
