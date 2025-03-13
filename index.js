const selectedDifficulty = document.querySelector(".selectDifficulty");
const wrapper = document.querySelector(".wrapper");
const playButton = document.querySelector("#play-button");
const youWon = document.querySelector(".you-won");

let points = 0;
let pointsToWin;
let hittedBomb = false;

addBlocks(selectedDifficulty, wrapper);
youWon.classList.toggle("d-none");

selectedDifficulty.addEventListener("change", function () {
    addBlocks(selectedDifficulty, wrapper);
});

playButton.addEventListener("click", function () {
    hittedBomb = false;
    addBlocks(selectedDifficulty, wrapper);
    youWon.classList.toggle("d-none");
    points = 0;
});

function addBlocks(selectDifficultyHTML, wrapperHTML) {
    wrapper.innerHTML = "";
    let perLineBlocks = getPerLineBlocks(selectDifficultyHTML.value);
    populateBlocks(perLineBlocks, wrapperHTML);
}

function getPerLineBlocks(selectedDifficultyValue) {
    switch (parseInt(selectedDifficultyValue)) {
        case 0:
        default:
            return 12;
        case 1:
            return 8;
        case 2:
            return 6;
    }
}

function populateBlocks(perLineBlocks, wrapperHTML) {
    let blocksTotal = perLineBlocks * perLineBlocks;
    const totalBombs = 12;
    let arrayBomb = getBombs(blocksTotal, totalBombs);
    pointsToWin = blocksTotal - totalBombs;
    console.log(pointsToWin);

    for (let index = 0; index < blocksTotal; index++) {
        const element = document.createElement("div");
        let blockDimensionsStyle;

        if (perLineBlocks == 12) {
            blockDimensionsStyle = "easy";
        } else if (perLineBlocks == 8) {
            blockDimensionsStyle = "medium";
        } else {
            blockDimensionsStyle = "hard";
        }

        element.classList.add("box", blockDimensionsStyle);
        element.addEventListener("click", function () {
            if (arrayBomb.includes(index)) {
                element.classList.add("bomb");
                element.innerHTML = "B";
                alert("you have been hit by a bomb");
                hittedBomb = true;
            } else if (!hittedBomb) {
                if (!element.classList.contains("active")) {
                    points++;
                    pointsToWin--;
                    if (pointsToWin == 0) {
                        youWon.classList.toggle("d-none");
                    }
                }
                element.classList.add("active");
                element.innerHTML = getAroundNumberBombs(
                    arrayBomb,
                    perLineBlocks,
                    index
                );
            }
        });

        wrapperHTML.append(element);
    }
}

function getBombs(blocksTotal, totalBombs) {
    let bombsPositions = [];
    let randomNumber;

    while (bombsPositions.length < totalBombs) {
        randomNumber = getRandomNumber(0, blocksTotal);
        if (!bombsPositions.includes(randomNumber)) {
            bombsPositions.push(randomNumber);
        }
    }
    return bombsPositions.sort(function (a, b) {
        return a - b;
    });
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getAroundNumberBombs(arrayBomb, perLineBlocks, currentIndexBlock) {
    let totalBombs = 0;

    neighbors = [
        currentIndexBlock - perLineBlocks - 1,
        currentIndexBlock - perLineBlocks,
        currentIndexBlock - perLineBlocks + 1,
        currentIndexBlock - 1,
        currentIndexBlock + 1,
        currentIndexBlock + perLineBlocks - 1,
        currentIndexBlock + perLineBlocks,
        currentIndexBlock + perLineBlocks + 1,
    ];

    topLeftCornerBlockNeighbors = [
        currentIndexBlock + 1,
        currentIndexBlock + perLineBlocks,
        currentIndexBlock + perLineBlocks + 1,
    ];

    topRightBlockNeighbors = [
        currentIndexBlock - 1,
        currentIndexBlock + perLineBlocks - 1,
        currentIndexBlock + perLineBlocks,
    ];

    bottomLeftBlockNeighbors = [
        currentIndexBlock - perLineBlocks,
        currentIndexBlock - perLineBlocks + 1,
        currentIndexBlock + 1,
    ];

    bottomRightBlockNeighbors = [
        currentIndexBlock - perLineBlocks - 1,
        currentIndexBlock - perLineBlocks,
        currentIndexBlock - 1,
    ];

    leftSideNeighbors = [
        currentIndexBlock - perLineBlocks,
        currentIndexBlock - perLineBlocks + 1,
        currentIndexBlock + 1,
        currentIndexBlock + perLineBlocks,
        currentIndexBlock + perLineBlocks + 1,
    ];

    rightSideBlockNeighbors = [
        currentIndexBlock - perLineBlocks - 1,
        currentIndexBlock - perLineBlocks,
        currentIndexBlock - 1,
        currentIndexBlock + perLineBlocks - 1,
        currentIndexBlock + perLineBlocks,
    ];

    topSideBlockNeighbors = [
        currentIndexBlock - 1,
        currentIndexBlock + 1,
        currentIndexBlock + perLineBlocks - 1,
        currentIndexBlock + perLineBlocks,
        currentIndexBlock + perLineBlocks + 1,
    ];

    bottomSideBlockNeighbors = [
        currentIndexBlock - perLineBlocks - 1,
        currentIndexBlock - perLineBlocks,
        currentIndexBlock - perLineBlocks + 1,
        currentIndexBlock - 1,
        currentIndexBlock + 1,
    ];

    if (isOnCorner(perLineBlocks, currentIndexBlock) == 0)
        return returnTotalBomb(topLeftCornerBlockNeighbors, arrayBomb);
    if (isOnCorner(perLineBlocks, currentIndexBlock) == 1)
        return returnTotalBomb(topRightBlockNeighbors, arrayBomb);
    if (isOnCorner(perLineBlocks, currentIndexBlock) == 2)
        return returnTotalBomb(bottomLeftBlockNeighbors, arrayBomb);
    if (isOnCorner(perLineBlocks, currentIndexBlock) == 3)
        return returnTotalBomb(bottomRightBlockNeighbors, arrayBomb);

    if (isOnTop(perLineBlocks, currentIndexBlock))
        return returnTotalBomb(topSideBlockNeighbors, arrayBomb);
    if (isOnLeftSide(perLineBlocks, currentIndexBlock))
        return returnTotalBomb(leftSideNeighbors, arrayBomb);
    if (isOnRightSide(perLineBlocks, currentIndexBlock))
        return returnTotalBomb(rightSideBlockNeighbors, arrayBomb);
    if (isOnBottom(perLineBlocks, currentIndexBlock))
        return returnTotalBomb(bottomSideBlockNeighbors, arrayBomb);
    else return returnTotalBomb(neighbors, arrayBomb);
}

function returnTotalBomb(array, arrayBomb) {
    console.log(array);
    console.log(arrayBomb);
    let totalBombs = 0;
    for (let i = 0; i < arrayBomb.length; i++) {
        if (array.includes(arrayBomb[i])) {
            totalBombs++;
        }
    }
    return totalBombs;
}

function isOnLeftSide(perLineBlocks, currentIndexBlock) {
    if (currentIndexBlock % perLineBlocks == 0) {
        return true;
    }
    return false;
}

function isOnRightSide(perLineBlocks, currentIndexBlock) {
    if (currentIndexBlock % perLineBlocks == perLineBlocks - 1) {
        return true;
    }
    return false;
}

function isOnTop(perLineBlocks, currentIndexBlock) {
    if (currentIndexBlock < perLineBlocks) {
        return true;
    }
    return false;
}

function isOnBottom(perLineBlocks, currentIndexBlock) {
    if (currentIndexBlock >= perLineBlocks * (perLineBlocks - 1)) {
        return true;
    }
    return false;
}

function isOnCorner(perLineBlocks, currentIndexBlock) {
    if (
        isOnTop(perLineBlocks, currentIndexBlock) &&
        isOnLeftSide(perLineBlocks, currentIndexBlock)
    )
        return 0;
    else if (
        isOnTop(perLineBlocks, currentIndexBlock) &&
        isOnRightSide(perLineBlocks, currentIndexBlock)
    )
        return 1;
    else if (
        isOnBottom(perLineBlocks, currentIndexBlock) &&
        isOnLeftSide(perLineBlocks, currentIndexBlock)
    )
        return 2;
    else if (
        isOnBottom(perLineBlocks, currentIndexBlock) &&
        isOnRightSide(perLineBlocks, currentIndexBlock)
    )
        return 3;
    else return -1;
}
