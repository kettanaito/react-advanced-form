import Field from './Field';

/* Classes which extend Field without changes */
export class Input extends Field {
  static displayName = 'Field.Input';
}

export class Select extends Field {
  static displayName = 'Field.Select';
}

export Group from './Group';
