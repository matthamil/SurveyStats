$(document).ready(function(){
	var answerChoices = "<label class='answer-choice'><input type='radio' name='q1' value='1'>Strongly Disagree</label>"
	var answerChoiceWrapper = "<form class='answer-choice-wrapper'>" + answerChoices + "</form>"
	$("#survey-body").append("<div class='question-instructions'>Instructions: Add instructions here.</div>");
	$("#survey-body").append("<div class='question-header'>#.</div>");
	$("#survey-body").append("<div class='question-body'><p>Question text.</p>" + answerChoiceWrapper + "</div>");
});

// OLOO Design
// Question Object
// Objects with behaviors delegated from Question:
// Likert, YesNo

var Question = {
    init: function(text, type, choices) {
        this.questionText = text;
        this.questionType = type;
        this.answers = choices;
    },
    getQuestion: function() {
        return this.questionText;
    },
    getType: function() {
        return this.questionType;
    },
    getAnswerChoices: function() {
        return this.answers;
    },
    getRandomAnswer: function() {
        var randomNum = Math.floor(Math.random() * (this.answers.length - 1)) + 1;
        return this.answers[randomNum] || "Question not defined.";
    },
    printQuestion: function() {
        return "Question: " + this.questionText + "\n" +
            "Type: " + this.questionType + "\n" +
            "Answer Choices: " + this.answers + "\n" +
            "Your choice: " + this.getRandomAnswer();
    }
};

var Likert = Object.create(Question);
Likert.Likert = function(question) {
    this.init(question, "Likert", ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]);
    return this;
};

var YesNo = Object.create(Question);
YesNo.YesNo = function(question) {
    this.init(question, "Yes/No", ["Yes", "No"]);
    return this;
};

// How to create Likert or Yes/No Questions:
//var likertTest = Object.create(Likert).Likert("USM has a beautiful campus.");
//var yesNoTest = Object.create(YesNo).YesNo("Do you own a cat?");

var Survey = {
    survey: [],
    addQuestions: function(questions) {
        for (var i = 0; i < questions.length; i++) {
            var text = questions[i][0];
            var type = questions[i][1];
            if (type == "Likert")
                this.survey.push(Object.create(Likert).Likert(text));
            if (type == "Yes/No")
                this.survey.push(Object.create(YesNo).YesNo(text));
        }
    },
    printSurvey: function() {
        for (var i = 0; i < this.survey.length; i++)
            console.log(this.survey[i].printQuestion() + "\n");
    },
    printQuestionTypes: function() {
        for (var i = 0; i < this.survey.length; i++)
            console.log("Question " + (i+1) + ": " + this.survey[i].questionType);
    }

};

var created_survey = [["USM offers a wide variety of courses.", "Likert"], ["USM makes me feel at home", "Likert"],
    ["I am receiving a quality education at USM", "Likert"], ["USM is a good school", "Likert"],
    ["I am currently enrolled at USM", "Yes/No"]];

Survey.addQuestions(created_survey);

Survey.printQuestionTypes();
console.log();
Survey.printSurvey();

