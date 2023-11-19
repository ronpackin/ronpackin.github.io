import { loadNarratives } from './loadNarrative.js';

let narratives;
let timer;
let countdown;
const defaultDecisionTime = 30;
let journey = [];

async function initGame() {
    narratives = await loadNarratives(); // Load and set narratives
    displayNarrative('1'); // Start the game
}

function getJourneySummary() {
    return journey.join('\n');
}

function displayNarrative(nodeId) {
    const node = narratives[nodeId];
    if (!node || !node.story) {
      console.log(nodeId, node)
      document.getElementById('narrative').innerText = "Your journey has ended.\n\n" + getJourneySummary();
      return;
    }
    journey.push('Situation: ' + node.story);
    document.getElementById('narrative').innerText = node.story;
    document.getElementById('backgroundImage').style.backgroundImage = `url('backgrounds/1.png')`;
    // document.getElementById('backgroundImage').style.backgroundImage = `url('backgrounds/${nodeId}.png')`;
    document.getElementById('externalResource').innerHTML = node.externalSource ? `<a target="_blank" href="${node.externalSource.url}">ⓘ ${node.externalSource.description}</a>` : '';
    
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    let defaultChoice;
    node.choices.forEach((choice, index) => {
        if (choice.isDefault) {
            defaultChoice = choice;
        }
        if (!narratives[choice.nextNodeId]) {
            console.error(`Scene for next node id ${choice.nextNodeId} is missing from node ${nodeId}`);
        }
        const button = document.createElement('button');
        button.innerText = choice.description;
        button.onclick = () => selectChoice(choice);
        choicesContainer.appendChild(button);
    });

    startTimer(defaultDecisionTime, defaultChoice);
}

function startTimer(timeLimit, defaultChoice) {
    clearInterval(timer);
    countdown = timeLimit;

    const timerElement = document.getElementById('timer');
    timer = setInterval(() => {
        countdown--;
        timerElement.innerText = `Time remaining: ${countdown} seconds`;
        if (countdown <= 0) {
            clearInterval(timer);
            selectChoice(defaultChoice);
        }
    }, 1000);
}

function selectChoice(choice) {
    journey.push('Choice: ' + choice.description);
    if (choice.nextNodeId === 'end') {
        endGame();
    } else {
        displayNarrative(choice.nextNodeId);
    }
}

function endGame() {
    clearInterval(timer);
    document.getElementById('gameContainer').innerText = 'Game Over';
}

initGame(); // Initialize the game
