export default class Sequence {
  /**
   * Creates a new instance of Sequence.
   * @param {Function} iterator Iterator function applied to each entry during the sequence run.
   */
  constructor({ iterator, initialValue }) {
    this.entries = [];
    this.initialValue = initialValue || {};
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
  breakIteration = () => {
    this.shouldRun = false;
    return this;
  }

  /**
   * Runs the sequence with the current entries.
   */
  async run() {
    const { entries } = this;
    if (entries.length === 0) return;

    let acc = this.initialValue;

    for (let index = 0; index < entries.length; index++) {
      if (!this.shouldRun) break;

      const entry = entries[index];
      const isLast = ((entries.length - 1) === index);

      const resolved = await entry.resolver({ entries });

      acc = this.iterator({
        acc,
        entries,
        variables: entry.variables,
        resolved,
        index,
        isLast,
        breakIteration: this.breakIteration
      });
    }

    return acc;
  }
}
