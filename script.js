// 載入題庫
let questions = [];
let currentQuiz = [];
let userAnswers = [];

// 從JSON載入題庫
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.chapters;
        startNewQuiz();
    });

// 開始新測驗
function startNewQuiz() {
    // 按比例隨機選題
    currentQuiz = [];
    userAnswers = [];
    
    // 計算各章節應選題數
    const chapter1Count = 10;
    const chapter2Count = 16;
    const chapter3Count = 9;
    const chapter4Count = 5;
    
    // 隨機選題
    currentQuiz = currentQuiz.concat(
        getRandomQuestions(questions[0].questions, chapter1Count),
        getRandomQuestions(questions[1].questions, chapter2Count),
        getRandomQuestions(questions[2].questions, chapter3Count),
        getRandomQuestions(questions[3].questions, chapter4Count)
    );
    
    // 打亂題目順序
    currentQuiz = shuffleArray(currentQuiz);
    
    displayQuiz();
}

// 顯示測驗
function displayQuiz() {
    const container = document.getElementById('question-container');
    container.innerHTML = '';
    
    currentQuiz.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p>${index+1}. ${q.text}</p>
            <form id="q${index}">
                ${q.options.map(opt => `
                    <label>
                        <input type="radio" name="q${index}" value="${opt.charAt(1)}">
                        ${opt}
                    </label><br>
                `).join('')}
            </form>
        `;
        container.appendChild(questionDiv);
    });
}

// 提交答案
document.getElementById('submit-btn').addEventListener('click', () => {
    // 收集答案
    for (let i = 0; i < currentQuiz.length; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        userAnswers[i] = selected ? selected.value : null;
    }
    
    // 計算分數
    const score = calculateScore();
    displayResults(score);
});

// 計算分數
function calculateScore() {
    let correct = 0;
    currentQuiz.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            correct++;
        }
    });
    return (correct / currentQuiz.length) * 100;
}

// 顯示結果
function displayResults(score) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>測驗結果</h2>
        <p>您的得分: ${score.toFixed(1)}%</p>
        <div id="answer-details"></div>
        <button id="restart-btn">重新測驗</button>
    `;
    
    // 顯示詳細答案
    const detailsDiv = document.getElementById('answer-details');
    currentQuiz.forEach((q, index) => {
        const isCorrect = userAnswers[index] === q.answer;
        detailsDiv.innerHTML += `
            <div class="answer ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>第 ${index+1} 題</strong>: ${q.text}</p>
                <p>您的答案: ${userAnswers[index] || '未作答'} | 
                   正確答案: ${q.answer}</p>
                ${!isCorrect ? `<p class="explanation">說明: ${getExplanation(q.id)}</p>` : ''}
            </div>
        `;
    });
    
    // 重新測驗按鈕
    document.getElementById('restart-btn').addEventListener('click', startNewQuiz);
}

// 輔助函數
function getRandomQuestions(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// 根據題號獲取解釋 (需預先準備)
function getExplanation(questionId) {
    // 這裡可以添加更多詳細解釋
    return "請參考教材相關章節內容。";
}