var questions, currentQuestion;
var currentQuestionNumber;
var questionCount;
var answer_area_div;
var answer_option_container;
var answer_info_div;
var answer_info_text_span;
var question_text_div;
var next_question_button;
var current_qustion_num_span;
var question_container_div;
var end_quiz_message_div;
var instruction_text_div;

// Intial quiz set up
document.addEventListener("DOMContentLoaded", function () {

    // Get references to page elements for manipulation during quiz
    question_container_div      = document.getElementById("questionContainer");
    answer_area_div             = document.getElementById("answerArea");
    answer_option_container     = document.getElementById("answerOptionsContainer")
    answer_info_div             = document.getElementById("answerInfo");
    answer_info_text_span       = document.getElementById("answerInfoText");
    question_text_div           = document.getElementById("questionText");
    next_question_button        = document.getElementById("nextQuestionBtn");
    current_qustion_num_span    = document.getElementById("qnum");
    end_quiz_message_div        = document.getElementById("endQuizMessage");
    instructions_text_div       = document.getElementById("instructionsText");

    // Get the questions with callback function to start quiz
    loadJSON(function (response) {
        questions = JSON.parse(response);
        questionCount = 1;
        setNextQuestion();
    });
});

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'questions.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
};

function allowDrop(ev) {
    ev.preventDefault();
};

function drop(ev) {
    ev.preventDefault();
    // disable while answer current answer is dealt with
    enableOptionsDrag(false);
    var droppedOptionId = ev.dataTransfer.getData("text");
    var droppedOption = document.getElementById(droppedOptionId);
    ev.target.appendChild(document.getElementById(droppedOptionId));

    // correctAnswer
    if (droppedOption.id == currentQuestion.answer) {
        instructions_text_div.style.display = "none";
        answer_option_container.style.display = "none";
        droppedOption.style.animationPlayState = "running";
        droppedOption.style.webkitAnimationPlayState = "running";
        droppedOption.style.cursor = "default";
        answer_info_text_span.innerHTML = currentQuestion.answertext;
        answer_info_div.style.display = "block";
        nextQuestionBtn.style.display = "block";
        questionCount++
    }

    // wrong answer
    else {
        droppedOption.style.display = "none";
        answer_area_div.innerHTML = droppedOption.innerHTML;
        answer_area_div.style.animationPlayState = "running";
        answer_area_div.style.webkitAnimationPlayState = "running";

        // Let animation play for 2 seconds then pause and clear answer area
        setTimeout(function () {
            answer_area_div.innerHTML = "";
            answer_area_div.style.animationPlayState = "paused";
            answer_area_div.style.webkitAnimationPlayState = "paused";
            // enable again, finished dealing with last answer.
            enableOptionsDrag(true);
        }, 2000);
    }
}

function finishedQuestion() {
    if (questions.questions.length > 1)
        setNextQuestion();
    else
        finishQuiz();
}

function setNextQuestion() {
    // reset question display
    instructions_text_div.style.display = "block";
    next_question_button.style.display = "none";
    answer_info_div.style.display = "none";
    current_qustion_num_span.innerHTML = (questionCount);
    answer_area_div.innerHTML = "";
    answer_info_text_span.innerHTML = "";
    answer_option_container.innerHTML = "";
    answer_option_container.style.display = "flex";

    if (currentQuestionNumber > 0 || currentQuestionNumber != null)
        questions.questions.splice(currentQuestionNumber, 1);

    // get a random question from those left
    currentQuestionNumber = Math.floor(Math.random() * questions.questions.length);
    currentQuestion = questions.questions[currentQuestionNumber];

    // set new question display
    question_text_div.innerHTML = currentQuestion.question;

    // create answer option elements
    var questionOptions = currentQuestion.options;
    var tempOptions = questionOptions.slice(0);
    for (var i = 0; i < questionOptions.length; i++) {
        var nextOptionIndex = Math.floor(Math.random() * tempOptions.length);
        answer_option_container.appendChild(creatAnswerOptionElement(tempOptions[nextOptionIndex].id, tempOptions[nextOptionIndex].option));
        tempOptions.splice(nextOptionIndex, 1);
    }
}

function creatAnswerOptionElement(optionId, optionText) {
    var questionOption = document.createElement("div");
    questionOption.setAttributeNode(createAnswerOptionAttribute("class", "answer-option"));
    questionOption.setAttributeNode(createAnswerOptionAttribute("draggable", "true"));
    questionOption.setAttributeNode(createAnswerOptionAttribute("ondragstart", "drag(event)"));
    questionOption.setAttributeNode(createAnswerOptionAttribute("id", optionId));
    questionOption.innerHTML = optionText;
    return questionOption;
}

function createAnswerOptionAttribute(name, value) {
    var attr = document.createAttribute(name);
    attr.value = value;
    return attr;
}

function enableOptionsDrag(draggable) {
    var options = document.getElementsByClassName("answer-option");
    for (var o = 0; o < options.length; o++) {
        options[o].setAttribute("draggable", draggable);

        // enable/disable drag function on answer options
        if (draggable)
            options[o].style.cursor = "pointer";
        else
            options[o].style.cursor = "not-allowed";
    }
}

function finishQuiz() {
    question_container_div.style.display = "none";
    end_quiz_message_div.style.display = "block";
}
