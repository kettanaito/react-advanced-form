import { fromJS } from 'immutable';
import { expect } from 'chai';
import getRules, { getRulesGroup } from './getRules';
import * as recordUtils from '../recordUtils';

const schema = fromJS({
  type: {
    number: {
      ruleOne: ({ value }) => value,
      ruleTwo: ({ value }) => value
    }
  },
  name: {
    fieldOne: ({ value }) => (value > 3)
  }
});

const fieldOne = recordUtils.createField({
  type: 'number',
  name: 'fieldOne'
});

const fieldTwo = recordUtils.createField({
  type: 'text',
  name: 'fieldTwo'
});

describe('getRules', () => {
  it('Retrieves the rules for the given rule selector (getRulesGroup)', () => {
    const typeRules = getRulesGroup(fieldProps, schema, 'type');
    const nameRules = getRulesGroup(fieldProps, schema, 'name');

    expect(typeRules).not.to.be.undefined;
    expect(nameRules).not.to.be.undefined;
    expect(typeRules.equals(schema.getIn(['type', fieldProps.get('type')])));
    expect(nameRules.equals(schema.getIn(['name', fieldProps.get('name')])));
  });

  it('Returns a collection of rules for the given field (getRules)', () => {
    const fieldOneRules = getRules(fieldOne, schema);

    expect(fieldOneRules).to.not.be.undefined;
    expect(fieldOneRules.toJS()).to.be.an.instanceOf(Object).that.has.keys(['type', 'name']);
    expect(fieldOneRules.get('type').equals(schema.getIn(['type', fieldPath.get('type')])));
    expect(fieldOneRules.get('name').equals(schema.getIn(['name', fieldPath.get('name')])));

    const fieldTwoRules = getRules(fieldTwo, schema);
    expect(fieldTwoRules).not.to.be.undefined;
    expect(fieldTwoRules.toJS()).to.be.an.instanceOf(Object).
  });
});
