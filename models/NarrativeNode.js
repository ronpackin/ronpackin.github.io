export class NarrativeNode {
  constructor(story, choices, backgroundImage, externalSource) {
      this.story = story;
      this.choices = choices; // Array of Choice instances
      this.backgroundImage = backgroundImage; // URL to background image
      this.externalSource = externalSource;
  }
}
