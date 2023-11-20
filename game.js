import { loadNarratives } from "./loadNarrative.js";

let narratives;
let timer;
let countdown;
const defaultDecisionTime = 30;
let journey = [];

async function initGame() {
	narratives = await loadNarratives(); // Load and set narratives
	displayNarrative("1");
}

function getJourneySummary() {
	return journey.join("\n");
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
	document.getElementById(
		"backgroundImage"
	).style.backgroundImage = `url('backgrounds/1.png')`;
	// document.getElementById('backgroundImage').style.backgroundImage = `url('backgrounds/${nodeId}.png')`;
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
