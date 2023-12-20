var limite = 9;
var rows = [];
var row1 = [];
var states = [];
var state = [];
var CBack = "rgb(218, 218, 218)"; //hasta  aca son los necesarios para boardcreator
var CHigh = "rgb(242, 218, 150)";
var turno = 0;
const imgX = 'url("img/X.png")';
const imgXh = 'url("img/Xh.png")';
const imgO = 'url("img/O.png")';
const imgOh = 'url("img/Oh.png")';
const imgXred = 'url("img/Xred.png")';
const imgOred = 'url("img/Ored.png")';
var cubesState = [];
var cubesPosition = [];
var Rdeg = "rotate(0deg)";
var Rleft = "50%";
var Rtop = "50%";
var lastMove = [-1];
var turnoSP;
var moves = [];
var bloqueo = 0;
//-------------------------------------------------------------------------
function start(a) {
    boardcreator();
    if (a == 0) {
        manageMonteCarlo(-1)
    }
    turnoSP = a;
    document.getElementById("zone").style.display = "none";
}

function back() {
    board.innerHTML =
        '    <button id="button" onclick="back();">BACK</button>' +
        '        <button id="restart" onclick="restart();">RESTART</button>' +
        '        <div id="zone" class="zone">' +
        '            <p id="question">QUIEN ARRANCA?</p>' +
        '            <button id="vos" onclick="start(1)">Human</button>' +
        '            <button id="maquina" onclick="start(0)">SuperPlayer</button>' +
        '            <button id="HvsH" onclick="start(2)">HUMANO vs HUMANO</button>' +
        '        </div>'
    zone.style.display = "none"
    rows = [];
    states = [];
    cubesState = [];
    lastMove = [-1];
    cubesPosition = [];
    let saveSp = turnoSP
    turnoSP = 10;
    turno = 0;
    moves.pop()
    moves.pop()
    moves.pop()
    moves.pop()
    moves.pop()
    moves.pop()
    boardcreator();
    for (let i = 0; i < (moves.length) - 1; i += 2) {
        manager(moves[i], moves[i + 1])
        moves.pop()
        moves.pop()
    }
    if (moves.length == 0 && saveSp == 0) {
        manageMonteCarlo(-1)
    }
    turnoSP = saveSp
}

function restart() {
    moves = []
    back()
}

function boardcreator() {
    for (var f7 = 0; f7 < limite; f7++) {
        rows.push(row1);
        states.push(state);
        cubesState.push(0);
        document.getElementById("board").insertAdjacentHTML("beforeend",
            "<div id=" + '"cube' + f7 + '"' + " class=" + '"' + "cube" + '"' + ');"></div>');
        var cubeS = document.getElementById("cube" + f7).style;
        cubeS.position = "absolute";
        cubeS.backgroundPosition = "center";
        cubeS.backgroundSize = "contain";
        cubeS.backgroundRepeat = "no-repeat";
        cubeS.display = "none";
        cubeS.height = ((100 - 3) / 3) + "%";
        cubeS.width = ((100 - 3) / 3) + "%";
        cubeS.left = ((((100 - 3) / 3) * (f7 % 3)) + (0.5 * ((f7 % 3) + 1)) + (f7 % 3) / 2) + "%"
        cubeS.top = ((((100 - 3) / 3) * (Math.floor(f7 / 3))) + (0.5 * (Math.floor(f7 / 3) + 1)) + (Math.floor(f7 / 3)) / 2) + "%";
        cubesPosition.push(document.getElementById("cube" + f7));
        for (var f8 = 0; f8 < limite; f8++) {
            document.getElementById("board").insertAdjacentHTML("afterbegin",
                "<div id=" + '"' + f7 + "/" + f8 + '"' + " class=" + '"' + "cell" + '"' + " onclick= " + '"manager(' + f7 + "," + f8 + ');"></div>');
            var cell = document.getElementById(f7 + "/" + f8);
            var cellS = document.getElementById(f7 + "/" + f8).style;
            cellS.position = "absolute";
            cellS.backgroundColor = CHigh;
            cellS.height = ((100 - 0.5 * (limite - 1) - 2.2) / limite) + "%";
            cellS.width = ((100 - 0.5 * (limite - 1) - 2.2) / limite) + "%";
            cellS.left = ((((100 - 0.5 * (limite - 1) - 2.2) / limite) * (f8 % 3)) + (((100 - 0.5 * (limite - 1) - 2.2) / limite) *
                ((f7 % 3) * 3)) + (0.5 * ((f8 % 3) + 1)) + (0.5 * (f7 % 3 * 3)) + (f7 % 3) / 2) + "%"
            cellS.top = ((((100 - 0.5 * (limite - 1) - 2.2) / limite) * (Math.floor(f8 / 3))) + (((100 - 0.5 * (limite - 1) - 2.2) / limite) *
                ((Math.floor(f7 / 3)) * 3)) + (0.5 * ((Math.floor(f8 / 3)) + 1)) + (0.5 * (Math.floor(f7 / 3) * 3)) + (Math.floor(f7 / 3)) / 2) + "%";
            cell.onmouseover = function () {
                var ChAt0 = parseInt(this.id.charAt(0));
                var ChAt2 = parseInt(this.id.charAt(2));
                if (turno % 2 == 0 && states[ChAt0][ChAt2] == 0 && highlighted(ChAt0, ChAt2) == true) {
                    this.style.backgroundImage = imgXh;
                }
                if (turno % 2 == 1 && states[ChAt0][ChAt2] == 0 && highlighted(ChAt0, ChAt2) == true) {
                    this.style.backgroundImage = imgOh;
                }
            };
            cell.onmouseout = function () {
                if ((this.style.backgroundImage == imgOh || this.style.backgroundImage == imgXh) &&
                    cubesState[parseInt(this.id.charAt(0))] == 0 && !bloqueo) {
                    this.style.backgroundImage = "none";
                }
            };

            cellS.backgroundPosition = "center";
            cellS.backgroundSize = "contain";
            cellS.backgroundRepeat = "no-repeat";
            rows[f7].push(cell);
            states[f7].push(0);
        }
        state = [];
        row1 = [];
    }

}

function highlight(B3) {
    for (f1 = 0; f1 < 9; f1++) {
        for (f2 = 0; f2 < 9; f2++) {
            rows[f1][f2].style.backgroundColor = CBack;
        }
    }
    if (cubesState[B3] == 0 && checkfull(B3) == false) {
        for (f3 = 0; f3 < 9; f3++) {
            if (states[B3][f3] == 0) {
                rows[B3][f3].style.backgroundColor = CHigh;
            }
        }
    } else {
        for (f5 = 0; f5 < 9; f5++) {
            for (f6 = 0; f6 < 9; f6++) {
                if (cubesState[f5] == 0 && states[f5][f6] == 0 && checkfull(f5) == false)
                    rows[f5][f6].style.backgroundColor = CHigh;
            }
        }

    }
}

function checkfull(A6) {
    var flag1 = 0;
    for (f9 = 0; f9 < 9; f9++) {
        if (states[A6][f9] != 0) {
            flag1++;
        }
    }
    if (flag1 == 9) {
        cubesState[A6] = 1;
        cubesPosition[A6].style.display = "block";
        return true;
    } else {
        return false;
    }
}

function highlighted(A2, B2) {
    if (rows[A2][B2].style.backgroundColor == CHigh) {
        return true;
    } else {
        return false;
    }
}

function manager(A1, B1) {
    if (states[A1][B1] == 0 && highlighted(A1, B1) == true) {
        moves.push(A1)
        moves.push(B1)
        rows[A1][B1].style.backgroundColor = CBack;
        if (turno % 2 == 0) {
            rows[A1][B1].style.backgroundImage = imgXred;
            states[A1][B1] = 10;
        } else {
            rows[A1][B1].style.backgroundImage = imgOred;
            states[A1][B1] = 100;
        }
        if (lastMove[0] != -1) {
            if (states[lastMove[0]][lastMove[1]] == 10) {
                rows[lastMove[0]][lastMove[1]].style.backgroundImage = imgX;
            } else {
                rows[lastMove[0]][lastMove[1]].style.backgroundImage = imgO;
            }
        }
        lastMove = [A1, B1]
        turno += 1;
        Cubetatuado(A1);
        highlight(B1);
        winner();
        if (!bloqueo) {
            if (turno % 2 == turnoSP) {
                manageMonteCarlo(B1, A1);
            }
        }
    }
}

function Cubetatuado(A5) { //checks if a cube was tictactoed or not
    if (TaTeTi(states[A5]) != 0) {
        for (f4 = 0; f4 < 9; f4++) {
            if (rows[A5][f4].style.backgroundImage == imgX) {
                rows[A5][f4].style.backgroundImage = imgXh
            }
            if (rows[A5][f4].style.backgroundImage == imgO) {
                rows[A5][f4].style.backgroundImage = imgOh
            }
        }
        cubesState[A5] = TaTeTi(states[A5]) / 3;
        if (cubesState[A5] == 10) {
            cubesPosition[A5].style.backgroundImage = imgX;
            cubesPosition[A5].style.display = "block";
        }
        if (cubesState[A5] == 100) {
            cubesPosition[A5].style.backgroundImage = imgO;
            cubesPosition[A5].style.display = "block";
        }
    }

}

function winner() {
    document.getElementById("board").insertAdjacentHTML("beforeend",
        "<div id= 'rayita'></div>");
    document.getElementById("board").insertAdjacentHTML("beforeend",
        "<div id= 'winnerNotice'></div>");

    var ganador = TaTeTi(cubesState);
    if (tie(cubesState) && !ganador) {
        bloqueo = 1;
        alert("PARTIDO EMPATADO")
    }
    if ((ganador == 300 || ganador == 30) && document.getElementById('winnerNotice').style.display == "") {
        bloqueo = 1;
        document.getElementById('rayita').style.top = Rtop;
        document.getElementById('rayita').style.left = Rleft;
        document.getElementById('rayita').style.transform = Rdeg;
        document.getElementById('rayita').style.display = "block";
        document.getElementById('winnerNotice').style.display = "block";
        if (ganador == 30) {
            document.getElementById('winnerNotice').style.backgroundImage = 'url("img/CrW.png")';
        } else {
            document.getElementById('winnerNotice').style.backgroundImage = 'url("img/CiW.png")';
        }
        if (turno % 2 == turnoSP) {
            alert("FELICITACIONES te ganaste un chocolate")
        } else {
            alert("GANO EL SUPER-PLAYER")
        }
        for (f1 = 0; f1 < 9; f1++) {
            for (f2 = 0; f2 < 9; f2++) {
                rows[f1][f2].style.backgroundColor = CBack;
                if (rows[f1][f2].style.backgroundImage == imgX) {
                    rows[f1][f2].style.backgroundImage = imgXh
                }
                if (rows[f1][f2].style.backgroundImage == imgO) {
                    rows[f1][f2].style.backgroundImage = imgOh
                }
            }
        }
    }
}

function TaTeTi(A4) {
    var flag = 0;
    if (A4[0] + A4[1] + A4[2] == 30 || A4[0] + A4[1] + A4[2] == 300) {
        flag = A4[0] + A4[1] + A4[2];
        Rtop = "16.666666666666666666667%";
        Rleft = "50%";
        Rdeg = "rotate(0deg)";
    } else if (A4[3] + A4[4] + A4[5] == 30 || A4[3] + A4[4] + A4[5] == 300) {
        flag = A4[3] + A4[4] + A4[5];
        Rtop = "50%";
        Rleft = "50%";
        Rdeg = "rotate(0deg)"
    } else if (A4[6] + A4[7] + A4[8] == 30 || A4[6] + A4[7] + A4[8] == 300) {
        flag = A4[6] + A4[7] + A4[8];
        Rtop = "83.3333333333333333333333%";
        Rleft = "50%";
        Rdeg = "rotate(0deg)"
    } else if (A4[0] + A4[3] + A4[6] == 30 || A4[0] + A4[3] + A4[6] == 300) {
        flag = A4[0] + A4[3] + A4[6];
        Rtop = "50%";
        Rleft = "16.666666666666666666667%";
        Rdeg = "rotate(90deg)"
    } else if (A4[1] + A4[4] + A4[7] == 30 || A4[1] + A4[4] + A4[7] == 300) {
        flag = A4[1] + A4[4] + A4[7];
        Rtop = "50%";
        Rleft = "50%";
        Rdeg = "rotate(90deg)"
    } else if (A4[2] + A4[5] + A4[8] == 30 || A4[2] + A4[5] + A4[8] == 300) {
        flag = A4[2] + A4[5] + A4[8];
        Rtop = "50%";
        Rleft = "83.3333333333333333333333%";
        Rdeg = "rotate(90deg)"
    } else if (A4[0] + A4[4] + A4[8] == 30 || A4[0] + A4[4] + A4[8] == 300) {
        flag = A4[0] + A4[4] + A4[8];
        Rtop = "50%";
        Rleft = "50%";
        Rdeg = "rotate(45deg)"
    } else if (A4[6] + A4[4] + A4[2] == 30 || A4[6] + A4[4] + A4[2] == 300) {
        flag = A4[6] + A4[4] + A4[2];
        Rtop = "50%";
        Rleft = "50%";
        Rdeg = "rotate(135deg)"
    }
    return flag;
}
//------------------------------------------------------------------------- 
document.oncontextmenu = new Function("return false;");