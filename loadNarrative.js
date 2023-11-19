import { Choice, ExternalSource, NarrativeNode } from './models/index.js';

async function loadNarratives() {
    const response = await fetch('narrative.json');
    const data = await response.json();

    // Deserialize external sources
    const externalSources = {};
    for (const [id, source] of Object.entries(data.externalSources || {})) {
        externalSources[id] = new ExternalSource(id, source.url, source.description);
    }

    // Deserialize narrative nodes
    const narrativeNodes = {};
    for (const [id, node] of Object.entries(data.nodes)) {
        const choices = node.choices.map(c => new Choice(c.description, c.nextNodeId, c.default ?? false));
        const externalSourceId = node.externalSourceId ? externalSources[node.externalSourceId] : null;

        // Validation checks that there is 1 and only 1 default choice
        if (choices.filter(c => c.isDefault).length != 1) {
            console.error(`Invalid default choices for node ${id}`, choices);
        }

        narrativeNodes[id] = new NarrativeNode(node.story, choices, node.backgroundImage, externalSourceId);
    }

    return narrativeNodes; 
}

export { loadNarratives };
