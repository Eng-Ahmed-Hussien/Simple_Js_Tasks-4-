// DOM elements
const wordText = document.querySelector(".word");
const hintText = document.querySelector(".hint span");
const timeText = document.querySelector(".time b");
const inputField = document.querySelector("input");
const refreshBtn = document.querySelector(".refresh-word");
const checkBtn = document.querySelector(".check-word");

// Function to fetch JSON data
const fetchWords = async () => {
  try {
    const response = await fetch('./data.json'); // Fetch data.json file
    if (!response.ok) {
      throw new Error('Failed to fetch words data');
    }
    const data = await response.json(); // Parse JSON response
    return data.words || []; // Return the 'words' array from JSON, or empty array if not present
  } catch (error) {
    console.error('Error fetching words:', error);
    return []; // Return empty array on error
  }
};

// Function to initialize the timer
const initTimer = (maxTime) => {
  let timer = setInterval(() => {
    if (maxTime > 0) {
      maxTime--;
      timeText.innerText = maxTime;
    } else {
      clearInterval(timer);
      alert(`Time's up! The correct word was "${correctWord.toUpperCase()}".`);
      initGame();
    }
  }, 1000);
};

// Function to initialize the game
const initGame = async () => {
  try {
    const words = await fetchWords(); // Wait for data to be fetched
    if (!words || words.length === 0) {
      throw new Error('No words data available');
    }

    // Game initialization logic
    const randomObj = words[Math.floor(Math.random() * words.length)];
    const scrambledWord = scrambleWord(randomObj.word);

    wordText.innerText = scrambledWord;
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value = '';
    inputField.setAttribute('maxlength', correctWord.length);

    initTimer(60); // Start timer with 60 seconds
  } catch (error) {
    console.error('Error initializing game:', error);
    alert('Failed to load words data. Please try again later.');
  }
};

// Function to scramble a word
const scrambleWord = (word) => {
  const wordArray = word.split("");
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }
  return wordArray.join("");
};

// Function to check the user's input word
const checkWord = () => {
  const userWord = inputField.value.trim().toLowerCase();
  if (!userWord) {
    alert("Please enter a word to check!");
    return;
  }
  if (userWord !== correctWord) {
    alert(`Oops! "${userWord}" is not the correct word.`);
  } else {
    alert(`Congratulations! "${correctWord.toUpperCase()}" is the correct word.`);
  }
  initGame(); // Start a new game after checking
};

// Event listeners for refresh and check buttons
refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);

// Initialize the game when the page loads
initGame();
