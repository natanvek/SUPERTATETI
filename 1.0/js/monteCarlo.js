// IDEAS
//para mi el value deberia ser el value de la mejor jugada
//no de la sumatoria, a tener en cuenta esa

actualNode = null;
const iterations = 75000; //75000 // 25000
const eachIterartion = 2; //2 // 5
var randomness = 1.6 // = 3800 // 3800

function manageMonteCarlo(cubeInt, position) {
    if (turno == 0 || turno == 1) {
        let cubesStateCopy = [...cubesState]
        let stateCopy = copyArray(states)
        let ofWho = 10 + 90 * turno;
        let initialNode = new node(cubeInt, ofWho)
        actualNode = initialNode;
        initialNode.state = stateCopy
        initialNode.cubesState = cubesStateCopy
    } else {
        for (let i = 0; i < actualNode.childNodes.length; i++) {
            if (actualNode.childNodes[i].move == (position * 9 + cubeInt)) {
                actualNode = actualNode.childNodes[i];
                break;
            }
        }
    }
    let time = new Date().getTime();
    for (let i = 0; i < iterations; i++) {
        monteCarlo(actualNode)
    }
    if (((new Date().getTime()) - time) < 1000) {
        for (let i = 0; i < iterations; i++) {
            monteCarlo(actualNode)
        }
        if (((new Date().getTime()) - time) < 1000) {
            for (let i = 0; i < iterations; i++) {
                monteCarlo(actualNode)
            }
        }
    }
    let highest = -Infinity;
    let highestNode = null;
    for (let i = 0; i < actualNode.childNodes.length; i++) {
        if (actualNode.childNodes[i].visits > highest) {
            highestNode = actualNode.childNodes[i]
            highest = actualNode.childNodes[i].visits
        }
    } 
    console.log('actualNode:', actualNode)
    actualNode = highestNode; 
    console.log('actualNode:', actualNode)
    probabilidad.innerHTML= 
"    ============================================"+
"    >>PROBABILIDAD DE QUE GANE EL SuperPlayer "+ Math.round(actualNode.value*100/(actualNode.visits*eachIterartion))+"%"+
"    ============================================ " 
    manager(Math.floor(highestNode.move / limite), highestNode.move % limite)

}

function monteCarlo(parentNode) { 
    let checkTTT = TaTeTi(parentNode.cubesState);
    let checkTie = tie(parentNode.cubesState)
    if (checkTTT || checkTie == true) {
        parentNode.visits++;
        if (checkTTT) {
            if (parentNode.ofWho == checkTTT / 3) {
                parentNode.value += eachIterartion;
                return -eachIterartion
            } else {
                parentNode.value -= eachIterartion;
                return eachIterartion
            }
        } else {
            return 0
        }
    }
    if (!parentNode.childNodes.length) {
        let childMoves = whereCanIPlay(parentNode.state, parentNode.cubesState, parentNode.move % limite)
        for (let i = 0; i < childMoves.length; i++) {
            parentNode.childNodes.push(new node(childMoves[i], parentNode.ofWho))
        }
    }

    let highest = -Infinity;
    let highestNode = null;
    for (let i = 0; i < parentNode.childNodes.length; i++) {
        let childFormula = parentNode.childNodes[i].formula(parentNode.visits)
        if (isNaN(childFormula) || childFormula > highest) {
            highestNode = parentNode.childNodes[i]
            highest = childFormula
            if (isNaN(childFormula)) {
                break;
            }
        }
    }

    if (!(highestNode.visits)) { 
        highestNode.updateState(parentNode)
        let result = 0;
        for (let i = 0; i < eachIterartion; i++) {
            let newMatch = highestNode.myMatch(parentNode)
            if (newMatch == highestNode.ofWho) {
                result++
            } else if (newMatch) { //ojo aca que por ahi como los child son las jugadas del oponente
                result--
            }
        }
        highestNode.visits++;
        parentNode.visits++;
        highestNode.value += result;
        parentNode.value -= result;
        return result;
    } else {
        if (!highestNode.childNodes.length) { 
            let childMoves = whereCanIPlay(highestNode.state, highestNode.cubesState, highestNode.move % limite)
            for (let i = 0; i < childMoves.length; i++) {
                highestNode.childNodes.push(new node(childMoves[i], highestNode.ofWho))
            }
        }
        let newNodes = monteCarlo(highestNode)
        parentNode.value += newNodes;
        parentNode.visits++;
        return -newNodes;
    }
}


function node(move, parentOfWho) {
    this.value = 0
    this.visits = 0
    this.formula = function (parentVisits) {
        return ((this.value/this.visits) + (randomness) * Math.sqrt(Math.log(parentVisits) / this.visits)) //(randomness / Math.pow(children,2)) * 
    } //lognatural bla bla
    this.move = move
    this.ofWho = (100 - 90 * (Math.floor(parentOfWho / 100)))
    this.childNodes = [] //[obj,obj,obj]
    //--------------------------------------
    this.state = null;
    this.cubesState = null;
    this.updateState = function (parentNode) {
        let copyState = copyArray(parentNode.state)
        let copyCubesState = [...parentNode.cubesState]
        updateState(copyState, copyCubesState, this.move, this.ofWho);
        this.cubesState = copyCubesState
        this.state = copyState
    };
    this.myMatch = function (parentNode) {
        let copyStateChild = copyArray(this.state)
        let copyCubesStateChild = [...this.cubesState]
        let result = randomMatch(copyStateChild, copyCubesStateChild, Math.floor(this.move / limite), parentNode.ofWho);
        return result;
    }
}

function updateState(statesCopy, cubesStateCopy, move, ofWho) { // 35/86 del tiempo total 
    if (move == undefined) {
        let checkWinner = TaTeTi(cubesStateCopy)
        if (checkWinner) {
            return (checkWinner / 3)
            //checks if the match was tied 
        } else if (tie(cubesStateCopy)) {
            return 0
        }
    }
    //gets the position of the move in the subboard 
    let moveInt = move % limite;
    //gets the subboard of the random play
    let cubeInt = Math.floor(move / limite);
    //changes the statesCopy of the position to the one who played it 
    statesCopy[cubeInt][moveInt] = ofWho;
    /*checks if there was ttt in the subboard cubesStateCopy[cubeInt] = ofWho; 
    changes the statesCopy of the subboard to the one who gained it */
    if (TaTeTi(statesCopy[cubeInt])) {
        cubesStateCopy[cubeInt] = ofWho;
        //checks if there is a winner 
        //checks if there was a tie in the subboard
        let checkWinner = TaTeTi(cubesStateCopy)
        if (checkWinner) {
            return (checkWinner / 3)
            //checks if the match was tied 
        } else if (tie(cubesStateCopy)) {
            return 0
        }
    } else if (tie(statesCopy[cubeInt])) {
        //changes the statesCopy of the subboard to a tie
        cubesStateCopy[cubeInt] = 1;
        if (tie(cubesStateCopy)) {
            return 0
        }
    }
    return undefined;
}

function randomMatch(statesCopy, cubesStatesCopy, cubeInt, ofWho) { //90% del tiempo total
    //this formula returns the state of the opponent either it is O or X
    let notWho = 100 - 90 * (Math.floor(ofWho / 100))
    //creates array with the options the player would be able to play
    let options = whereCanIPlay(statesCopy, cubesStatesCopy, cubeInt); // 44/87 del tiempo total 
    //selects a random play from the available ones
    let randomNum = options[Math.floor(Math.random() * options.length)]
    let update = updateState(statesCopy, cubesStatesCopy, randomNum, ofWho)
    if (update == undefined) {
        let result = randomMatch(statesCopy, cubesStatesCopy, randomNum % limite, notWho);
        return result
    } else {
        return update
    }
}

function whereCanIPlay(statesCopy, cubesStatesCopy, cubeInt) { //this function returns the number of the places you can play(not in arrays)
    let blanks = [];
    if (cubesStatesCopy[cubeInt] || cubeInt == -1) { //checks if the subboard is clean 
        for (let i = 0; i < limite; i++) { //if full analize the available options of all the clean subboards
            if (!cubesStatesCopy[i]) { //checks if the subboard is clean else analize the options in that subboard
                for (let j = 0; j < 9; j++) {
                    if (!statesCopy[i][j]) {
                        blanks.push((j + i * 9)); //adds the option to the list of options
                    }
                }
            }
        }
    } else { //if clean adds the available options in the clean subboard
        for (let i = 0; i < limite; i++) {
            if (!statesCopy[cubeInt][i]) {
                blanks.push((i + cubeInt * limite)); //adds the option to the list of options
            }
        }
    }
    return blanks;
}


function tie(board) { //this function checks if the board or subboard is tied
    if (board.indexOf(0) == -1) {
        return true;
    } else {
        return false;
    }
}

function copyArray(array) { //simple as that you give this function an array of arrays and it returns a copy of it
    let copy = []
    for (let i = 0; i < array.length; i++) {
        if (!(array[i] instanceof Array)) {
            copy.push(array[i]) //if the array its just a value not another array adds the value to the array
        } else { //if the element of the initial array is an array first creats a copy of the array element recursing
            copy.push([...array[i]]) // and then it adds it to the initial array 
        }
    }
    return copy;
}