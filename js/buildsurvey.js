$(document).ready(function(){
    app.init();
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

//-----------------
//DOM Manipulation
//-----------------

var app = {
    questionNum: null,
    init: function(){
        this.questionNum = 1;
        this.$fakeTakeSurvey();
        this.$createSurvey();
        this.$onClickAddNewQ();
    },
    $appendQuestionNum: function(){
        $("#survey-body").append("<div class='question-header'>" + this.questionNum + ".</div>").bind(app);
    },
    $appendQBody: function(qText, qAnswers){
        $("#survey-body").append("<div class='question-body'><p>" + qText + "</p>");
        this.$appendQAnswers(qAnswers);
    },
    $appendQAnswers: function(questionAnswers){
        //Appends div .answer-choice-wrapper
        $(".question-body").last().append("<div class='answer-choice-wrapper'>");

        //Cache of the appended div
        var $aForm = $(".answer-choice-wrapper").last();

        //Appends a radio button for each possible answer
        var radioButton = function(qA, num){
            return "<label class='answer-choice'>" +
                "<input type='radio' name="+"q"+app.questionNum+
                " value="+num+">" + qA + "</label>";
        };

        for (var i = 0; i < questionAnswers.length; i++){
            $aForm.append(radioButton(questionAnswers[i], i+1));
        }
    },
    $appendNextQuestion: function(qText, qAnswers){
        this.$appendQuestionNum();
        this.$appendQBody(qText, qAnswers);
        this.questionNum++;
    },
    printSurveytoDOM: function(s){
        for (var i = 0; i < s.survey.length; i++)
            this.$appendNextQuestion(s.survey[i].getQuestion(), s.survey[i].getAnswerChoices());
    },
    $fakeTakeSurvey: function(){
        $("#take-survey").click(function(){
            //Removes the Main Menu
            $("#main-menu").remove();
            app.$addGoBack();
            app.printSurveytoDOM(Survey);
        });
    },
    $addGoBack: function() {
        $("#survey-body").append("<button class='go-back'>Back</button>");
    },
    $createSurvey: function(){
        $("#start-survey").click(function(){
            $("#main-menu").remove();
            app.$addGoBack();
            $("#survey-body").append("<div id='create-survey'>");
            $("#create-survey").append("<h2>Survey Builder</h2>");
            $("#create-survey").append("<form class='survey-builder'>");
            app.$addNewQuestionBuilder();
            $("#create-survey").append("<button id='add-question-builder'>Add Question</button>" +
                "<button id='submit-question-builder'>Submit</button>" +
                "</div><!--Create Survey-->");
        });
        this.$onClickAddNewQ();
    },
    createdQCounter: 1,
    $addNewQuestionBuilder: function(){
        $(".survey-builder").append("<div class='question-create-wrapper'>" +
            "<input class='question-create-textinput' type='text' name='q' placeholder='Type a question here.'>" +
            "<label class='question-type-selector'><input type='radio' name='q1' value='1'>Likert</label>" +
            "<label class='question-type-selector'><input type='radio' name='q1' value='2'>Yes/No</label>" +
            "<button class='del-question-builder'>Delete</button></div></form>");
        this.createdQCounter++;
    },
    $onClickAddNewQ: function(){
        $("#add-question-builder").click(app.$addNewQuestionBuilder());
    }
};

var $goBack = function() {
    $("#go-back").click(function(){

    });
};