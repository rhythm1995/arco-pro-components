import * as React from 'react';
import { mount } from 'enzyme';
import mountTest from '../../../../tests/mountTest';
import ProTable from '../index';

mountTest(ProTable);

describe('ProTable', () => {
  it('render ProTable correctly', () => {
    const component = mount(<ProTable />);
    expect(component).toBeTruthy();
  });
});
