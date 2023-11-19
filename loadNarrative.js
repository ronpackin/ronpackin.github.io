import { Choice, ExternalSource, NarrativeNode } from './models/index.js';

async function loadNarratives() {
    const response = await fetch('narrative.json');
    const data = await response.json();

    // Deserialize narrative nodes
    const narrativeNodes = {};
    for (const [id, node] of Object.entries(data.nodes)) {
      console.log(node);
        const choices = node.choices.map(c => new Choice(c.description, c.nextNodeId, c.default ?? false));
        let externalSource = node.externalSource;
        if (externalSource) {
          externalSource = new ExternalSource(externalSource.url, externalSource.description);
        }
        // Validation checks that there is 1 and only 1 default choice
        if (choices.filter(c => c.isDefault).length != 1) {
            console.error(`Invalid default choices for node ${id}`, choices);
        }

        narrativeNodes[id] = new NarrativeNode(node.story, choices, node.backgroundImage, externalSource);
    }

    return narrativeNodes; 
}

export { loadNarratives };
