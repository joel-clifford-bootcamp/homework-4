let currentScore;

const scoresEl = $(".scores")

$(document).ready(event => {
    
    const allScores = JSON.parse(window.localStorage.getItem("quizScores"));

    currentScore = allScores[allScores.length - 1];

    renderScores(allScores)

    $("#clearHighScores").click((event) =>{

        event.preventDefault();

        const emptyArray = [];

        window.localStorage.setItem("quizScores",JSON.stringify(emptyArray));

        renderScores(emptyArray);

    });
});

// Draw scores in table
function renderScores(allScores){

    if(allScores === null || allScores.length === 0) return;

    // Get unique scores and sort in descending order
    const sortedScores =  [...new Set(allScores.map(x => x.score))].sort((a,b) => b.score - a.score)

    // iterate over allScores, sorted in descending order by score, and print each
    allScores.sort((a,b) => b.score - a.score).forEach(score => {
        
        // print each player name and score along with its position
        // Ties will be shown as havingthe same position 
        renderScore(sortedScores.indexOf(score.score) + 1, score);
    });
}

// print single row of high scores table
function renderScore(idx, score){

    row =  $("<div>").addClass("row");

    idxCol = $("<div>").addClass("col-md-1 text-right").text(idx + ".");
    nameCol = $("<div>").addClass("col-md-9 text-left").text(score.name);
    scoreCol = $("<div>").addClass("col-md-2 text-right").text(score.score);

    row.append(idxCol);
    row.append(nameCol);
    row.append(scoreCol);

    if(score == currentScore) row.addClass("bg-primary text-white");

    scoresEl.append(row);
}