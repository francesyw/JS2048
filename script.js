$(document).ready(function(){
    var noMoves = false;
    var moved = true;
    var originalTiles = [];
    for (i = 0; i < 16; i++) {
        originalTiles.push(i);
    }
    var emptyTiles = originalTiles.slice();
    // console.log("old: " + originalTiles);
    newTile(); 
    newTile();
       

    function newTile() {
        var tile = emptyTiles[Math.floor((Math.random() * emptyTiles.length))];
        var row = Math.floor(tile/4);
        var col = tile % 4;              
        $('.tile-container').append('<div id = "added" class="tile tile-2 grid-'+row+'-'+col+'"><div class="tile-value"></div></div>');  
        $('#added').css('opacity', '0');
        $('#added').fadeTo(500,1,function(){})
        $('#added').attr('id','');      
        gameInit();

        // check available tiles 
        var tileNum = $('.tile').length;
        // console.log("number of tiles: " + tileNum + " | position: " + row + "-" + col + " | index: " + tile);
        emptyTiles.splice( $.inArray(tile, emptyTiles), 1 );  
        // console.log("empty tiles: " + emptyTiles);
        // console.log("-----------------");      
        
    }

    function gameInit() {        
        for (var i = 2; i <= 2048; i *= 2) {
            $('div.tile-'+i).find($('div.tile-value')).html(i);                 
        }        
    }

    // key events
    $(document).keydown(function(e){
        moved = false;
        switch(e.which) {

            case 37: // left
            emptyTiles = originalTiles.slice();
            for (var col = 0; col <=3; col++) {
                for (var row = 0; row <= 3; row++) {

                    $targetPos = 'grid-'+row+'-'+col;
                    $targetVal = $('div.grid-'+row+'-'+col).find($('div.tile-value')).html();

                    if ($('.tile').hasClass($targetPos)) {

                        var moveTile = moveLeft(row, col, $targetVal);
                        $destPos = moveTile.destination;
                        $destVal = 'tile-' + moveTile.tileVal;

                        $('.tile.'+$targetPos).removeClass($targetPos).addClass($destPos);
                        $('.tile.'+$destPos).removeClass('tile-'+$targetVal).addClass($destVal);
                        gameInit();

                    }
                }
            }            
            break;

            case 38: // up
            emptyTiles = originalTiles.slice(); // initialize the array                 
            for (var row = 0; row <=3; row++) {
                for (var col = 0; col <= 3; col++) {

                    $targetPos = 'grid-'+row+'-'+col;                    

                    if ($('.tile').hasClass($targetPos)) {
                        $targetVal = $('div.grid-'+row+'-'+col).find($('div.tile-value')).html();
                        var moveTile = moveUp(row, col, $targetVal);
                        $destPos = moveTile.destination;
                        $destVal = 'tile-' + moveTile.tileVal;

                        $('.tile.'+$targetPos).removeClass($targetPos).addClass($destPos);
                        $('.tile.'+$destPos).removeClass('tile-'+$targetVal).addClass($destVal);
                        gameInit();

                    }
                }
            } 
            break;

            // right
            case 39: 
            emptyTiles = originalTiles.slice();
            for (var col = 3; col >=0; col--) {
                for (var row = 0; row <= 3; row++) {

                    $targetPos = 'grid-'+row+'-'+col;
                    $targetVal = $('div.grid-'+row+'-'+col).find($('div.tile-value')).html();

                    if ($('.tile').hasClass($targetPos)) {

                        var moveTile = moveRight(row, col, $targetVal);
                        $destPos = moveTile.destination;
                        $destVal = 'tile-' + moveTile.tileVal;

                        $('.tile.'+$targetPos).removeClass($targetPos).addClass($destPos);
                        $('.tile.'+$destPos).removeClass('tile-'+$targetVal).addClass($destVal);
                        gameInit();

                    }
                }
            }                        
            break;

            // down 
            case 40:              
            if (!noMoves) {
                emptyTiles = originalTiles.slice(); // initialize the array                 
                for (var row = 3; row >=0; row--) {
                    for (var col = 0; col <= 3; col++) {

                        $targetPos = 'grid-'+row+'-'+col;                    

                        if ($('.tile').hasClass($targetPos)) {
                            $targetVal = $('div.grid-'+row+'-'+col).find($('div.tile-value')).html();
                            var moveTile = moveDown(row, col, $targetVal);
                            $destPos = moveTile.destination;
                            $destVal = 'tile-' + moveTile.tileVal;

                            $('.tile.'+$targetPos).removeClass($targetPos).addClass($destPos);
                            $('.tile.'+$destPos).removeClass('tile-'+$targetVal).addClass($destVal);
                            gameInit();

                        }
                    }
                }                
                         
            }  

            break;

            default: return;
        }
        // check if any moves left; 1) if no moves - no new tile; 2) if any tiles move - newTile();
        if (moved) {
            newTile();
        }        
        // $('<div class="tile tile-2 grid-1-0"></div>').hide().appendTo('body').fadeIn(500);               
    })
       

    function moveDown(row, col, $tileVal) { 
        // the position of the tile before moving
        var bfMoveRow = row;              

        while (row < 3) {        
            row++;
            $obstacle = 'grid-'+row+'-'+col;
            if ($('.tile').hasClass($obstacle)) {            
                // compare tile;
                $obstVal = $('div.'+$obstacle).find($('div.tile-value')).html();
                if ($tileVal == $obstVal) {
                    // mergeTile();
                    $('.'+$obstacle).remove()
                    $tileVal *= 2;
                    break;                
                } else {
                    row--;                                       
                    break;
                }
            }
        }
        if (bfMoveRow !== row) { moved = true };        

        // remove the new destination from the emptyTiles array
        var index = row * 4 + col;
        emptyTiles.splice( $.inArray(index, emptyTiles), 1 ); 
        // console.log("after move: " + emptyTiles);

        $destination = 'grid-' + row + '-' + col;       
        return {
            destination: $destination,
            tileVal: $tileVal
        };
    }

    function moveUp(row, col, $tileVal) { 
        // the position of the tile before moving
        var bfMoveRow = row;              

        while (row > 0) {        
            row--;
            $obstacle = 'grid-'+row+'-'+col;
            if ($('.tile').hasClass($obstacle)) {            
                // compare tile;
                $obstVal = $('div.'+$obstacle).find($('div.tile-value')).html();
                if ($tileVal == $obstVal) {
                    // mergeTile();
                    $('.'+$obstacle).remove()
                    $tileVal *= 2;
                    break;                
                } else {
                    row++;                                       
                    break;
                }
            }
        }
        if (bfMoveRow !== row) { moved = true };                
        var index = row * 4 + col;
        emptyTiles.splice( $.inArray(index, emptyTiles), 1 );         
        $destination = 'grid-' + row + '-' + col;       
        return {
            destination: $destination,
            tileVal: $tileVal
        };
    }

    function moveRight(row, col, $tileVal) {  
        var bfMoveCol = col;   
        while (col < 3) {        
            col++;
            $obstacle = 'grid-'+row+'-'+col;
            if ($('.tile').hasClass($obstacle)) {            
                // compare tile;
                $obstVal = $('div.'+$obstacle).find($('div.tile-value')).html();
                if ($tileVal == $obstVal) {
                    // mergeTile();
                    $('.'+$obstacle).remove()
                    $tileVal *= 2;     
                    break;           
                } else {
                    col--;
                    break;
                }
            }
        }
        if (bfMoveCol !== col) { moved = true }; 
        var index = row * 4 + col;
        emptyTiles.splice( $.inArray(index, emptyTiles), 1 );         
        $destination = 'grid-' + row + '-' + col;       
        return {
            destination: $destination,
            tileVal: $tileVal
        };
    }

    function moveLeft(row, col, $tileVal) {
        var bfMoveCol = col;    
        while (col > 0) {        
            col--;
            $obstacle = 'grid-'+row+'-'+col;
            if ($('.tile').hasClass($obstacle)) {            
                // compare tile;
                $obstVal = $('div.'+$obstacle).find($('div.tile-value')).html();
                if ($tileVal == $obstVal) {
                    // mergeTile();
                    $('.'+$obstacle).remove()
                    $tileVal *= 2; 
                    break;               
                } else {
                    col++;
                    break;
                }
            }
        }
        if (bfMoveCol !== col) { moved = true }; 
        var index = row * 4 + col;
        emptyTiles.splice( $.inArray(index, emptyTiles), 1 );         
        $destination = 'grid-' + row + '-' + col;       
        return {
            destination: $destination,
            tileVal: $tileVal
        };
    }

/*
// TODO: to replace the repetitive code later... 
    // function keyMove(dirA, dirB) {
    //     for (var dirA = 3; dirA >=0; dirA--) {
    //         for (var dirB = 0; dirB <= 3; dirB++) {

    //             $targetPos = 'grid-'+row+'-'+col;
    //             $targetVal = $('div.grid-'+row+'-'+col).find($('div.tile-value')).html();

    //             if ($('.tile').hasClass($targetPos)) {

    //                 var moveTile = moveDown(dirA, dirB, $targetVal); //TODO: tileMove()
    //                 $destPos = moveTile.destination;
    //                 $destVal = 'tile-' + moveTile.tileVal;

    //                 $('.tile.'+$targetPos).removeClass($targetPos).addClass($destPos);
    //                 $('.tile.'+$destPos).removeClass('tile-'+$targetVal).addClass($destVal);
    //                 gameInit();

    //             }
    //         }
    //     }
    // }

    // TODO: to replace the repetitive code later...
    // function tileMove(dirA, dirB, $tileVal) {
    //     while (dirA < 3) {        
    //         dirA++;
    //         $obstacle = 'grid-'+row+'-'+col;
    //         if ($('.tile').hasClass($obstacle)) {            
    //             // compare tile;
    //             $obstVal = $('div.'+$obstacle).find($('div.tile-value')).html();
    //             if ($tileVal == $obstVal) {
    //                 // mergeTile();
    //                 $('.'+$obstacle).remove()
    //                 $tileVal *= 2;                
    //             } else {
    //                 dirA--;
    //                 break;
    //             }
    //         }
    //     }
    //     $destination = 'grid-' + row + '-' + col;       
    //     return {
    //         destination: $destination,
    //         tileVal: $tileVal
    //     };
    // }
*/

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