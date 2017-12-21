/**
 * Sequence.
 */
export default class Sequence {
  /**
   * Creates a new instance of Sequence.
   * @param {Function} iterator Iterator function applied to each entry during the sequence run.
   */
  constructor({ iterator }) {
    this.entries = [];
    this.iterator = iterator;
    this.shouldRun = true;
    return this;
  }

  /**
   * Adds the given entry to the sequence.
   * @param {SequenceEntry} entry
   */
  add(entry) {
    this.entries.push(entry);
    return this;
  }

  /**
   * Stops the iteration of the running sequence.
   */
  stop = () => {
    this.shouldRun = false;
    return this;
  }

  /**
   * Run the sequence with the current entries.
   */
  async run() {
    const { entries } = this;
    if (entries.length === 0) return;
    let acc = {};

    for (let i = 0; i < entries.length; i++) {
      if (!this.shouldRun) break;

      const entry = entries[i];
      const isLast = ((entries.length - 1) === i);

      const resolved = await entry.resolver({ entries });

      acc = this.iterator({
        acc,
        entries,
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
