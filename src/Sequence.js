export default class Sequence {
  constructor({ iterator }) {
    this.entries = [];
    this.iterator = iterator;
    this.shouldRun = false;
    return this;
  }

  add(entry) {
    this.entries.push(entry);
    return this;
  }

  stop = () => {
    this.shouldRun = true;
    return this;
  }

  async run() {
    const { entries } = this;
    if (entries.length === 0) return;
    let acc = {};

    for (let i = 0; i < entries.length; i++) {
      if (this.shouldRun) break;

      const entry = entries[i];
      const isLast = ((entries.length - 1) === i);

      const resolved = await entry.resolver({ entries: entries });
      acc = this.iterator({
        acc,
        entries: entries,
        entry,
        resolved,
        index: i,
        isLast,
        stop: this.stop
      });
    }

    return acc;
  }

}
