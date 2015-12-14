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

var Survey = function() {
    this.survey = [];
    this.addQuestions = function(questions) {
        for (var i = 0; i < questions.length; i++) {
            var text = questions[i][0];
            var type = questions[i][1];
            if (type == "Likert")
                this.survey.push(Object.create(Likert).Likert(text));
            if (type == "Yes/No")
                this.survey.push(Object.create(YesNo).YesNo(text));
        }
    };
    this.printSurvey = function() {
        for (var i = 0; i < this.survey.length; i++)
            console.log(this.survey[i].printQuestion() + "\n");
    };
    this.printQuestionTypes = function() {
        for (var i = 0; i < this.survey.length; i++)
            console.log("Question " + (i+1) + ": " + this.survey[i].questionType);
    };
};

var created_survey = [["USM offers a wide variety of courses.", "Likert"], ["USM makes me feel at home", "Likert"],
    ["I am receiving a quality education at USM", "Likert"], ["USM is a good school", "Likert"],
    ["I am currently enrolled at USM", "Yes/No"]];

var test_survey = new Survey;

test_survey.addQuestions(created_survey);

//-----------------
//DOM Manipulation
//-----------------

var app = {
    surveyCache: {
        createdSurvey: new Survey
    },
    questionNum: null,
    createdQCounter: 1,
    init: function(){
        this.questionNum = 1;
        this.$fakeTakeSurvey();
        this.$createSurvey();
    },
    $appendQuestionNum: function(){
        $("#survey-submit").append("<div class='question-header'>" + this.questionNum + ".</div>").bind(app);
    },
    $appendQBody: function(qText, qAnswers){
        $("#survey-submit").append("<div class='question-body'><p>" + qText + "</p>");
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
        $("#survey-body").append("<form id='survey-submit' action='to-be-added'>");
        for (var i = 0; i < s.survey.length; i++)
            this.$appendNextQuestion(s.survey[i].getQuestion(), s.survey[i].getAnswerChoices());
        $("#survey-body").append("</form>");
        $("#survey-body").append("<button id='send-data-to-server' action='submit-to-server'>Submit</button>");
    },
    $fakeTakeSurvey: function(){
        $("#take-survey").click(function(){
            //Removes the Main Menu
            $("#main-menu").remove();
            app.$addGoBack();
            app.printSurveytoDOM(test_survey);
        });
    },
    $addGoBack: function() {
        $("#survey-body").append("<a class='btn btn-default' href='index.html'>Back</a>");
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
            app.$onClickAddNewQ();
            app.$submitNewSurvey();
        });
    },
    $addNewQuestionBuilder: function(){
        $(".survey-builder").append("<div class='question-create-wrapper'>" +
            "<input class='question-create-textinput' type='text' name='q"+app.createdQCounter+"' placeholder='Type a question here.'>" +
            "<label class='question-type-selector'><input type='radio' name='qRB"+app.createdQCounter+"' value='1'>Likert</label>" +
            "<label class='question-type-selector'><input type='radio' name='qRB"+app.createdQCounter+"' value='2'>Yes/No</label>" +
            "</div></form>");
    },
    $onClickAddNewQ: function(){
        $("#add-question-builder").click(function() {
            app.createdQCounter++;
            app.$addNewQuestionBuilder();
        });
    },
    $submitNewSurvey: function(){
        this.surveyCache.createdQList = [];
        $("#submit-question-builder").click(function(){
            for (var i = 0; i < app.createdQCounter; i++) {
                var qText = document.getElementsByName("q" + (i + 1))[0].value;
                var radios = document.getElementsByName("qRB" + (i + 1));
                var getRadioValue = function () {
                    for (var j = 0; j < 2; j++) {
                        if(radios[j].checked) {
                            return "Likert";
                        } else {
                            return "Yes/No";
                        }
                    }
                };
                app.surveyCache.createdQList.push([qText, getRadioValue()]);
            }
            $("#create-survey").remove();
            app.surveyCache.createdSurvey.addQuestions(app.surveyCache.createdQList);
            app.printSurveytoDOM(app.surveyCache.createdSurvey);
        });
    },
};