
$(function () {

    var listNode = $('#list');



    function addPoint(point) {
        // console.log(point);
        var li = $('<li></li>');

        $('<span></span>').append(point.name).append(" ").append(point.score).appendTo(li);

        listNode.append(li);
    }

    function loadAll() {

        $.getJSON('getHighscore.php?show=player',
                function (list) {
                    console.log(list);
                    for (var i = 0; i < list.length; i++) {
                        addPoint(list[i]);
                    }
                });
    }


    loadAll();

});
