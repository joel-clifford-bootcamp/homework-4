
    var score = 0;
    var triviaUrl = "https://opentdb.com/api.php?amount=20&category=18&type=multiple";
    var questions;
    var correctAnswerPrinted = false;
    var questionIndex = 0;
    var timeElapsed = 0;
    var totalTime = 120;


    $(document).ready(function(){

        localStorage.setItem("currentScore",0);

        updateTimer();

        $.ajax({
            type: "get",
            url: triviaUrl,
            success: function (response) {
            
                questions = response.results;

                $(".score").text("Score: " + score);

                renderQuestion();

                window.setInterval(() => {

                    timeElapsed++;

                    updateTimer();

                }, 1000);
                  
            }
        });
    });

    // Print current question
    function renderQuestion()
    {
        var question = questions[questionIndex];

        var questionEl = $(".question");

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

        var button = $("<button>").attr("type","button").addClass("list-group-item list-group-item-action")
        
        button.html(question.correct_answer).text();

        button.click(function(){

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

    function correctChoiceAnimation(event, value)
    {

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

        var button = $("<button>").attr("type","button").addClass("list-group-item list-group-item-action")
        
        button.html(question.incorrect_answers[0]).text();

        button.click(function()
            {
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
            window.clearInterval();
            endQuiz();
        }
        
        var timeRemaining = totalTime - timeElapsed;
        var minutesRemaining = Math.floor(timeRemaining / 60);
        var secondsRemaining = timeRemaining % 60; 

        $(".timer").text("Time Remaining: " + minutesRemaining + ":" + secondsRemaining.toString().padStart(2,"0"));
    }

    function endQuiz(){

        window.localStorage.setItem("currentScore",score.toString());
        
        window.location.href = "scores.html";

    }
