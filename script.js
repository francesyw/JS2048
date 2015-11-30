$(document).ready(function(){
    var hasMoves = false;
    var isMoved = true;
    var originalTiles = [];
    for (i = 0; i < 16; i++) {
        originalTiles.push(i);
    }
    var emptyTiles = originalTiles.slice();
    newTile(); 
    newTile();     

    function newTile() {
        // TODO: (BUG) consider situation when no empty tiles left.
        var tile = emptyTiles[Math.floor((Math.random() * emptyTiles.length))];
        var row = Math.floor(tile/4);
        var col = tile % 4;
        
        // TODO: 1) generate 4 when only one tile-2 left. 2) generate 2/2 or 2/4 when the game starts.
        var newVal = Math.random() < 0.9 ? 2 : 4;
        $('.tile-container').append('<div id = "added" class="tile tile-'+newVal+' grid-'+row+'-'+col+'"><div class="tile-value"></div></div>');  
        $('#added').css('opacity', '0');
        $('#added').fadeTo(500,1,function(){})
        $('#added').removeAttr("id");      
        gameInit();

        // check available tiles 
        emptyTiles.splice( $.inArray(tile, emptyTiles), 1 );       
    }

    function gameInit() {        
        for (var i = 2; i <= 2048; i *= 2) {
            $('div.tile-'+i).find($('div.tile-value')).html(i);                 
        }        
    }

    // key events
    $(document).keydown(function(e){
        isMoved = false;
        // if (!hasMoves) { // TODO: check game over situation
        emptyTiles = originalTiles.slice(); // initialize the array    
        switch(e.which) {

            case 37: // left
                for (var col = 0; col <=3; col++) {
                    for (var row = 0; row <= 3; row++) {
                        keyMove(row, col, 37);
                    }
                }                      
                break;

            case 38: // up              
                for (var row = 0; row <=3; row++) {
                    for (var col = 0; col <= 3; col++) {
                        keyMove(row, col, 38);
                    }
                } 
                break;
            
            case 39: // right
                for (var col = 3; col >=0; col--) {
                    for (var row = 0; row <= 3; row++) {
                        keyMove(row, col, 39);
                    }
                }                                   
                break;

            // down 
            case 40:                             
                for (var row = 3; row >=0; row--) {
                    for (var col = 0; col <= 3; col++) {
                        keyMove(row, col, 40);
                    }
                }                                                  
                break;

            default: return;
        }
        // }  
        // delte all the merged attributes 
        $("div[merged]").each(function() { $(this).removeAttr("merged") }) 
        // check if any moves left; 1) if no moves - no new tile; 2) if any tiles move - newTile();
        if (isMoved) { newTile() }                     
    })

    function keyMove(row, col, key) {
        var $targetPos = 'grid-'+row+'-'+col;
        
        if ($('.tile').hasClass($targetPos)) {
            var $targetVal = $('div.grid-'+row+'-'+col).find($('div.tile-value')).html();
            var moveTile = tileMove(row, col, $targetVal, key);
            var $destPos = moveTile.destination;
            var $destVal = 'tile-' + moveTile.tileVal;
            var merged = moveTile.merged;

            $('.tile.'+$targetPos).removeClass($targetPos).addClass($destPos);
            $('.tile.'+$destPos).removeClass('tile-'+$targetVal).addClass($destVal);
            gameInit();
            if (merged) {$('.'+$destPos).attr("merged", true)};
        }
    }

    function tileMove(row, col, $tileVal, key) {
        var pos = (key == 37 || key == 39) ? col : row;
        var bfMove = pos;    // position before move
        var merged = false;

        while ((key == 37 || key == 38) ? (pos > 0):(pos < 3))  {                    
            var $obstacle = (key == 37 || key == 39) ? ('grid-'+row+'-'+ ((key == 37) ? (pos-1) : (pos+1))) : ('grid-'+((key == 38) ? (pos-1) : (pos+1))+'-'+col);
            if ($('.tile').hasClass($obstacle)) {  
                // check if already merged
                if (!$('.'+$obstacle).attr("merged")) {
                    // compare tile;
                    $obstVal = $('div.'+$obstacle).find($('div.tile-value')).html();
                    if ($tileVal == $obstVal) {
                        // mergeTile();
                        $('.'+$obstacle).remove()
                        pos = (key == 37 || key == 38) ? (pos-1) : (pos+1);
                        $tileVal *= 2; 
                        merged = true;
                        break;               
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            pos = (key == 37 || key == 38) ? (pos-1) : (pos+1);
        }
        if (bfMove !== pos) { isMoved = true };  
        var index = (key == 37 || key == 39) ? (row * 4 + pos) : (pos * 4 + col);
        emptyTiles.splice( $.inArray(index, emptyTiles), 1 );  // remove the new position from the empty tiles  
        $destination = (key == 37 || key == 39) ? ('grid-'+row+'-'+ pos) : ('grid-'+pos+'-'+col);
        return {
            destination: $destination,
            tileVal: $tileVal,
            merged: merged
        };
    }

    // TODO: keep scores...

    // prevent arrow key scrolling
    var ar=new Array(33,34,35,36,37,38,39,40);
    $(document).keydown(function(e) {
        var key = e.which;    
        //if(key==35 || key == 36 || key == 37 || key == 39)
        if($.inArray(key,ar) > -1) {
            e.preventDefault();
            return false;
        }
        return true;
    });
});