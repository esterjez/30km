document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting quiz initialization');
    
    // Initialize all required DOM elements with error checking
    const startButton = document.querySelector('#start-quiz-main');
    const quizApp = document.getElementById('quiz-app');
    const questionBlocks = document.querySelectorAll('.question-block');
    const progressFill = document.getElementById('progress-fill');
    const currentQuestionSpan = document.querySelector('.current-question');
    const totalQuestionsSpan = document.querySelector('.total-questions');
    const nextButton = document.querySelector('.nav-arrow.right');
    const prevButton = document.querySelector('.nav-arrow.left');
    const endQuizButton = document.querySelector('.nav-arrow.end-quiz');
    const dots = document.querySelectorAll('.dot');
    const optionElements = document.querySelectorAll('.option');

    // Debug: Log what elements we found
    console.log('Elements found:', {
        startButton: !!startButton,
        quizApp: !!quizApp,
        questionBlocks: questionBlocks.length,
        progressFill: !!progressFill,
        currentQuestionSpan: !!currentQuestionSpan,
        totalQuestionsSpan: !!totalQuestionsSpan,
        nextButton: !!nextButton,
        prevButton: !!prevButton,
        endQuizButton: !!endQuizButton,
        dots: dots.length,
        optionElements: optionElements.length
    });

    // Quiz state variables
    const totalQuestions = questionBlocks.length;
    let currentQuestionIndex = 0;
    let answers = new Array(totalQuestions).fill(null);
    let hasStarted = false;

    console.log('Total questions:', totalQuestions);

    // Tooltip content definitions
    const tooltipContent = {
        'city-size': {
            text: `Think globally — how many people live in the city (including suburbs)? Is it a compact town you can walk across in a day, or a sprawling region with multiple city centers?`,
            note: `Note: In this context, a 'small city' means fewer than 500,000 people — this may still feel large depending on your country.`
        },
        'density': {
            text: `How compact or spread out does the city feel? Are buildings closely packed or far apart? Think about how much activity happens in public spaces — not just how many people live there.`,
            note: `This isn't exact — just select the option that best describes the city's overall character.`,
            tip: `Tip: This isn't just total population — it's about how many people live in a given area (km²).`
        },
        'public-transport': {
            text: `Does the city have buses, trams, trains, or a metro? How many routes are there? Are services frequent and easy to reach?\n\nWould a visitor without a car be able to get around easily during the day?\n\nHow affordable is public transport compared to the average income?`
        },
        'cycling': {
            text: `Are there dedicated bike lanes or paths? Are they physically separated from traffic?\n\nCan you travel safely across the city by bike? Are there bike traffic lights, bike parking, or bike-sharing schemes?\n\nHas the city taken action to encourage cycling?`
        },
        'street-layout': {
            text: `How would you describe the overall layout of the city? Is it mostly narrow historic streets, wider avenues in a planned grid, or a mix of old and new areas?`,
            note: `A city doesn't have to fit perfectly — just choose what feels most typical.`
        },
        'tourism': {
            text: `Do you often see tourists in your city? Are there certain times of year when tourist crowds increase a lot?\n\nThink about the presence of tour groups, souvenir shops, or people asking for directions.`,
            tip: `Tip: This includes both international and domestic visitors. This helps reflect how much pressure public space might be under — it's okay to estimate.`
        },
        'car-ownership': {
            text: `Do most households own a car? How often do people drive versus using public transport, biking, or walking?\n\nIs it easy to live in the city without owning a car?\n\nDo most households own a car, or is it common to get around without one?`,
            tip: `Tip: Measured roughly by how many cars there are per 1,000 people. This helps us understand how reliant the city is on driving. If you don't have exact stats — go with your impression.`
        },
        'traffic-congestion': {
            text: `How much time do people lose each day sitting in traffic — especially during rush hours?\n\nIs driving smooth and fast, or do you often get stuck in jams?`,
            tip: `Tip: Consider average delays on common routes, not just worst-case days.`
        }
    };

    // Initialize quiz state
    function initializeQuiz() {
        console.log('Initializing quiz...');
        
        if (totalQuestionsSpan) {
            totalQuestionsSpan.textContent = totalQuestions;
            console.log('Set total questions to:', totalQuestions);
        }
        
        if (progressFill) {
            progressFill.style.width = '0%';
            console.log('Reset progress bar');
        }
        
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = '1';
            console.log('Set current question to 1');
        }
        
        if (endQuizButton) {
            endQuizButton.disabled = true;
            endQuizButton.style.display = 'none';
            console.log('Hidden end quiz button');
        }
        
        if (prevButton) {
            prevButton.disabled = true;
            console.log('Disabled previous button');
        }
        
        if (nextButton) {
            nextButton.disabled = true; // Disabled until option selected
            nextButton.style.display = 'flex';
            console.log('Set next button to disabled but visible');
        }

        // Reset all question blocks
        questionBlocks.forEach((block, index) => {
            const isActive = index === 0;
            block.classList.toggle('active', isActive);
            console.log(`Question block ${index + 1} active:`, isActive);
        });

        // Reset dots
        dots.forEach((dot, index) => {
            const isActive = index === 0;
            dot.classList.toggle('active', isActive);
            console.log(`Dot ${index + 1} active:`, isActive);
        });

        // Reset answers
        answers.fill(null);
        currentQuestionIndex = 0;
        hasStarted = false;
        console.log('Reset quiz state variables');

        // Clear all option selections
        optionElements.forEach(option => {
            option.classList.remove('selected');
            const circle = option.querySelector('.circle');
            if (circle) circle.classList.remove('selected');
        });
        console.log('Cleared all option selections');
    }

    // Update progress and navigation state
    function updateNavigation() {
        console.log('Updating navigation for question:', currentQuestionIndex + 1);
        
        // Update progress bar
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
            console.log('Updated progress to:', progress + '%');
        }
        
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = currentQuestionIndex + 1;
        }

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentQuestionIndex);
        });

        // Update navigation buttons
        if (prevButton) {
            prevButton.disabled = currentQuestionIndex === 0;
        }
        
        const hasCurrentAnswer = answers[currentQuestionIndex] !== null;
        console.log('Current answer exists:', hasCurrentAnswer);
        
        if (currentQuestionIndex === totalQuestions - 1) {
            // Last question
            if (nextButton) nextButton.style.display = 'none';
            if (endQuizButton) {
                endQuizButton.style.display = 'flex';
                endQuizButton.disabled = !hasCurrentAnswer;
                console.log('Showing end quiz button, disabled:', !hasCurrentAnswer);
            }
        } else {
            // Not last question
            if (nextButton) {
                nextButton.style.display = 'flex';
                nextButton.disabled = !hasCurrentAnswer;
                console.log('Showing next button, disabled:', !hasCurrentAnswer);
            }
            if (endQuizButton) {
                endQuizButton.style.display = 'none';
                endQuizButton.disabled = true;
            }
        }
    }

    function showQuestion(index) {
        console.log('Showing question:', index + 1);
        
        if (index < 0 || index >= totalQuestions) {
            console.error('Invalid question index:', index);
            return;
        }
        
        // Hide all questions
        questionBlocks.forEach((block, blockIndex) => {
            block.classList.remove('active');
            console.log(`Question block ${blockIndex + 1} hidden`);
        });
        
        // Show target question
        if (questionBlocks[index]) {
            questionBlocks[index].classList.add('active');
            console.log(`Question block ${index + 1} shown`);
        }
        
        currentQuestionIndex = index;
        updateNavigation();
    }

    // Check if required elements exist before proceeding
    if (!startButton) {
        console.error('Start button not found! Make sure element with id="start-quiz-main" exists');
        return;
    }

    if (!quizApp) {
        console.error('Quiz app container not found! Make sure element with id="quiz-app" exists');
        return;
    }

    if (questionBlocks.length === 0) {
        console.error('No question blocks found! Make sure elements with class="question-block" exist');
        return;
    }

    // Initialize the quiz
    console.log('Calling initializeQuiz...');
    initializeQuiz();

    // Handle start button click
    startButton.addEventListener('click', function(event) {
        console.log('=== START BUTTON CLICKED ===');
        
        // Prevent any default behavior
        event.preventDefault();
        event.stopPropagation();
        
        console.log('Start button clicked - beginning quiz initialization');
        
        const quizSection = document.querySelector('.quiz-section');
        console.log('Quiz section found:', !!quizSection);
        
        if (!quizSection) {
            console.error('Quiz section not found - looking for parent with class .quiz-section');
            return;
        }

        // Toggle the quiz section visibility
        if (quizSection.classList.contains('active')) {
            // Hide quiz section
            quizSection.classList.remove('active');
            quizApp.classList.remove('active');
            const quizContent = document.querySelector('.quiz-content');
            if (quizContent) {
                quizContent.classList.remove('active');
            }
            const navigationControls = document.querySelector('.navigation-controls');
            if (navigationControls) {
                navigationControls.classList.remove('active');
            }
            hasStarted = false;
        } else {
            // Reset quiz state before showing
            initializeQuiz();
            
            // Show quiz section
            quizSection.classList.add('active');
            console.log('Added active class to quiz section');

            // Add active class to the quiz app container and content
            setTimeout(() => {
                console.log('Setting quiz app to active...');
                quizApp.classList.add('active');
                
                const quizContent = document.querySelector('.quiz-content');
                if (quizContent) {
                    quizContent.classList.add('active');
                    console.log('Added active class to quiz content');
                }
                
                hasStarted = true;
                
                // Initialize to first question
                console.log('Showing first question...');
                showQuestion(0);

                // Make sure navigation controls are visible
                const navigationControls = document.querySelector('.navigation-controls');
                if (navigationControls) {
                    navigationControls.classList.add('active');
                    console.log('Shown navigation controls');
                } else {
                    console.warn('Navigation controls not found');
                }
                
                console.log('=== QUIZ INITIALIZATION COMPLETE ===');
            }, 50);
        }
    });

    // Handle option selection
    optionElements.forEach((option, optionIndex) => {
        option.addEventListener('click', function() {
            console.log('Option clicked:', optionIndex, 'value:', this.dataset.value);
            
            const questionBlock = this.closest('.question-block');
            const questionIndex = Array.from(questionBlocks).indexOf(questionBlock);
            const selectedValue = this.dataset.value;

            console.log('Question index:', questionIndex, 'Selected value:', selectedValue);

            // Remove selection from all options in this question
            questionBlock.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
                const circle = opt.querySelector('.circle');
                if (circle) circle.classList.remove('selected');
            });

            // Add selection to clicked option
            this.classList.add('selected');
            const circle = this.querySelector('.circle');
            if (circle) circle.classList.add('selected');

            // Store the answer
            answers[questionIndex] = selectedValue;
            console.log('Stored answer:', selectedValue, 'for question:', questionIndex);
            console.log('All answers:', answers);

            // Update navigation state
            updateNavigation();
        });
    });

    // Handle next button
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            console.log('Next button clicked');
            if (currentQuestionIndex < totalQuestions - 1 && answers[currentQuestionIndex] !== null) {
                showQuestion(currentQuestionIndex + 1);
            } else {
                console.log('Cannot proceed - no answer selected or at last question');
            }
        });
    }

    // Handle previous button
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            console.log('Previous button clicked');
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
    }

    // Handle end quiz button
    if (endQuizButton) {
        endQuizButton.addEventListener('click', function() {
            console.log('End quiz button clicked');
            
            // Verify all answers are present
            const unansweredQuestions = answers.findIndex(answer => answer === null);
            if (unansweredQuestions !== -1) {
                alert(`Please answer all questions before submitting. Question ${unansweredQuestions + 1} is unanswered.`);
                return;
            }

            // Disable button to prevent multiple submissions
            endQuizButton.disabled = true;
            console.log('Submitting quiz with answers:', answers);

            // Prepare form data
            const formData = new FormData();
            const questionKeys = [
                'size', 'density', 'public_transport', 'cycling_infrastructure',
                'street_layout', 'tourism', 'car_ownership', 'traffic_congestion'
            ];
            
            answers.forEach((answer, index) => {
                if (questionKeys[index]) {
                    formData.append(questionKeys[index], answer);
                    console.log('Added to form:', questionKeys[index], '=', answer);
                }
            });

            // Submit the quiz
            fetch('/tool', {  // Changed from '/' to '/tool' to match your Flask route
                method: 'POST',
                body: formData
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log('Quiz result:', result);
                
                if (result.error) {
                    alert('Error: ' + result.error);
                    endQuizButton.disabled = false;
                    return;
                }

                // Redirect to the corresponding city result page
                const cityName = result.city.toLowerCase();
                const accuracy = Math.round(result.similarity * 100);
                // Store all scores in session storage for other city pages
                if (result.all_scores) {
                    console.log('Storing city scores in sessionStorage:', result.all_scores);
                    sessionStorage.setItem('cityScores', JSON.stringify(result.all_scores));
                }
                window.location.href = `/result_${cityName}?accuracy=${accuracy}`;
            })
            .catch(error => {
                console.error('Error submitting quiz:', error);
                alert('Error submitting quiz: ' + error.message);
                endQuizButton.disabled = false;
            });
        });
    }

    // Setup tooltips
    questionBlocks.forEach((block, index) => {
        const button = block.querySelector('.see-more-btn');
        if (button) {
            const questionTypes = [
                'city-size', 'density', 'public-transport', 'cycling',
                'street-layout', 'tourism', 'car-ownership', 'traffic-congestion'
            ];
            
            const questionType = questionTypes[index];
            if (questionType) {
                button.setAttribute('data-question', questionType);

                // Create tooltip content
                const content = tooltipContent[questionType];
                if (content) {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'tooltip-content';

                    if (content.text) {
                        const paragraphs = content.text.split('\n\n');
                        paragraphs.forEach(text => {
                            const textP = document.createElement('p');
                            textP.textContent = text.trim();
                            tooltip.appendChild(textP);
                        });
                    }

                    if (content.note) {
                        const noteP = document.createElement('p');
                        noteP.className = 'note';
                        noteP.textContent = content.note;
                        tooltip.appendChild(noteP);
                    }

                    if (content.tip) {
                        const tipP = document.createElement('p');
                        tipP.className = 'tip';
                        tipP.textContent = content.tip;
                        tooltip.appendChild(tipP);
                    }

                    button.appendChild(tooltip);
                }
            }
        }
    });

    console.log('Quiz initialization script loaded successfully');
});