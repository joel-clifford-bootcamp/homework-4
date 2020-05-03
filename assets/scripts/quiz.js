
    var score = 0;
    var timer;
    var triviaUrl = "https://opentdb.com/api.php?amount=20&category=18&type=multiple";
    var questions;
    var correctAnswerPrinted = false;
    var questionIndex = 0;
    var timeElapsed = 0;
    var totalTime = 120;

    var questionEl;

    $(document).ready(function(){

        localStorage.setItem("currentScore",0);

        questionEl = $(".question");

        updateTimer();

        $.ajax({
            type: "get",
            url: triviaUrl,
            timeout: 1500,
            success: function (response) {
            
                questions = response.results;

                $(".score").text("Score: " + score);

                renderQuestion();

                timer = window.setInterval(() => {

                    timeElapsed++;

                    updateTimer();

                }, 1000);   
            },
            error: function (request, status, error){

                if(error === "timeout"){
                    $(".question").text("Error: Request to Opentdb.com timed out. Refresh page to try again")
                }
            }
        });
    });

    // Print current question
    function renderQuestion()
    {
        var question = questions[questionIndex];

        questionEl.empty();

        $(".answers").empty();

        var difficultyText = $("<p>").addClass("inline difficulty " + question.difficulty)

        difficultyText.text("(" + question.difficulty[0].toUpperCase() + question.difficulty.slice(1,question.difficulty.length)  + ") ");

        var questionText = $("<p>").addClass("inline").html(question.question).text();

        questionEl.append(difficultyText);
        questionEl.append(questionText);

        printAnswers(question);

    }

    // Print responses 
    function printAnswers(question)
    {
        correctAnswerPrinted = false;

        for(i = 0; i < 3; i++){

            if(!correctAnswerPrinted){

                if(choosePrintCorrect()){
                    printCorrectAnswer(question)
                }
                else{
                    printIncorrectAnswer(question)
                }
            }
            else{
                printIncorrectAnswer(question)
            }
        }

        if(!correctAnswerPrinted)
            printCorrectAnswer(question);
        else
            printIncorrectAnswer(question);
    }

    // Choose whether to print correct response or incorrect response
    function choosePrintCorrect(){
        
        var correct = Math.random();

        return correct <= 0.25;
    }

    // Print Correct answer with event listener
    function printCorrectAnswer(question){

        var button = $("<button>")
            .attr("type","button")
            .attr("data-clicked","false")
            .addClass("list-group-item list-group-item-action")
        
        button.html(question.correct_answer).text();

        button.click(function(){

            // prevent double clicking
            if($(this).attr("data-clicked")==="true") return;

            $(this).attr("data-clicked","true");

            var value = getQuestionValue();

            correctChoiceAnimation(event, value);
    
            score += value;
    
            $(".score").text("Score: " + score);
    
            questionIndex++;
    
            if(questionIndex < questions.length - 1){
    
                renderQuestion();
            }
            else{
                endQuiz();
            }
        });

        $(".answers").append(button);

        correctAnswerPrinted = true;
    }

    function correctChoiceAnimation(event, value){

        var p = $("<p>").text("+" + value);

        p.css("position","fixed");
        p.css("top", event.y - 20);
        p.css("left", event.x);
        p.css("font-weight", "bold");
        p.css("z-index", 2);

        p.css("color","green");

        $("body").prepend(p);

        p.animate({
            opacity : 0,
            top: "-=100",
            fontSize: "40px",
        },1000, function() { p.remove() });

    }

    function printIncorrectAnswer(question){

        var button = $("<button>")
            .attr("type","button")
            .attr("data-clicked","false")
            .addClass("list-group-item list-group-item-action")
        
        button.html(question.incorrect_answers[0]).text();

        button.click(function()
            {
                console.log(this);
        
                if($(this).attr("data-clicked")==="true") return;

                $(this).attr("data-clicked","true");

                incorrectChoiceAnimation(event);

                timeElapsed += 10;
        
                updateTimer();
        
                if(timeElapsed <  totalTime){
        
                    questionIndex++;
        
                    renderQuestion();
                }
            }
        );

        $(".answers").append(button);

        question.incorrect_answers.shift();

    }

    function incorrectChoiceAnimation(event){

        var p = $("<p>").text("-10s");

        p.css("position","fixed");
        p.css("font-size","20px");
        p.css("top", event.y + 10);
        p.css("left", event.x + 10);
        p.css("font-weight", "bold");
        p.css("z-index", 2);

        p.css("color","red");

        $("body").prepend(p);

        p.animate({
            opacity : 0,
            top: "+=100",
            
        },500,"linear",function() { p.remove() });

    }

    // Get question point value based on difficulty
    function getQuestionValue(){

        switch(questions[questionIndex].difficulty)
        {
            case "easy":
                return 10;
            case "medium":
                return 30;
            case "hard":
                return 50;
        }
    }

    function updateTimer()
    {
        if(timeElapsed >= totalTime)
        {
            $(".timer").text("Time Remaining: 0:00");

            window.clearInterval(timer);

            endQuiz();
        }
        
        var timeRemaining = totalTime - timeElapsed;
        var minutesRemaining = Math.floor(timeRemaining / 60);
        var secondsRemaining = timeRemaining % 60; 

        var percentRemaining = Math.floor(100 * (totalTime - timeElapsed) / totalTime);
        $(".progress-bar").attr("aria-valuenow", percentRemaining);
        $(".progress-bar").attr("style", "width:" + percentRemaining + "%");

        if(timeRemaining <= 0){
            minutesRemaining = 0;
            secondsRemaining = 0;
        }

        $(".timer").text(`Time Remaining: ${minutesRemaining}:${secondsRemaining.toString().padStart(2,"0")}`);
    }

    function endQuiz(){

        questionEl.empty();
        $(".answers").empty();

        var titleEl = $("<h2>").text("Time's Up!");

        var scoreHeaderEl = $("<p>").text("Your score is:");

        var scoreEl = $("<h1>").text(score,toString());

        var instructionEl = $("<p>").text("Enter your name to submit this score");

        var formEl = $("<form>").addClass("form-inline d-flex justify-content-center");

        var inputEl = $("<input>")
        .addClass("form-control form-control-sm player-name")
        .attr("id","playerId");

        var buttonEl = $("<button>")
        .attr("type","button")
        .addClass("btn btn-primary btn-sm")
        .text("Submit")
        .click(event => {

            event.preventDefault();

            const playerId = $("#playerId").val();

            if(playerId.length === 0) return;

            var currentScore = {
                "name" : playerId,
                "score" : score
            };

            appendScore(currentScore);

            window.location.href = "scores.html";

        });

        questionEl.append(titleEl);
        questionEl.append(scoreHeaderEl);
        questionEl.append(scoreEl);
        questionEl.append(instructionEl);
        questionEl.append(formEl);
        formEl.append(inputEl);
        formEl.append(buttonEl);

    }

// Add current score to high local storage array of score objects
function appendScore(score)
{
    var quizScores = localStorage.getItem("quizScores");

    if(quizScores === null) {
        console.log("quizScores undefined");
        quizScores = [];
    }
    else{
        quizScores = JSON.parse(quizScores);
    }

    quizScores.push(score);

    window.localStorage.setItem("quizScores",JSON.stringify(quizScores));
}
