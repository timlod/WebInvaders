
$(function () {

    var listNode = $('#list');

    $('#global').click(loadAll);

    $('#personal').click(loadPlayer);


    function addPoint(point) {
        // console.log(point);
        var li = $('<li></li>');

        $('<span></span>').append(point.name).append(" ").append(point.score).appendTo(li);

        listNode.append(li);
    }

    function loadAll() {
        listNode.empty();
        $.getJSON('getHighscore.php?show=all',
        function (list) {
            console.log(list);
            for (var i = 0; i < list.length; i++) {
                addPoint(list[i]);
            }
        });
    }

    function loadPlayer() {
        listNode.empty();
        $.getJSON('getHighscore.php?show=player',
        function (list) {
            console.log(list);
            for (var i = 0; i < list.length; i++) {
                addPoint(list[i]);
            }
        });
    }

    $.getJSON('log.php?show=log',
    function(log) {
        console.log(log['login']);
        if (log['login']) {
            loadPlayer();
            $('#navbar').addClass('hidden');
            $('#navbar-right').removeClass('hidden');
        } else {
            loadAll();
            $('#navbar').removeClass('hidden');
            $('#navbar-right').addClass('hidden');
        }
    });
});
