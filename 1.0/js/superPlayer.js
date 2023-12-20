function superPlayer(cubeInt) {
    bloqueo = 1;
    //console.clear();
    let ofWho = 10 + 90 * (turno % 2);
    let jugada = [0, 0, -501];
    //--------------------------
    if (cubesState[cubeInt] != 0 || cubeInt == -1) {
        for (let i = 0; i < limite; i++) {
            if (cubesState[i] == 0) {
                let save = valueBoard(i, ofWho, 0);
                if (save[2] > jugada[2]) {
                    jugada = save;
                }
            }
        }
    } else {
        jugada = valueBoard(cubeInt, ofWho, 0);

    }


    if (TaTeTi(cubesState) == 0) {
        bloqueo = 0;
        manager(jugada[0], jugada[1]);
        // console.log("----------------------------")
        // console.log("============================")
        // console.log('jugada:', jugada)
        // console.log("============================")
    }
}
const maxRecursion = 4;

function valueBoard(cubeInt, ofWho, recursion) {
    if (turno == 0) {
        return [4, 6, 0]
    }
    var highest = -1001;
    let notWho = 100 - 90 * (Math.floor(ofWho / 100))
    let whoFloor = Math.floor((ofWho) / 100)
    let notWhoFloor = Math.floor((notWho) / 100)
    var myMatchPoint = winningCube(whoFloor)[0]
    var yourMatchPoint = winningCube(notWho)[0]
    var move = -1;
    var duoI = duo(states[cubeInt]);
    var duoCubesI = duo(cubesState);
    let remaining = easyttt(cubeInt, ofWho);
    //-----------------------------------------------
    for (let i = 0; i < limite; i++) {
        var value = 0;
        if (states[cubeInt][i] == 0) { // chequea que la posicion no este ya ocupada
            states[cubeInt][i] = ofWho; // reemplaza la casilla libre por ofWho
            if (TaTeTi(states[cubeInt]) != 0) { // si al reemplazar la casilla se hace tateti en el cubo
                cubesState[cubeInt] = ofWho; //remplaza el estado del cubo por ofWho
            }
            //------------------------------------------------------------------- 

            if (cubeInt % 2 == 1) { //
                value += 0; //
            } else if (cubeInt != 4) { // asigna un valor a cada posicion del tablero
                value += 1.5; // aristas valen mas esquinas menos y centro todavia menos
            } else { //
                value += 2.5; //
            }
            //
            if (i % 2 == cubeInt % 2) {
                value += 2;
            }

            value += isPositionGood(i, notWhoFloor)
            value -= isPositionGood(cubeInt, notWhoFloor)
            value -= domination(i)[whoFloor] * 0.6
            value -= domination(i)[notWhoFloor] * 1.2
            //

            let saveCubeIntState = cubesState[cubeInt];
            let actualRemaining = easyttt(cubeInt, ofWho)
            value += (remaining - actualRemaining) * 5
            cubesState[cubeInt] = ofWho;
            if (TaTeTi(cubesState) != 0) {
                if (goodDuo(-1, duoCubesI, duo(cubesState), ofWho) < 0.5) {
                    value += (remaining - actualRemaining) * 5 
                    value += (duo(states[cubeInt])[0][whoFloor] - duoI[0][whoFloor]) * 6 //sino se hizo tateti suma 3 puntos
                    if (duo(states[cubeInt])[0][notWhoFloor] - duoI[0][notWhoFloor] < 0) {
                        value += 8
                    }
                    value += 30;
                }
            } else if (saveCubeIntState == 0 && goodDuo(-1, duoCubesI, duo(cubesState), ofWho) < 0.5) {
                let masDuos = ((duo(cubesState)[0][whoFloor] - duoCubesI[0][whoFloor]))
                switch (masDuos) {
                    case 0:
                        value += (duo(states[cubeInt])[0][whoFloor] - duoI[0][whoFloor]) * 4 //sino se hizo tateti suma 3 puntos
                        if (duo(states[cubeInt])[0][notWhoFloor] - duoI[0][notWhoFloor] < 0) {
                            value += 6
                        }
                        value -= goodDuo(cubeInt, duoI) * 4
                        break;
                    case 1:
                        value += (duo(states[cubeInt])[0][whoFloor] - duoI[0][whoFloor]) * 5 //sino se hizo tateti suma 3 puntos
                        if (duo(states[cubeInt])[0][notWhoFloor] - duoI[0][notWhoFloor] < 0) {
                            value += 6
                        }
                        value -= goodDuo(cubeInt, duoI) * 5
                        value += 4
                        break;
                    case 2:
                    case 3:
                        value += (duo(states[cubeInt])[0][whoFloor] - duoI[0][whoFloor]) * 5 //sino se hizo tateti suma 3 puntos
                        if (duo(states[cubeInt])[0][notWhoFloor] - duoI[0][notWhoFloor] < 0) {
                            value += 6
                        }
                        value -= goodDuo(cubeInt, duoI) * 5
                        value += 4
                        break;
                }
            }

            cubesState[cubeInt] = saveCubeIntState;
            cubesState[cubeInt] = notWho;
            if (TaTeTi(cubesState) != 0) {
                value += 30;

            } else if (saveCubeIntState == 0 && goodDuo(-1, duoCubesI, duo(cubesState), notWho) == 0) {
                let masDuos = ((duo(cubesState)[0][notWhoFloor] - duoCubesI[0][notWhoFloor]))
                switch (masDuos) {
                    case 1:
                        value += 2
                        break;
                    case 3:
                    case 2:
                        value += 3
                        break;
                }
            }
            // 

            cubesState[cubeInt] = saveCubeIntState;
            if (yourMatchPoint - winningCube(notWhoFloor)[0] > 0) {
                value += 20
            }
            value -= 25 * (myMatchPoint - winningCube(whoFloor)[0])

            if (cubesState[cubeInt] != 0) { // si al reemplazar la casilla se hace tateti en el cubo 

                let oldDuos = duoCubesI[0]
                let newDuos = duo(cubesState)
                if (newDuos[0][notWhoFloor] - oldDuos[notWhoFloor] < 0) {
                    value += 20
                }

                value += 20
                //let saveValue = value;
                if (oldDuos[whoFloor] < 2) {
                    if (oldDuos[whoFloor] - newDuos[0][whoFloor] == -1) {
                        value += (30)
                    } else if (oldDuos[whoFloor] - newDuos[0][whoFloor] < -1) {
                        value += (50)
                    }
                } else {
                    value += (20)
                }

                if (newDuos[0][whoFloor] - oldDuos[whoFloor]) {
                    let notGoodDuo = goodDuo(-1, duoCubesI, newDuos, ofWho)
                    let toMyCube = ((cubesState[i] != 0) || (goodDuo(i, duoCubesI, newDuos)) > 0)

                    switch (notGoodDuo) {
                        case 8:
                            value -= 16 + toMyCube * (10)
                            break;
                        case 7:
                            value -= 12 + 15 * toMyCube
                            break;
                        case 5:
                            value -= 8 + 10 * toMyCube
                            break;
                        case 4:
                            value -= 4 + 10 * toMyCube
                            break;
                        case 6:
                            value -= 4 + 25 * toMyCube
                            break;
                        case 10:
                            value -= 30
                            break;
                    }
                }

            }
            // -----

            if (cubesState[i] != 0) { //si en el lugar final esta ocupado resta
                if (recursion < maxRecursion) {
                    let bestMove = [cubeInt, i, -50];
                    for (let j = 0; j < limite; j++) {
                        if (cubesState[j] == 0) {
                            let save = (valueBoard(j, (notWho), recursion + 1));
                            if (save[2] > bestMove[2]) {
                                bestMove = save;
                            }
                        }
                    }
                    if (recursion < maxRecursion - 1) {
                        value -= (bestMove[2]) * 0.8;
                    } else {
                        value -= Math.floor((bestMove[2]) * 0.8 / 3);
                    }
                } else {
                    value -= 50 //alarm indica si hay matchpoint 
                }
            } else if (recursion < maxRecursion) {
                if (recursion < maxRecursion - 1) {
                    value -= (valueBoard(i, (notWho), recursion + 1)[2]) * 0.8;
                } else {
                    value -= Math.floor((valueBoard(i, (notWho), recursion + 1)[2]) * 0.8 / 3);
                }
            }
            // ------  

            if (TaTeTi(cubesState) != 0) { // chequea si con ese click hay victoria 
                value = 500;
            }
            //-------------------------------------------------------------------
            states[cubeInt][i] = 0
            cubesState[cubeInt] = 0
            value = Math.floor(value)

            // if (!recursion) {
            //     console.log("===========================")
            //     console.log("FINAL C:", cubeInt, "P:", i, "v:", value)
            //     console.log("===========================")
            // }
            // else if (recursion == 1) {
            //     console.log("recursion C:", cubeInt, "P:", i, "v:", value)
            //     console.log("--------------------------")

            // }
            if (value > highest) {
                highest = value;
                move = i;
            }
        }
    }
    return [cubeInt, move, highest]
}

function domination(cubeInt) {
    let x = 0;
    let o = 0;
    for (let i = 0; i < states[cubeInt].length; i++) {
        if (states[cubeInt][i] == 100) {
            o++;
        }
        if (states[cubeInt][i] == 10) {
            x++
        }
    }
    return [x, o]
}

function goodDuo(cubeInt, initial, actualDuo, ofWho) {
    let isCube = true;
    if (actualDuo == undefined) {
        isCube = false;
        actualDuo = duo(states[cubeInt]);
    }
    let saveInitial = [];
    for (let i = 0; i < initial[1].length; i++) {
        saveInitial.push([initial[1][i][0], initial[1][i][1]])
    }
    let saveAD = [];
    for (let i = 0; i < actualDuo[1].length; i++) {
        saveAD.push([actualDuo[1][i][0], actualDuo[1][i][1]])
    }

    for (let i = 0; i < actualDuo[1].length; i++) {
        for (let j = 0; j < saveInitial.length; j++) {
            if (actualDuo[1][i] != undefined) {
                if (actualDuo[1][i][0] == saveInitial[j][0] && actualDuo[1][i][1] == saveInitial[j][1]) {
                    saveInitial.splice(j, 1)
                    actualDuo[1].splice(i, 1)
                    j--;
                    i--;
                }
            }
        }
    }
    var repeated2 = 0;
    let saveWorstCase = 0;
    for (let i = 0; i < actualDuo[1].length; i++) {
        if (cubeInt == -1) {
            let worstCase = 0;
            let myMovesTilTTT = easyttt(actualDuo[1][i][1], ofWho)
            let yourMovesTilTTT = easyttt(actualDuo[1][i][1], 100 - 90 * Math.floor(ofWho / 100))
            switch (myMovesTilTTT) {
                case 4:
                    worstCase = 10;
                    break;
                case 3:
                    if (yourMovesTilTTT == 1) {
                        worstCase = 8;
                    }
                    if (yourMovesTilTTT == 2) {
                        worstCase = 5;
                    }
                    break;
                case 2:
                    if (yourMovesTilTTT == 1) {
                        worstCase = 7
                    }
                    if (yourMovesTilTTT == 2) {
                        worstCase = 4
                    }
                    break;
                case 1:
                    if (yourMovesTilTTT == 1) {
                        worstCase = 6
                    }
                    break;
            }
            if (worstCase > saveWorstCase) {
                saveWorstCase = worstCase
            }


        }
        if (actualDuo[1][i][1] == cubeInt || cubesState[actualDuo[1][i][1]] != 0) {
            return 0.4;
        }
        let repeated = 0;
        for (let j = 0; j < saveAD.length; j++) {
            if (actualDuo[1][i][0] == saveAD[j][0] && actualDuo[1][i][1] == saveAD[j][1]) {
                repeated++
            }
        }
        if (repeated > 1) {
            repeated2++;
        }

    }
    if (repeated2 > 0) {
        return 10;
    } else if (saveWorstCase) {
        return saveWorstCase;
    }
    if (!isCube) {
        for (let i = 0; i < actualDuo[1].length; i++) {
            let objectiveDuo = duo(states[actualDuo[1][i][1]])[0]
            if (objectiveDuo[0] != 0 || objectiveDuo[1] != 0) {
                return 0.1;
            }
        }
    }
    return 0;
}

function easyttt(cubeInt, ofWho) {
    let blanks = [];
    for (let index = 0; index < states[cubeInt].length; index++) {
        if (!states[cubeInt][index]) {
            blanks.push(index);
        }
    }
    for (let i = 0; i < blanks.length; i++) {
        states[cubeInt][blanks[i]] = ofWho;
        if (TaTeTi(states[cubeInt])) {
            states[cubeInt][blanks[i]] = 0
            return 1;
        }
        states[cubeInt][blanks[i]] = 0

    }
    for (let i = 0; i < blanks.length - 1; i++) {
        states[cubeInt][blanks[i]] = ofWho;
        for (let j = i + 1; j < (blanks.length); j++) {
            states[cubeInt][blanks[j]] = ofWho;
            if (TaTeTi(states[cubeInt])) {
                states[cubeInt][blanks[i]] = 0;
                states[cubeInt][blanks[j]] = 0
                return 2;
            }
            states[cubeInt][blanks[j]] = 0
        }
        states[cubeInt][blanks[i]] = 0;
    }
    for (let i = 0; i < blanks.length - 2; i++) {
        states[cubeInt][blanks[i]] = ofWho;
        for (let j = i + 1; j < blanks.length - 1; j++) {
            states[cubeInt][blanks[j]] = ofWho;
            for (let k = i + 2; k < (blanks.length); k++) {
                states[cubeInt][blanks[k]] = ofWho;
                if (TaTeTi(states[cubeInt])) {
                    states[cubeInt][blanks[i]] = 0
                    states[cubeInt][blanks[j]] = 0
                    states[cubeInt][blanks[k]] = 0
                    return 3;
                }
                states[cubeInt][blanks[k]] = 0

            }
            states[cubeInt][blanks[j]] = 0;
        }
        states[cubeInt][blanks[i]] = 0;
    }
    return 4;
}

function restanTodosSalvo(mode, C, a, b, c, d, e) {
    for (let i = 0; i < limite; i++) {
        if (a != i && b != i && c != i && d != i && e != i) {
            C[i] -= mode;
        }
    }
    return C
}

function isPositionGood(cubeInt, notWhofloor) {
    let mode = 3;
    let C = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < limite; i++) {
        let condition = (duo(states[i])[0][notWhofloor])
        if (condition != 0) {
            switch (i) {
                case 0:
                    restanTodosSalvo(mode, C, 5, 0, 7, -1, -1)
                    break;
                case 1:
                    restanTodosSalvo(mode, C, 3, 1, 5, 6, 8)
                    break;
                case 2:
                    restanTodosSalvo(mode, C, 3, 2, 7, -1, -1)
                    break;
                case 3:
                    restanTodosSalvo(mode, C, 1, 3, 2, 7, 8)
                    break;
                case 4:
                    break;
                case 5:
                    restanTodosSalvo(mode, C, 0, 1, 5, 6, 7)
                    break;
                case 6:
                    restanTodosSalvo(mode, C, 1, 5, 6, -1, -1)
                    break;
                case 7:
                    restanTodosSalvo(mode, C, 0, 2, 7, 3, 5)
                    break;
                case 8:
                    restanTodosSalvo(mode, C, 1, 3, 8, -1, -1)
                    break;

            }
        }
    }

    return C[cubeInt]
}

function winningCube(ofWho) {
    let initialState = duo(cubesState);
    let notWho = Math.floor((100 - 90 * ofWho) / 100);
    let matchpoint = 0;
    let teCagan = 0;
    for (let i = 0; i < initialState[1].length; i++) {
        if (initialState[1][i][0] == ofWho) {
            if (duo(states[initialState[1][i][1]])[0][ofWho] != 0) {
                matchpoint += 1;
            }
            if (duo(states[initialState[1][i][1]])[0][notWho] != 0) {
                teCagan = 1;
            }
        }
    }
    return [matchpoint, teCagan]
}



function duo(cubeArray) { //checks if in a cube there are two positions connected, owned by the same player
    let flag = 0; //it returns an array in which the first element is who is the owner of the duo
    //and the second element indicates which is the posion needed to complete the
    let duoX = 0;
    let duoO = 0;
    const tatetiado = TaTeTi(cubeArray);
    if (tatetiado == 0) {
        flag = [];
        if (cubeArray[0] + cubeArray[1] + cubeArray[2] == 20 || cubeArray[0] + cubeArray[1] + cubeArray[2] == 200) {
            flag.push(checkBlank(cubeArray, 0, 1, 2))
            if (cubeArray[0] + cubeArray[1] + cubeArray[2] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[3] + cubeArray[4] + cubeArray[5] == 20 || cubeArray[3] + cubeArray[4] + cubeArray[5] == 200) {
            flag.push(checkBlank(cubeArray, 3, 4, 5))
            if (cubeArray[3] + cubeArray[4] + cubeArray[5] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[6] + cubeArray[7] + cubeArray[8] == 20 || cubeArray[6] + cubeArray[7] + cubeArray[8] == 200) {
            flag.push(checkBlank(cubeArray, 6, 7, 8))
            if (cubeArray[6] + cubeArray[7] + cubeArray[8] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[0] + cubeArray[3] + cubeArray[6] == 20 || cubeArray[0] + cubeArray[3] + cubeArray[6] == 200) {
            flag.push(checkBlank(cubeArray, 0, 3, 6))
            if (cubeArray[0] + cubeArray[3] + cubeArray[6] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[1] + cubeArray[4] + cubeArray[7] == 20 || cubeArray[1] + cubeArray[4] + cubeArray[7] == 200) {
            flag.push(checkBlank(cubeArray, 1, 4, 7))
            if (cubeArray[1] + cubeArray[4] + cubeArray[7] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[2] + cubeArray[5] + cubeArray[8] == 20 || cubeArray[2] + cubeArray[5] + cubeArray[8] == 200) {
            flag.push(checkBlank(cubeArray, 2, 5, 8))
            if (cubeArray[2] + cubeArray[5] + cubeArray[8] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[0] + cubeArray[4] + cubeArray[8] == 20 || cubeArray[0] + cubeArray[4] + cubeArray[8] == 200) {
            flag.push(checkBlank(cubeArray, 0, 4, 8))
            if (cubeArray[0] + cubeArray[4] + cubeArray[8] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
        if (cubeArray[6] + cubeArray[4] + cubeArray[2] == 20 || cubeArray[6] + cubeArray[4] + cubeArray[2] == 200) {
            flag.push(checkBlank(cubeArray, 6, 4, 2))
            if (cubeArray[6] + cubeArray[4] + cubeArray[2] == 20) {
                duoX++
            } else {
                duoO++
            }
        }
    }
    return [
        [duoX, duoO], flag
    ];

}

function checkBlank(array, a, b, c) { //checks in a duo which is the position needed to complete the trio
    let blank;
    if (array[a] == 0) {
        blank = a;
    } else if (array[b] == 0) {
        blank = b;
    } else {
        blank = c;
    }
    if (array[a] + array[b] + array[c] > 30) { //true means the duo is from circle else ex'es
        return [1, blank]
    } else {
        return [0, blank]
    }
}
//========================================================================================
//========================================================================================
//========================================================================================
//========================================================================================