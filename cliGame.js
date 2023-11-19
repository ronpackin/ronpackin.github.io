const narratives = require('./loadNarrative.js')();
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function runGame() {
    let currentNodeId = '1';

    while (currentNodeId !== 'end') {
        const currentNode = narratives[currentNodeId];

        console.log(currentNode.story);
        currentNode.choices.forEach((choice, index) => {
            console.log(`${index + 1}. ${choice.description}`);
        });

        const answer = await askQuestion('Your choice: ');
        const choiceIndex = parseInt(answer) - 1;

        if (choiceIndex >= 0 && choiceIndex < currentNode.choices.length) {
            currentNodeId = currentNode.choices[choiceIndex].nextNodeId;
        } else {
            console.log('Invalid choice, please try again.');
        }
    }

    rl.close();
}

runGame();
