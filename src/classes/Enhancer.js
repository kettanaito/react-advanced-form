export default class Enhancer {
  constructor(Field) {
    const EnhancedField = Field;
    EnhancedField.prototype.interceptors = {};

    EnhancedField.propTypes = {
      ...Field.propTypes,
      ...this.extendPropTypes(EnhancedField)
    };

    EnhancedField.defaultProps = {
      ...EnhancedField.defaultProps,
      ...this.extendDefaultProps(EnhancedField)
    };
    console.log('must apply enhancer to field', EnhancedField);

    this.EnhancedField = EnhancedField;
    this.enhancerDidApply(EnhancedField);

    return EnhancedField;
  }

  enhancerDidApply() {}
  extendPropTypes() {}
  extendDefaultProps() {}

  addInterceptor(eventName, callback) {
    const existingInterceptors = this.EnhancedField.prototype.interceptors[eventName] || [];
    this.EnhancedField.prototype.interceptors[eventName] = existingInterceptors.concat(callback);

    return this.EnhancedField;
  }
}
