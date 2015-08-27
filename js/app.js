/**
 * Created by carlos on 24/08/15.
 */

var app = angular.module('simonGame',[]);



app.controller('SimonCtrl',['$log','$timeout', function ($log,$timeout) {

    // MENSAJES CPN $log


    var game = this;
    game.count = 0;
    game.colors = [false,false,false,false];
    game.road = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    game.All = true;
    game.playerCombinations = [];
    game.movimientosPermitidos = 0;
    game.simon = [];
    game.last = 0;
    game.timer_is_on = 0;
    game.counter = 0;
    game.temp1 = 900;
    game.audio = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3','https://s3.amazonaws.com/freecodecamp/simonSound2.mp3','https://s3.amazonaws.com/freecodecamp/simonSound3.mp3','https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'];
    game.contador = 0;
    game.ft = true;
    game.i = 1;
    game.error = "";
    game.pass = true;

    game.makeRandom = function () {
        return Math.floor((Math.random() * 4) + 0);
    };

    game.changeTempo = function (turno) {
        if (turno == 5) {
            game.temp1 = 700;
        } else if (turno == 9){
            game.temp1 = 500;
        } else if (turno == 13){
            game.temp1 = 300;
        }
    };


    game.play = function () {
        if (game.ft) {
            game.last = game.simon[game.j];
            game.setColor(game.last);
            game.ft = false;
            document.getElementById("audio").src=game.audio[game.last];
        } else {
            game.j = game.j +1;
            game.removeColor(game.last);
            game.ft = true;
        }
        if (game.j >= game.simon.length) {

            game.last = game.makeRandom();
            game.simon.push(game.last);
            game.setColor(game.last);
            document.getElementById("audio").src=game.audio[game.last];
            game.ft = false;
            game.j = -1;
            game.stop();

        }else {
            game.t = $timeout(game.play,game.temp1);
        }

    };

    game.removeColorTimeOut = function () {
        if (!game.ft) {
            game.removeColor(game.last);
            game.last = null;
        }
    };

    game.reset = function () {
        game.stop();
        game.All = true;
        game.playerCombinations = [];
        game.movimientosPermitidos = 0;
        game.simon = [];
        game.last = 0;
        game.timer_is_on = 0;
        game.temp1 = 900;
        game.ft = true;
        game.i = 1;
        game.error = "";
        game.pass = true;
    };

    game.setColor = function (index) {
        game.colors[index] = true;
    };

    game.removeColor = function (index) {
        game.colors[index] = false;
    };


    game.move = function (pos) {
        console.log(pos == game.simon[game.j + 1]);
        if (pos == game.simon[game.j + 1]){
            game.j = game.j + 1;
            if(game.j === game.movimientosPermitidos - 1){
                game.All = true;
                game.j = -1;
                game.error = "";
                game.changeTempo(game.movimientosPermitidos);
                game.over();

            }
        } else {
            game.All = true;
            game.j = -1;
            game.pass = true;
            game.error = "Error OBEDECE A SIMON";
            game.replay();
        }

    };

    this.start = function () {
        game.startCount();
    };

    game.j = -1;

    game.replay = function () {

        if (game.ft) {
            game.last = game.simon[game.j];
            game.setColor(game.last);
            game.ft = false;
            document.getElementById("audio").src = game.audio[game.last];
        } else {
            game.j = game.j +1;
            game.removeColor(game.last);
            game.ft = true;
        }

        if (game.j >= game.simon.length) {
            game.stop();
            game.j = -1;
        }else {
            game.t = $timeout(game.replay,game.temp1);
        }

    };

    game.startCount = function () {
        if (!game.timer_is_on) {
            game.timer_is_on = 1;
            game.play();
        }else{
            game.stop();
        }
    };


    game.stop = function(){
        $timeout.cancel(game.t);
        game.timer_is_on = 0;
        $timeout(game.removeColorTimeOut,game.temp1);
        game.movimientosPermitidos = game.simon.length;
        game.All = false;

    };

    game.over = function () {
      if (game.movimientosPermitidos === 20){
          game.pass = false;
          game.error = "Felicidades terminaste el juego";
      } else{
          game.play();
      }
    };

}]);