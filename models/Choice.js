export class Choice {
  constructor(description, nextNodeId, isDefault = false) {
      this.description = description;
      this.nextNodeId = nextNodeId;
      this.isDefault = isDefault;
  }
}