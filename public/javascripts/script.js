$(function(){
    $("#startNewGame").on("click",function(){
        var $size=document.getElementById("size").value;
        var depth=document.getElementById("depth").value;
        var isMinMax=document.getElementById("minMax").value;
        var eval=document.getElementById("eval").value
        var gra=new Game($size);
        gra.initBoard();
        gra.depth=depth;
        gra.isMinMax=isMinMax;
        gra.eval=eval;
        gra.initGame();
        gra.load();

    });


});
function Game(size){
    this.pts0=0;
    this.pts1=0;
    this.size=size;
    this.turn=0;
    this.player=0;
    this.position={};
    this.eval=0;
    this.depth=5;
    this.isMinMax=0;
    this.analisis=0;
    this.initBoard=function(){
        for(var i=0;i<size*size;i++){
            this.position[i]=0;
        }
        var $table=$("#board");
        $table.html("");
        for(var i=0;i<this.size;i++) {
            $table.append("<tr>");
            for (var j = 0; j < this.size; j++) {
                $table.append("<td class='square'></td>")
            }
            $table.append("</tr>");
        }
    };
    this.initGame=function () {
        var handle=this;
        $(".square").each(function(index){
            $(this).on("click",function(){
                if(true){
                    handle.move(index);
                    handle.load();
                }
            });
        });
    };
    this.move=function(move) {
        size=parseInt(this.size);
        move=parseInt(move);
        if (this.position[move] == 0) {
            this.position[move]=1;
             var liczbaPunktow=0;
             var full=true;
             for(var i=move%size;i<size*size;i=i+size){
                 if(this.position[i]==0){
                     full=false;
                 }

             }
             if(full){
                 liczbaPunktow=size+liczbaPunktow;
             }
             full=true;
             for(var i=parseInt(move/size)*size;i<parseInt(move/size)*size+size;i++){
                 if(this.position[i]==0){
                     full=false;
                 }

             }

             if(full){
                 liczbaPunktow=size+liczbaPunktow;
             }
             //przekatne w pierwsza strone
             full=true;
             var licznik=-1;
             for(var i=move;i<size*size;i=i+(size+1)){
                 if (this.position[i] != 0) {
                     licznik++;
                 }
                 else {
                     full=false;
                     break;
                 }
                 if(i%size==size-1){
                     break;
                 }
             }
             if(full){
                 for(var i=move;i>=0;i=i-(size+1)) {
                     if (this.position[i] == 1) {
                         licznik++;
                     }
                     else {
                         full=false;
                         break;
                     }
                     if (i % size == 0) {
                         break;
                     }
                 }
             }
             if(full&&licznik>1){
                 liczbaPunktow=licznik+liczbaPunktow;
             }
             //przekatne w druga strone
             full=true;
             var licznik=-1;
             for(var i=move;i<size*size;i=i+(size-1)){
                 if (this.position[i] == 1) {
                     licznik++;

                 }
                 else {
                     full=false;
                     break;
                 }
                 if(i%size==0){
                     break;
                 }
             }
             if(full){
                 for(var i=move;i>=0;i=i-(size-1)){
                     if (this.position[i] == 1) {
                         licznik++;
                     }
                     else {
                         full=false;
                         break;
                     }

                     if(i%size==size-1){
                         break;
                     }
                 }
             }

             if(full&&licznik>1){
                 liczbaPunktow=licznik+liczbaPunktow;
             }
            //dodanie punktow
            if(this.turn==0){

                this.pts0+=liczbaPunktow;
                this.turn=1;
            }
            else{
                this.pts1+=liczbaPunktow;
                this.turn=0;
            }
            if(this.turn!=this.player){
                this.compMove();

            }
        }
    };
    this.load=function(){
        var handle=this;
        $(".square").each(function(i){
            if(handle.position[i]==0){
                $(this).html('');
            }
            else if(handle.position[i]==1) {
                $(this).css("background","gray");
            }
        });
        $("#pts0").html("").html(handle.pts0);
        $("#pts1").html("").html(handle.pts1);
    }
    this.compMove=function(){
        var handle=this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handle.move(this.responseText);
                handle.load();
            }
        };
        xhttp.open("GET", "/compMove?position="+handle.positionToString()+"&eval="+handle.eval+"&isMinMax="+handle.isMinMax+"&depth="+handle.depth+"&size="+handle.size+"&turn="+handle.turn, true);
        xhttp.send();
    };
    this.positionToString=function(){
       var str="";
        for(var i=0;i<this.size*this.size;i++){
            str+=this.position[i];

       }
       return str;

    }
}






