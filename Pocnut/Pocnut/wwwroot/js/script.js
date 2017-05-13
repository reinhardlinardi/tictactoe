var timer; // timer variable

var selected = false; // true = player has select X or O
var first; // true = player first, false = AI first
var lock = true; // true = grid locked, cannot be clicked
var grid = "EEEEEEEEE"; // X = X, O = O, E = empty

function AIMove()
{
    $.ajax({ // request for AI's move
        url: '/Home/SendMove',
        type: 'POST',
        data: { first : first, grid : grid }, // data to be sent, key = parameter name, value = data
        dataType: 'text',
        success: function (id) {
            var grid_id = "#grid-" + id; // grid id to be updated
            $(grid_id).html(''); // remove image from link

            var html_string = "<img class=\"pocnut\" src=\"/images/"; // html string of img tag

            if (first) html_string += "Donut.png"; // if player first, use Donut
            else html_string += "Pocky.png"; // else use Pocky

            html_string += "\">";

            $(grid_id).append(html_string); // update grid picture
            lock = false; // release lock
        }
    });
}

function ShowGrid(_first) {
    clearTimeout(timer); //clear timer

    $.ajax({ // request for grid HTML string
        url: '/Home/ShowGrid', // url : /ControllerName/MethodName
        type: 'POST', // request type : POST
        dataType: 'text', // expected return type : text
        success: function(html_string) { // html_string : return data from server
            $('#game').append(html_string); // add grid HTML string to page
            $('#game').fadeIn(500); // show grid, animation 500 ms

            if (!_first) AIMove(); // if AI first, request for AI's move to server
            else lock = false; // release lock
        }
    });
}

function HideSelection(_first) {
    selected = true; // prevent select more than once
    first = _first; // set first value

    $('#game').fadeOut(500, function() { // hide all selection, animation 500 ms
        $('#game').html(''); // remove selection
    });

    timer = setTimeout(function () { ShowGrid(_first) }, 1000); // show grid in 1s
}

$(document).ready( // when page has loaded
    function() {
        $('#Pocky').click( // Pocky on click
            function() {
                if (!selected) { // first time selection
                    HideSelection(true); // player first
                }
            }
        );

        $('#Donut').click( // Donut on click
            function() {
                if (!selected) { // first time selection
                    HideSelection(false); // AI first
                }
            }
        );
        
        $(document).on('click', 'a.grid-link', // bind grid click event
            function (event) { 
                if (!lock) { // prevent click more than once
                    lock = true; // lock grid

                    var img_id = $(event.target).attr('id'); // get id of sender
                    var img_number = img_id.charAt(4); // get id number only

                    var grid_id = "#grid-" + img_number; // grid id to be updated
                    $(grid_id).html(''); // remove image from link

                    var html_string = "<img class=\"pocnut\" src=\"/images/"; // html string of img tag

                    if (first) html_string += "Pocky.png"; // if player first, use Pocky
                    else html_string += "Donut.png"; // else use Donut

                    html_string += "\">";

                    $(grid_id).append(html_string); // update grid picture
                }
            }
        );
    }
);