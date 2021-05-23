import React, { useState } from 'react';
import {
  EuiButton,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui';

const Page: React.FC = () => {

  const name = "start"

  return (
    <EuiPanel paddingSize="l" >
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiButton fill href="#/task-creation">Create a New Task</EuiButton>
        </EuiFlexItem>
        
        <EuiFlexItem grow={false}>
          <EuiButton fill href="#/task_selection">Do tasks for today</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>

    </EuiPanel>
  );
};

export default Page;
