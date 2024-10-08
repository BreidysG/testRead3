document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const questionOptions = document.querySelector('.question-options'); // Contenedor de las opciones de pregunta
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        { question: "¿Quiénes son los personajes de la historia?", answers: ["Un árbol y un niño", "Un niño, su familia y un árbol", "El bosque y un niño", "El niño, las manzanas y el árbol"], correctAnswer: "Un árbol y un niño" },
        { question: "¿Qué enseñanza deja la historia?", answers: ["La importancia de la amistad y su generosidad", "En la amistad, lo material no es lo realmente importante", "Hasta donde el amor puede hacer que uno entregue todo por la felicidad del otro", "Todas las respuestas son correctas"], correctAnswer: "Todas las respuestas son correctas" },
        { question: "¿Cuál es la idea principal de la lectura?", answers: ["La amistad que surge entre un niño y un árbol, y cuando crece el niño, cambian sus necesidades y como por amor el árbol no duda y le entrega todo lo que tiene", "La amistad entre un niño y un árbol, que al crecer el niño se olvida de su amigo", "Cómo el niño usa a su amigo el árbol, para que le ayude a suplir sus necesidades materiales", "El niño que disfruta de la amistad del árbol hasta que se muda de ciudad"], correctAnswer: "La amistad que surge entre un niño y un árbol, y cuando crece el niño, cambian sus necesidades y como por amor el árbol no duda y le entrega todo lo que tiene" },
        { question: "¿Cuál es el título de la lectura?", answers: ["El niño y el árbol", "Amigos para siempre", "El árbol generoso", "La generosidad dentro de la amistad"], correctAnswer: "El árbol generoso" },
        { question: "¿Qué pasó con el niño y el árbol al final?", answers: ["El árbol se quedó solo", "El árbol aun en su condición siguió ayudando a su amigo", "El niño creció y se fue de la ciudad", "Todas las respuestas son correctas"], correctAnswer: "El árbol aun en su condición siguió ayudando a su amigo" }
    ];      
    // Función para contar las palabras en el texto
    function countWords(text) {
        return text.split(/\s+/).length;
    }

    // Función para calcular la velocidad de lectura
    function calculateReadingSpeed(startTime, endTime, wordCount) {
        const minutes = (endTime - startTime) / 60000; // Convertir a minutos
        return Math.round(wordCount / minutes);
    }

    // Función para mostrar las preguntas del cuestionario
    function displayQuestions() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>${question.question}</p>
                <div class="question-options">
                    ${question.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="answer${index}" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            questionList.appendChild(listItem);
        });
    }

    // Evento para comenzar el test al hacer clic en "Empezar"
    startButton.addEventListener('click', function() {
        textContainer.classList.remove('hidden');
        paragraphInit.classList.add("hidden");
        startButton.classList.add('hidden');
        startTime = Date.now();
        // Iniciar el contador
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Función para actualizar el contador de tiempo
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
        timerValue.textContent = currentTime;
        time.push(currentTime);
    }

    // Evento para finalizar el test al hacer clic en "Terminar Test"
    finishButton.addEventListener('click', function() {
        clearInterval(timerInterval); // Detener el contador
        titleInit.classList.add("hidden");
        textContainer.classList.add('hidden');
        finishButton.classList.add('hidden');
        endTime = Date.now();
        wordCount = countWords(document.getElementById('textToRead').textContent);
        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
        questionnaire.classList.remove('hidden');
        displayQuestions();
    });

    // Evento para enviar el cuestionario
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!quizCompleted) {
            let anyAnswerSelected = true; // Inicialmente, asumimos que al menos una opción está seleccionada

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (!selectedAnswer) { // Si ninguna opción está seleccionada para alguna pregunta
                    anyAnswerSelected = false;
                    return;
                }
            });

            if (!anyAnswerSelected) {
                alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
                return;
            }

            let correctAnswers = 0;
            let totalQuestions = questions.length;
            
            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                    correctAnswers++;
                }
            });
            
            let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
            let timeResult = time[time.length-1];
            
            quizCompleted = true;
            results.classList.remove('hidden');
            questionnaire.classList.add('hidden');
            document.getElementById('wordCountValue').textContent = wordCount;
            document.getElementById('readingSpeedValue').textContent = `${calculateReadingSpeed(startTime, endTime, wordCount)}`;
            document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
            document.getElementById('timeResultValue').textContent = `${timeResult}`;
            document.getElementById('results').innerHTML += '<p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p><p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>'
            ;

            
            
        }
    });

});
