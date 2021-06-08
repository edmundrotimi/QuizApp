/******************************
 ********** Quiz Controller ***
 *****************************/
var quizController = (function(){
    var personLocalStorage, questionLocalStorage;

    //create person function constructor
    function Person(id, fullName, score){
        this.id = id;
        this.fullName = fullName;
        this.score = score;
    }


    //init user's local storage
    personLocalStorage = {
        setPersonStorage : function(personCollection){
            localStorage.setItem('userData', JSON.stringify(personCollection));
        },
        getPersonStorage : function(){
            return  JSON.parse(localStorage.getItem('userData'));
        },
        removePersonStorage : function(){
            localStorage.removeItem('userData');
        },
    };

    //create question function constructor
    function Question(id, question, options, correctAns){
        this.id = id;
        this.question = question;
        this.options = options;
        this.correctAns = correctAns;
    }

    //init local storage
    questionLocalStorage = {
        setQuestionStorage : function(newCollection){
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionStorage : function(){
            return  JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionStorage : function(){
            localStorage.removeItem('questionCollection');
        },
    };

    var quizProgress =  {
        quizIndex : 0,
    };

    var adminInfo = {
        fullName : ['Edmund', 'Rotimi'],
    };

    var userInfo = {
        fullName : [],
        score: 0
    };


    return{

        getAdminInfo : adminInfo,

        getUserInfo : userInfo,

        getQuizProgress : quizProgress,

        getPersonLocalStorage : personLocalStorage,

        getQuestionLocalStorage : questionLocalStorage,

        validateAnswer: function(userSelectedAnswer) {
            return questionLocalStorage.getQuestionStorage()[quizProgress.quizIndex].correctAns === userSelectedAnswer; 
        },

        addUserCollection : function(){
            var personId, personObject, getPersonCollection;

            //check if local storage is not empty
            if(personLocalStorage.getPersonStorage() === null){
                personLocalStorage.setPersonStorage([]);
            }

            //unique question id 
            if(personLocalStorage.getPersonStorage().length > 0){
                personId = personLocalStorage.getPersonStorage()[personLocalStorage.getPersonStorage().length - 1].id + 1;
            }else{
                personId = 0;
            }
            
            personObject = new Person(id=personId, fullName = userInfo.fullName[0] + ' ' + userInfo.fullName[1], score=userInfo.score);
                        
            //get localstorage previous data mand add new to it
            getPersonCollection = personLocalStorage.getPersonStorage();
            getPersonCollection.push(personObject);
            personLocalStorage.setPersonStorage(getPersonCollection);
                        
        },

        addQuestionCollection : function(qustText, adminOptsContainer){
            var quetionId, inputedQuestion, optionArray, correctAnswer, opts;

            opts = document.querySelectorAll('.admin-option-wrapper');

            //check if local storage is not empty
            if(questionLocalStorage.getQuestionStorage() === null){
                questionLocalStorage.setQuestionStorage([]);
            }

            //unique question id 
            if(questionLocalStorage.getQuestionStorage().length > 0){
                quetionId = questionLocalStorage.getQuestionStorage()[questionLocalStorage.getQuestionStorage().length - 1].id + 1;
            }else{
                quetionId = 0;
            }


            optionArray = [];
            
            if(qustText.value !== ''){
        
                inputedQuestion = qustText.value;

                for(var i = 0; i < opts.length; i++){
                    if(opts[i].lastElementChild.value !== ''){
                        optionArray.push(opts[i].lastElementChild.value);
                    };

                    if(opts[i].firstElementChild.checked){
                        correctAnswer = opts[i].lastElementChild.value;
                    };
                }

                if(optionArray.length > 1){
                    if(correctAnswer){

                        //create question object
                        questionObject = new Question(quetionId, inputedQuestion, optionArray, correctAnswer);
                        
                        //get localstorage previous data mand add new to it
                        getQuestionCollection = questionLocalStorage.getQuestionStorage();
                        getQuestionCollection.push(questionObject);
                        questionLocalStorage.setQuestionStorage(getQuestionCollection);

                        //clear input fields and reset option fields to two
                        qustText.value = '';
                        adminOptsContainer.innerHTML = '';
                        
                        var optionHTML;

                        optionHTML ='<div class="admin-option-wrapper"><input type="radio" class="admin-option-0 \
                                        name="answer" value="0"> <input type="text" class="admin-option admin-option-0 \
                                        value=""></div><div class="admin-option-wrapper"><input type="radio" class="admin-option-1\
                                        name="answer" value="0"> <input type="text" class="admin-option admin-option-1\
                                        value=""></div>';
                        adminOptsContainer.insertAdjacentHTML('beforeend', optionHTML);

                        return true;

                    }else{
                        alert('Kindly select a correct answer from provided options');
                    }
                }else{
                    alert('At least two options most be provided per question');
                    return false;
                }
            }else{
                alert('Kindly provide a question.');
                return false;
            }
        },
    }

})();

/******************************
 ********** UI Controller *****
 *****************************/
var UIController = (function(){
    var dormElm;

    dormElm = {
        //admin panel
        adminPanelContainer : document.querySelector('.admin-panel-container'),
        adminInsertBtn : document.getElementById('question-insert-btn'),
        questionInsertText : document.getElementById('new-question-text'),
        adminOptionContainer : document.querySelector('.admin-options-container'),
        adminOptionWrapper : document.querySelectorAll('.admin-option-wrapper'),
        adminPanelQuestList: document.querySelector('.inserted-questions-wrapper'),
        updateQuestion: document.getElementById('question-update-btn'),
        deleteQuestion: document.getElementById('question-delete-btn'),
        clearQuestion: document.getElementById('questions-clear-btn'),
        userListWarapper: document.querySelector('.results-list-wrapper'),
        clearUserResult: document.getElementById('results-clear-btn'),
        adminLogout : document.getElementById('admin-logout-btn'),
        //login panel
        loginPanelContainer  : document.querySelector('.landing-page-container'),
        inputFieldWrapper  : document.querySelector('.landing-inputs-wrapper'),
        firstNameInputField : document.getElementById('firstname'), 
        lastNameInputField : document.getElementById('lastname'), 
        startQuizBtn : document.getElementById('start-quiz-btn'), 
        // quiz panel
        quizPanelContainer  : document.querySelector('.quiz-container'),
        displayQuestion : document.getElementById('asked-question-text'),
        displayOptionWrapper : document.querySelector('.quiz-options-wrapper'),
        progressBar : document.querySelector('.progressBar'),
        answerContainer : document.querySelector('.instant-answer-container'),
        showNext : document.getElementById('next-question-btn'),
        // result panel
        resultPanelContainer  : document.querySelector('.final-result-container'),
        finalResultText  : document.getElementById('final-score-text'),
        finalLogoutBtn  : document.getElementById('final-logout-btn')
    }

    return{
        getDormElement: dormElm,
        dynamicsInput : function(){
            var optionHTML;


            var optionFocus = function(){
                var z =  document.querySelectorAll('.admin-option').length

                optionHTML ='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ z +'" name="answer" value="0"> \
                                <input type="text" class="admin-option admin-option-'+ z +'" value=""></div>';
                  
                
                dormElm.adminOptionContainer.insertAdjacentHTML('beforeend', optionHTML);
                dormElm.adminOptionContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', optionFocus);
                dormElm.adminOptionContainer.lastElementChild.lastElementChild.addEventListener('focus', optionFocus);
            }


            dormElm.adminOptionContainer.lastElementChild.lastElementChild.addEventListener('focus', optionFocus);

        },
        diplayAdminPanelQuestion : function(questionStorage){
            var qustionList;

            dormElm.adminPanelQuestList.innerHTML = '';
            
            if(questionStorage.getQuestionStorage() === null || questionStorage.getQuestionStorage().length === 0){
                dormElm.adminPanelQuestList.innerHTML='<p><span>*** No Question list to display </span></p>'
            }else{

                for(var i = 0; i < questionStorage.getQuestionStorage().length; i++){
                    qustionList = '<p><span>' +(i+1) +'. '+ questionStorage.getQuestionStorage()[i].question+ '</span>\
                                    <button id="question-'+i+'">Edit</button></p>';
                    dormElm.adminPanelQuestList.insertAdjacentHTML('afterbegin', qustionList);
    
                }
            }
        },
        editQuestion : function(event, questionStorage, dynamicOption, adminQuestionList){
    
            var questionId, foundArray, foundQuestStorage, optionArray, optionHTML;

            var getQuestionStorage = questionStorage.getQuestionStorage();

            optionArray = [];
            
            questionId = parseInt(event.target.id.split('-')[1]);
            for(var i = 0; i < getQuestionStorage.length; i++){
                if(getQuestionStorage[i].id === questionId){
                    foundArray = i;
                    foundQuestStorage = getQuestionStorage[i];
                }
            }
            
            //update inpute fields with edited question
            dormElm.questionInsertText.value = foundQuestStorage.question;
            dormElm.adminOptionContainer.innerHTML = '';

            for(var z = 0; z < foundQuestStorage.options.length; z++){
                
                optionArray.push(foundQuestStorage.options[z]);

                
                if(foundQuestStorage.correctAns === foundQuestStorage.options[z]){
                    
                    optionHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-"'+ z +' \
                    name="answer" value="'+ z +'" checked> <input type="text" class="admin-option admin-option-"'+ z +' \
                    value="'+foundQuestStorage.options[z]+'"></div>';
                }else{
                    
                    optionHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-"'+ z +' \
                    name="answer" value="'+ z +'"> <input type="text" class="admin-option admin-option-"'+ z +' \
                    value="'+foundQuestStorage.options[z]+'"></div>';
                }

                dormElm.adminOptionContainer.insertAdjacentHTML('beforeend', optionHTML);   

                //hide insert btn
                dormElm.adminInsertBtn.style.display = 'none';

                //remove clear btn pointer event
                dormElm.clearQuestion.style.pointerEvents = 'none';

                //show update and delete btn
                dormElm.updateQuestion.style.visibility = 'visible';
                dormElm.deleteQuestion.style.visibility = 'visible';
                
            };

            function resetBtn() {
                //clear input fields and reset option fields to two
                dormElm.questionInsertText.value = '';
                dormElm.adminOptionContainer.innerHTML = '';
                
                var optionHTML;

                optionHTML ='<div class="admin-option-wrapper"><input type="radio" class="admin-option-0 \
                                name="answer" value="0"> <input type="text" class="admin-option admin-option-0 \
                                value=""></div><div class="admin-option-wrapper"><input type="radio" class="admin-option-1\
                                name="answer" value="0"> <input type="text" class="admin-option admin-option-1\
                                value=""></div>';
                dormElm.adminOptionContainer.insertAdjacentHTML('beforeend', optionHTML);

                //hide insert btn
                dormElm.adminInsertBtn.style.display = 'block';

                //remove clear btn pointer event
                dormElm.clearQuestion.style.pointerEvents = '';

                //show update and delete btn
                dormElm.updateQuestion.style.visibility = 'hidden';
                dormElm.deleteQuestion.style.visibility = 'hidden';
        
            };

            var updateQuestion = function(){
                var updatedQuestion, updatedOption, updatedCorrectAnswer, updatedOptionArray;

                updatedOptionArray = [];

                //update new question 
                updatedQuestion = dormElm.questionInsertText;
                updatedOption = document.querySelectorAll('.admin-option-wrapper');

                
                if(updatedQuestion.value !== ''){

                    foundQuestStorage.question = updatedQuestion.value;
    
                    for(var i = 0; i < updatedOption.length; i++){
                        if(updatedOption[i].lastElementChild.value !== ''){
                            updatedOptionArray.push(updatedOption[i].lastElementChild.value);
                        };
    
                        if(updatedOption[i].firstElementChild.checked){
                            updatedCorrectAnswer = updatedOption[i].lastElementChild.value;
                        };
                    }
    
                    if(updatedOptionArray.length > 1){
                        if(updatedCorrectAnswer){

                            //update input options
                            foundQuestStorage.options = updatedOptionArray;
                            foundQuestStorage.correctAns = updatedCorrectAnswer;

                            //update question record
                            getQuestionStorage.splice(foundArray, 1, foundQuestStorage)
                            questionStorage.setQuestionStorage(getQuestionStorage);    
                            
                            //reset input field
                            resetBtn();

                            //update admin question list
                            adminQuestionList(questionStorage)
                        }else{
                            alert('Kindly select a correct answer from provided options');
                        }
                    }else{
                        alert('At least two options most be provided per question');
                    }
                }else{
                    alert('Kindly provide a question.');
                }

                //call dynamic input function
                dynamicOption();
            
            }
            
            //add event handler for update btn click
            dormElm.updateQuestion.onclick = updateQuestion;

            //call dynamic input function
            dynamicOption();

            var deleteQuestion = function () {
                //update question record
                getQuestionStorage.splice(foundArray, 1)
                questionStorage.setQuestionStorage(getQuestionStorage);  

                //reset input field
                resetBtn();

                //update admin question list
                adminQuestionList(questionStorage)

                //call dynamic input function
                dynamicOption();
            }

            //add event handler for delete btn click
            dormElm.deleteQuestion.onclick = deleteQuestion;

        },

        //clear question collection from local stoarage
        clearQuestion : function (questionStorage) {
            var confirmClear;
            if(questionStorage.getQuestionStorage() !== null){
                confirmClear = confirm('You are about to clear entire quiz question, click okay to continue');
                if(confirmClear){
                    questionStorage.removeQuestionStorage();
                }
            }else{
                alert('No question(s) available to clear !!!');
            }
        },

        //display question to user
        displayQuestion: function(questionStorage, progress){
            if(questionStorage.getQuestionStorage()!== null){

                var questionCollection, currentQuestion, optionHtml, optionCount;

                questionCollection = questionStorage.getQuestionStorage();
                currentQuestion =  questionCollection[progress.quizIndex];

                //display quiz question
                dormElm.displayQuestion.textContent = currentQuestion.question;

                //clear current option fields
                dormElm.displayOptionWrapper.innerHTML ='';

                //option numbering
                optionCount = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

                for(var i = 0; i < currentQuestion.options.length; i++){
                    optionHtml = '<div class="choice-'+ i +'"><span class="choice-'+ i +'">'+optionCount[i]+'</span><p  class="choice-'+ i +'">'+currentQuestion.options[i]+'</p></div>';
                    dormElm.displayOptionWrapper.insertAdjacentHTML('beforeend', optionHtml);
                }
            }
        },

        displayProgressBar: function(questionCollection, progress){
            if(questionCollection.getQuestionStorage()!== null){
                var progressNum, progressBar;
                
                getquestionCollectio = questionCollection.getQuestionStorage();

                progressNum = dormElm.progressBar.firstElementChild;
                progressBar = dormElm.progressBar.lastElementChild;

                //update progress bar fields
                progressNum.textContent = (progress.quizIndex+1)+'/'+(getquestionCollectio.length);
                progressBar.setAttribute('value', progress.quizIndex+1);
                progressBar.setAttribute('max', getquestionCollectio.length);
            }
        },

        checkAnswer: function(questionStorage, userAnswer, checkAnswer, quizprogress) {
            var correctAns, correctCheckIndex, twoOptions;

            correctAns = false;
            correctCheckIndex = 0;

            if(checkAnswer(userAnswer)){
                correctAns = true;
                correctCheckIndex = 1;
            }
            
            twoOptions ={
                emojiFace : ['images/sad.png', 'images/happy.png', ],
                displayText : ['This is a wrong answer', 'This is a correct answer', ],
                backgroundColor : ['red', 'green', ],
            }

            //disable further select
            dormElm.displayOptionWrapper.style.cssText = 'opacity:.6; pointer-events: none;';

            //show answer conatiner
            dormElm.answerContainer.style.opacity= '1';

            //change background color for correct or wrong answer
            dormElm.answerContainer.classList.add(twoOptions.backgroundColor[correctCheckIndex]);

            //change emoji face on correct
            dormElm.answerContainer.firstElementChild.setAttribute('src', twoOptions.emojiFace[correctCheckIndex]);

            //change display text for correct or wrong answer
            dormElm.answerContainer.lastElementChild.firstElementChild.textContent = twoOptions.displayText[correctCheckIndex];

            //check next question btn
            if(questionStorage.getQuestionStorage().length === (quizprogress.quizIndex + 1)){
                
                //change next btn for correct or wrong answer
                twoOptions['progressBtnText'] = 'Finish';

            }else{
                twoOptions['progressBtnText'] = 'Next';
            }

            dormElm.showNext.textContent = twoOptions.progressBtnText;

            return correctAns

        }, 

        getUserFullName : function (questionLocalStorage, adminInfo, userInfo) {
            var userFirstName, userLastName;

            userFirstName = dormElm.firstNameInputField.value;
            userLastName = dormElm.lastNameInputField.value;

            if(userFirstName !== '' && userLastName !== ''){

                //hide login panel
                dormElm.loginPanelContainer.style.display = 'none';

                if(adminInfo.fullName[0].toLowerCase() === userFirstName.toLowerCase() && adminInfo.fullName[1].toLowerCase() === userLastName.toLowerCase()){
                    
                    //show admin quiz panel
                    dormElm.adminPanelContainer.style.display = 'block';
                    
                }else{
                    if(questionLocalStorage.getQuestionStorage() !== null && questionLocalStorage.getQuestionStorage().length > 0){

                        //set firstname and lastname
                        userInfo.fullName.push(userFirstName);
                        userInfo.fullName.push(userLastName);

                        //show quiz panel
                        dormElm.quizPanelContainer.style.display = 'block';
                    }else{
                        alert('Quiz not ready!!, kindly contact admin.');

                        //clear input field
                        dormElm.firstNameInputField.value = '';
                        dormElm.lastNameInputField.value = '';
                        
                        //show login panel
                        dormElm.loginPanelContainer.style.display = 'block';
                    }
                }

            }else{
                alert('Kindly enter firstname and lastname.');
            }
        },

        diplayUserAdminPanel : function(userStorage){
            var UserList;

            dormElm.userListWarapper.innerHTML = '';
            
            if(userStorage.getPersonStorage() === null || userStorage.getPersonStorage().length === 0){
                dormElm.userListWarapper.innerHTML='<p><span>*** No user list to display </span></p>'
            }else{

                for(var i = 0; i < userStorage.getPersonStorage().length; i++){

                    UserList ='<p class="person person-'+ (i+1) +'"><span class="person-'+ (i+1) +'">'+userStorage.getPersonStorage()[i].fullName + ' - '+ userStorage.getPersonStorage()[i].score + ' Points</span><button id="delete-result-btn_'+ (i+1) +'" class="delete-result-btn">Delete</button></p>';
                    
                    dormElm.userListWarapper.insertAdjacentHTML('afterbegin', UserList);
    
                }
            }
        },
        // delete user 
        deleteUserAdminPanel : function(event, personLocalStorage){
            var foundPersonData, foundPersonArr, foundPersonId, getPersonCollection;

            if('delete-result-btn_'.indexOf(event.target.id)){

                foundPersonId = parseInt(event.target.id.split('_')[1]);

                for(var i = 0; i < personLocalStorage.getPersonStorage().length; i++){

                    if(personLocalStorage.getPersonStorage()[i].id + 1 === foundPersonId ){

                        foundPersonArr = i;
                        foundPersonData = personLocalStorage.getPersonStorage()[i];
                    }
                }

                getPersonCollection = personLocalStorage.getPersonStorage();
                getPersonCollection.splice(foundPersonArr, 1);
                personLocalStorage.setPersonStorage(getPersonCollection);
            }
        },

        //clear question collection from local stoarage
        clearUserResult : function (personStorage) {
            var confirmClear;
            if(personStorage.getPersonStorage() !== null || personStorage.getPersonStorage()){

                confirmClear = confirm('You are about to clear entire user\'s result!!!, click okay to continue');
                
                if(confirmClear){

                    personStorage.removePersonStorage();
                }
            }else{

                alert('No user(s) result available to clear !!!');
            }
        },

    }

})();

/******************************
 ********** Controller ********
 *****************************/
var controller = (function(quizContrl, UIContrl){
    var selectDormElement;

    selectDormElement = UIContrl.getDormElement;

    //dynamic option input
    UIContrl.dynamicsInput();

    //admin panel question list
    UIContrl.diplayAdminPanelQuestion(quizContrl.getQuestionLocalStorage);

    selectDormElement.adminInsertBtn.addEventListener('click', function(){
        var addQuestion = quizContrl.addQuestionCollection(selectDormElement.questionInsertText, 
                                                        selectDormElement.adminOptionContainer);
        
        if(addQuestion){
            //admin panel question list
            UIContrl.diplayAdminPanelQuestion(quizContrl.getQuestionLocalStorage);
            //dynamic option input
            UIContrl.dynamicsInput();
        }
    });

    selectDormElement.adminPanelQuestList.addEventListener('click', function(e){
        if('question-'.indexOf(e.target.id)){
            UIContrl.editQuestion(e, quizContrl.getQuestionLocalStorage, UIContrl.dynamicsInput,
                UIContrl.diplayAdminPanelQuestion)
        }
     })

     selectDormElement.clearQuestion.addEventListener('click', function(){
         UIContrl.clearQuestion(quizContrl.getQuestionLocalStorage)

         //update admin panel question list
         UIContrl.diplayAdminPanelQuestion(quizContrl.getQuestionLocalStorage);
     })

    //user display question section
    UIContrl.displayQuestion(quizContrl.getQuestionLocalStorage, quizContrl.getQuizProgress);

    //user displau progress bar
    UIContrl.displayProgressBar(quizContrl.getQuestionLocalStorage, quizContrl.getQuizProgress);

    //check user answer
    selectDormElement.displayOptionWrapper.addEventListener('click', function(e) {
        if('choice-'.indexOf(e.target.className)){
            var userAnswer, userchioceCorr;
            
            userAnswer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className).textContent; 

            userchioceCorr = UIContrl.checkAnswer(quizContrl.getQuestionLocalStorage, userAnswer, quizContrl.validateAnswer, quizContrl.getQuizProgress);
            
            if(userchioceCorr){
                //increase user score by 1
                quizContrl.getUserInfo.score++;
                console.log('Correct answer, one point awarded');
            }else{
                console.log('Wrong answer, no point awarded');
            }
        }
    })


    selectDormElement.showNext.addEventListener('click', function(e) {

        //check if the quiz has endeed
        if(quizContrl.getQuestionLocalStorage.getQuestionStorage().length === (quizContrl.getQuizProgress.quizIndex + 1)){

            //add user recored
            quizContrl.addUserCollection()
            
            //hide quiz panel
            selectDormElement.quizPanelContainer.style.display = 'none';

            //unhide reseult panel
            selectDormElement.resultPanelContainer.style.display = 'block';

            //
            selectDormElement.finalResultText.textContent = quizContrl.getUserInfo.fullName[0].toUpperCase() +' '+ quizContrl.getUserInfo.fullName[1].toUpperCase() + ' -- ' + quizContrl.getUserInfo.score;
            
            console.log('Quiz has finished finished');

        }else{

            quizContrl.getQuizProgress.quizIndex++;

            selectDormElement.answerContainer.style.opacity= '0';
            //disable further select
            selectDormElement.displayOptionWrapper.style.cssText = 'opacity:1; pointer-events: all;';
            
            //user display question section
            UIContrl.displayQuestion(quizContrl.getQuestionLocalStorage, quizContrl.getQuizProgress);

            //user displau progress bar
            UIContrl.displayProgressBar(quizContrl.getQuestionLocalStorage, quizContrl.getQuizProgress);
        }
    })

    selectDormElement.inputFieldWrapper.addEventListener('click', function () {
        
        selectDormElement.lastNameInputField.addEventListener('keypress', function (e) {
            if(e.keyCode === 13){
                UIContrl.getUserFullName(quizContrl.getQuestionLocalStorage, quizContrl.getAdminInfo, quizContrl.getUserInfo);
            }
        });
    })

    selectDormElement.startQuizBtn.addEventListener('click', function () { 
        UIContrl.getUserFullName(quizContrl.getQuestionLocalStorage, quizContrl.getAdminInfo, quizContrl.getUserInfo);
    })

    selectDormElement.finalLogoutBtn.addEventListener('click', function () {

        //hide reseult panel
        selectDormElement.resultPanelContainer.style.display = 'none';

        //unhide login panel
        selectDormElement.loginPanelContainer.style.display = 'block';

        quizContrl.getQuizProgress.quizIndex = 0;

        //hide answer container
        selectDormElement.answerContainer.style.opacity= '0';

        //reset select
        selectDormElement.displayOptionWrapper.style.cssText = 'opacity:1; pointer-events: all;';
        
        //user display question section
        UIContrl.displayQuestion(quizContrl.getQuestionLocalStorage, quizContrl.getQuizProgress);

        //user display progress bar
        UIContrl.displayProgressBar(quizContrl.getQuestionLocalStorage, quizContrl.getQuizProgress);

        //clear user infp
        quizContrl.getUserInfo.fullName = [];
        quizContrl.getUserInfo.score = 0;

        //clear input field
        selectDormElement.firstNameInputField.value = '';
        selectDormElement.lastNameInputField.value = '';
    })

    // display user score in admin
    UIContrl.diplayUserAdminPanel(quizContrl.getPersonLocalStorage);

    selectDormElement.userListWarapper.addEventListener('click', function(e){
        
        //delete individual user score result
        UIContrl.deleteUserAdminPanel(e, quizContrl.getPersonLocalStorage);

        // update display user score in admin
        UIContrl.diplayUserAdminPanel(quizContrl.getPersonLocalStorage);
    })

    selectDormElement.clearUserResult.addEventListener('click', function(){

        UIContrl.clearUserResult(quizContrl.getPersonLocalStorage);

        // update display user score in admin
        UIContrl.diplayUserAdminPanel(quizContrl.getPersonLocalStorage);
    });


    selectDormElement.adminLogout.addEventListener('click', function () {

        //hide admin panel
        selectDormElement.adminPanelContainer.style.display = 'none';

        //unhide login panel
        selectDormElement.loginPanelContainer.style.display = 'block';

        //clear input field
        selectDormElement.firstNameInputField.value = '';
        selectDormElement.lastNameInputField.value = '';
    });

})(quizController, UIController)







