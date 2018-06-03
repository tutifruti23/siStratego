var gra;
$(function(){
    $("#startNewGame").on("click",function(){
        var $size=document.getElementById("size").value;
        var depth=document.getElementById("depth").value;
        var isMinMax=document.getElementById("minMax").value;
        var eval=document.getElementById("eval").value
        var depth1=document.getElementById("depth1").value;
        var isMinMax1=document.getElementById("minMax1").value;
        var eval1=document.getElementById("eval1").value
        var rodzaj=document.getElementById("rodzaj").value;
        var doIlu=document.getElementById("doIlu").value;
        gra=new Game($size);
        gra.doIlu=doIlu;
        gra.rodzaj=rodzaj;

        gra.allPoints=4*$size*$size-4;
        gra.engine0.depth=depth;
        gra.engine0.isMinMax=isMinMax;
        gra.engine0.eval=eval;
        gra.engine1.depth=depth1;
        gra.engine1.isMinMax=isMinMax1;
        gra.engine1.eval=eval1;
        gra.initBoard();
        gra.initGame();
        gra.load();
    });
});
function Engine(d,e,imm){
    this.depth=d;
    this.eval=e;
    this.isMinMax=imm;
}
function Game(size){
    this.score0=0;
    this.score1=0;
    this.rodzaj=0;
    this.doIlu=5;
    this.pts0=0;
    this.pts1=0;
    this.size=size;
    this.allPoints=32;
    this.turn=0;
    this.player=0;
    this.position={};
    this.engine0=new Engine(0,0,0);
    this.engine1=new Engine(0,0,0);
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
        if(this.rodzaj==2){
            //this.compMove(this.engine0);
        }
    };
    this.nextGame=function(){
      this.pts0=0;
      this.pts1=0;
      this.turn=0;
      this.initBoard();
      this.initGame();
      this.load();
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
            if(this.pts0+this.pts1<this.allPoints){
                 if(this.rodzaj==0){
                     if(this.turn!=this.player){
                         this.compMove(this.engine0);

                     }
                 }
                 else if(this.rodzaj==1){
                     this.player=this.turn;
                 }
                 else{
                    if(this.turn==0){
                        this.compMove(this.engine0);
                    }else {
                        this.compMove(this.engine1);

                    }
                 }
            }
            else{
                 if(this.pts0>this.pts1)
                     this.score0++;
                 else if(this.pts1>this.pts0)
                     this.score1++;


                 if(this.score0<this.doIlu&&this.score1<this.doIlu)
                    this.nextGame();
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
        $("#pts0").html(handle.pts0);
        $("#pts1").html(handle.pts1);
        $("#score0").html(handle.score0);
        $("#score1").html(handle.score1);
    }
    this.compMove=function(engine){
        var handle=this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handle.move(this.responseText);
                handle.load();
            }
        };
        xhttp.open("GET", "/compMove?position="+handle.positionToString()+"&pts1="+handle.pts0+"&pts2="+handle.pts1+"&eval="+engine.eval+"&isMinMax="+engine.isMinMax+"&depth="+engine.depth+"&size="+handle.size+"&turn="+handle.turn, true);
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






