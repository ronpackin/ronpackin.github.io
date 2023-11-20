import { loadNarratives } from "./loadNarrative.js";

let narratives;
let timer;
let countdown;
const defaultDecisionTime = 30;
let journey = [];
const endGameSummary = "Ultimately, while your character shows moments of compassion and a desire for peace, the decisions to support and actively participate in a terrorist organization's activities have negative consequences, contributing to the perpetuation of violence and terrorism.\n\n Thankfully you've managed to evacuate the situation and can hopefully move forward to finding peace."

async function initGame() {
	narratives = await loadNarratives(); // Load and set narratives
	displayNarrative("1");
}

function setBackgroundImage(nodeId) {
  const imageUrl = `backgrounds/${nodeId}.png`;
  const fallbackImageUrl = 'backgrounds/1.png';
  const backgroundImageElement = document.getElementById('backgroundImage');

  // Create an image object
  let img = new Image();

  // Set the src and try to load the image
  img.src = imageUrl;

  // On successful load, set the backgroundImage
  img.onload = () => {
      backgroundImageElement.style.backgroundImage = `url('${imageUrl}')`;
  };

  // On error, set the fallback image
  img.onerror = () => {
      backgroundImageElement.style.backgroundImage = `url('${fallbackImageUrl}')`;
  };
}

function getJourneySummary() {
  return endGameSummary
	// return journey.join("\n");
}

function setEndGameState() {
	document.getElementById("narrative").innerText =
		"Your journey has ended.\n\n" + getJourneySummary();
	setChoices([
		{
			description: "Start over",
			nextNodeId: "1",
		},
	]);
	document.getElementById("externalResource").innerHTML = node.externalSource
		? `<a target="_blank" href="http://www.google.com">ⓘ Explore resources on how to free Palestine (Link to Maccabank)</a>`
		: "";
}

function setChoices(choices) {
	const choicesContainer = document.getElementById("choices");
	choicesContainer.innerHTML = "";
	let defaultChoice;
	choices.forEach((choice, index) => {
		if (choice.isDefault) {
			defaultChoice = choice;
		}
		if (!narratives[choice.nextNodeId]) {
			console.error(
				`No Scene available for node id ${choice.nextNodeId}`
			);
		}
		const button = document.createElement("button");
		button.innerText = choice.description;
		button.onclick = () => selectChoice(choice);
		choicesContainer.appendChild(button);
	});
	return defaultChoice;
}

function displayNarrative(nodeId) {
	if (nodeId === "1") {
		journey = [];
	}
	const node = narratives[nodeId];
	if (!node || !node.story) {
		console.log(nodeId, node);
		setEndGameState();
		return;
	}
	journey.push("Situation: " + node.story);
	document.getElementById("narrative").innerText = node.story;
  setBackgroundImage(nodeId);
	document.getElementById("externalResource").innerHTML = node.externalSource
		? `<a target="_blank" href="${node.externalSource.url}">ⓘ ${node.externalSource.description}</a>`
		: "";

	const defaultChoice = setChoices(node.choices);
  if (defaultChoice) {
    startTimer(defaultDecisionTime, defaultChoice);
  }
}

function startTimer(timeLimit, defaultChoice) {
	clearInterval(timer);
	countdown = timeLimit;

	const timerElement = document.getElementById("timer");
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
	journey.push("Choice: " + choice.description);
	if (choice.nextNodeId === "end") {
		endGame();
	} else {
		displayNarrative(choice.nextNodeId);
	}
}

function endGame() {
	clearInterval(timer);
	document.getElementById("gameContainer").innerText = "Game Over";
}

initGame(); // Initialize the game
