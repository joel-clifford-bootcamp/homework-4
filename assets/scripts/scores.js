let currentScore;

const scoresEl = $(".scores")

$(document).ready(event => {
    
    const allScores = JSON.parse(window.localStorage.getItem("quizScores"));

    currentScore = allScores[allScores.length - 1];

    renderScores(allScores)

    $("#clearHighScores").click((event) =>{

        event.preventDefault();

        window.localStorage.removeItem("quizScores");

        renderScores(null);

    });
});

// Draw scores in table
function renderScores(allScores){

    scoresEl.empty();

    if(allScores === null || allScores.length === 0) return;

    // Get unique scores and sort in descending order
    const sortedScores =  [...new Set(allScores.map(x => x.score).sort((a,b) => b - a))];

    // iterate over allScores, sorted in descending order by score, and print each
    allScores.sort((a,b) => b.score - a.score).forEach(score => {
        
        // print each player name and score along with its position
        // Ties will be shown as havingthe same position 
        renderScore(sortedScores.indexOf(score.score) + 1, score);
    });
}

// print single row of high scores table
function renderScore(idx, score){

    row =  $("<div>").addClass("list-group-item d-flex");

    idxCol = $("<div>").addClass("p-2 flex-left").text(idx + ".");
    nameCol = $("<div>").addClass("p-2 flex-fill text-left").text(score.name);
    scoreCol = $("<div>").addClass("p-2 flex-rigth").text(score.score);

    row.append(idxCol);
    row.append(nameCol);
    row.append(scoreCol);

    if(score == currentScore) row.addClass("bg-primary text-white");

    scoresEl.append(row);
}

