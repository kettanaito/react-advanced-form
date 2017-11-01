import React, { Children } from 'react';

export const fieldTypes = ['Field'];

export const mapChildrenToFields = (children) => {
  let fields = {};

  Children.toArray(children).forEach((Child) => {
    if (!React.isValidElement(Child)) return;
    const { props: childProps } = Child;

    if (fieldTypes.includes(Child.type.name)) {
      const { name, value, initialValue } = childProps;

      fields[name] = {
        value: value || initialValue || ''
      };
    }

    if (childProps.children) {
      const parsedChildren = mapChildrenToFields(childProps.children);
      if (Object.keys(parsedChildren)) {
        fields = {
          ...fields,
          ...parsedChildren
        };
      }
    }
  });

  return fields;
};
