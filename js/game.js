
$(function () {

    function init() {
        console.log("INITIALI");
        // $("#userName").append("<h1>ERROR!</h1>");
        $.getJSON('game.php?show=name',
            function (list) {

                // $("#userName").clear();
                for (var i = 0; i < list.length; i++) {
                    $("#userName").append(list[i]);
                }
            });
        $.getJSON('game.php?show=highestScore',
                function (list) {

                    for (var i = 0; i < list.length; i++) {
                        $("#highScore").append(list[i]);
                    }
                });
    }


    init();

});
