const VERSES_URL = 'https://raw.githubusercontent.com/Yashank06/bhagavad-gita-app/main/verses.json';

let verses = []; // All verses from JSON
let currentLanguage = 'en'; // Default language is English
let currentVerse = null; // Store the current verse

// Fetch the verses from the hosted JSON file
fetch(VERSES_URL)
  .then(response => response.json())
  .then(data => {
    verses = data;
    displayRandomVerse();
  })
  .catch(error => console.error('Error loading verses:', error));

// Function to display a random verse
function displayRandomVerse() {
  if (verses.length === 0) return;

  const randomIndex = Math.floor(Math.random() * verses.length);
  currentVerse = verses[randomIndex]; // Store the current verse
  displayVerse(currentVerse);
}

// Function to display a specific verse
function displayVerse(verse) {
  const verseCard = document.getElementById('verse-card');
  verseCard.classList.remove('visible');

  setTimeout(() => {
    document.getElementById('chapter-number').textContent = verse.chapter;
    document.getElementById('verse-number').textContent = verse.verse_number;
    document.getElementById('subject').textContent = verse.subject;
    document.getElementById('verse').textContent = verse.verse[currentLanguage] || verse.verse['en'];
    document.getElementById('meaning').textContent = verse.meaning[currentLanguage] || verse.meaning['en'];
    document.getElementById('explanation').textContent = verse.explanation[currentLanguage] || verse.explanation['en'];
    document.getElementById('solution').textContent = verse.solution[currentLanguage] || verse.solution['en'];
    verseCard.classList.add('visible');
  }, 300); // Match the transition duration
}

// Function to search for verses by chapter and verse number
function searchVerses() {
  const chapter = parseInt(document.getElementById('chapter-input').value);
  const verseNumber = parseInt(document.getElementById('verse-input').value);

  if (isNaN(chapter) || chapter < 1 || chapter > 18) {
    alert('Please enter a valid chapter number (1–18).');
    return;
  }

  if (isNaN(verseNumber) || verseNumber < 1) {
    alert('Please enter a valid verse number.');
    return;
  }

  const foundVerse = verses.find(verse =>
    verse.chapter === chapter && verse.verse_number === verseNumber
  );

  if (foundVerse) {
    displayVerse(foundVerse);
  } else {
    alert(`No verse found for Chapter ${chapter}, Verse ${verseNumber}.`);
  }
}

// Function to share the current verse
function shareVerse() {
  const subject = document.getElementById('subject').textContent;
  const verse = document.getElementById('verse').textContent;
  const meaning = document.getElementById('meaning').textContent;
  const explanation = document.getElementById('explanation').textContent;
  const solution = document.getElementById('solution').textContent;

  const shareText = `Subject: ${subject}\nVerse: ${verse}\nMeaning: ${meaning}\nExplanation: ${explanation}\nSolution: ${solution}\n\nFind more inspiration at [Your App URL]`;

  if (navigator.share) {
    navigator.share({
      title: 'Bhagavad Gita Verse',
      text: shareText,
    });
  } else {
    alert('Sharing is not supported in your browser. Copy the text below:\n\n' + shareText);
  }
}

// Function to toggle dark mode
function toggleDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

  if (document.body.classList.contains('dark-mode')) {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  document.getElementById('dark-mode-toggle').innerHTML = '<i class="fas fa-moon"></i>';
}

// Event Listeners
document.getElementById('random-verse-btn').addEventListener('click', displayRandomVerse);
document.getElementById('search-btn').addEventListener('click', searchVerses);
document.getElementById('share-btn').addEventListener('click', shareVerse);
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Function to toggle translation
function toggleTranslation() {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en'; // Toggle between English and Hindi
  if (currentVerse) {
    displayVerse(currentVerse); // Re-render the current verse in the new language
  }
}

// Event listener for the translate button
document.getElementById('translate-btn').addEventListener('click', toggleTranslation);

// Display a random verse on page load
window.onload = displayRandomVerse;

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}