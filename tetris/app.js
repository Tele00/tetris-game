document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const score_display = document.querySelector('#score')
    const score_header = document.querySelector('#scoreheader')
    const start_btn = document.querySelector('#startbutton')
    const width = 10
    let nextRandom = 0
    let score = 0
    const colors = [
        'orange',
        'purple', 
        'red',
        'green',
        'blue'
    ]
    let timerId

    //The Tetrominoes

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetraminoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPositon = 4
    let currentRotation = 0

    //randomly select a tetramino and its first rotation
    let random = Math.floor(Math.random()*theTetraminoes.length)
    let current = theTetraminoes[random][currentRotation]

    //draw the Tetramino
    function draw() {
        current.forEach( index => {
            squares[currentPositon + index].classList.add('tetromino')
            squares[currentPositon + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the Tetramino
    function undraw() {
        current.forEach( index => {
            squares[currentPositon + index].classList.remove('tetromino')
            squares[currentPositon + index].style.backgroundColor = ''
        })
    }

    //assign function to key press
    function control(e){
        if (e.keyCode === 37){
            moveLeft()
        }else if (e.keyCode === 38){
            rotate()
        }else if (e.keyCode === 39){
            moveRight()
        }else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move the tetramino down every second
    //timerId = setInterval(moveDown, 1000)

    // move down function
    function moveDown() {
        undraw()
        currentPositon += width
        draw()
        freeze()
    }

    //freeze function
    function freeze(){
        if (current.some(index => squares[currentPositon + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPositon + index].classList.add('taken'))
            //start new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetraminoes.length)
            current = theTetraminoes[random][currentRotation]
            currentPositon = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //move tertamino left, unless is at edge or in a blockage
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPositon + index) % width === 0)

        if (!isAtLeftEdge) currentPositon -= 1

        if (current.some(index => squares[currentPositon + index].classList.contains('taken'))){
            currentPositon += 1
        }
        draw()
    }

    //move tertamino right, unless is at edge or in a blockage
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPositon + index) % width === width -1)

        if (!isAtRightEdge) currentPositon += 1

        if (current.some(index => squares[currentPositon + index].classList.contains('taken'))){
            currentPositon -= 1
            
        }
        draw()

    }

    //rotate the tetramino
    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation === current.length){ //if current rotation gets to 4
            currentRotation = 0
        }
        current = theTetraminoes[random][currentRotation]
        draw()
    }

    //show next tetramino in mini grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    

    const nextTetraminoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //display next shape in mini-grid
    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
    })
    nextTetraminoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
    }

    //add functionality to start button
    start_btn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else{
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetraminoes.length)
            displayShape()
            addScore()
        }
    })

    //add score
    function addScore(){
        for (let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every( index => squares[index].classList.contains('taken'))){
                score += 10
                score_display.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                //console.log(squaresRemoved)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell =>grid.appendChild(cell))
            }
        }
    }

    //defining game over
    function gameOver(){
        if(current.some(index => squares[currentPositon + index].classList.contains('taken'))){
            score_header.innerHTML = 'Game Over!'
            clearInterval(timerId)
        }
    }
})