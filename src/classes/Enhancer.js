/**
 * Generic enhancer class.
 * Enhancer is an independent extension unit, which enhances the functionality
 * of the wrapped field. It may introduce new props, intercept essential field events
 * and change the payload of the transfered events data to mutate the behavior of the field.
 */
import invariant from 'invariant';

export default class Enhancer {
  constructor(props, context) {
    this.props = props;
    this.context = context;

    const { form } = this.context;

    invariant(form, 'Cannot create an instance of Enhancer. Expected exposed "form" context property, ' +
      'but got: %s. Make sure to enhance a valid field component which has a parent <Form>.', form);

    form.interceptors.fieldChange.push(this.interceptChange.bind(this));

    return this;
  }
}
