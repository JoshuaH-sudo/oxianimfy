import React, { useState } from 'react';
import {
  EuiButton,
  EuiPanel
} from '@elastic/eui';

const Page: React.FC = () => {

  const name = "start"

  return (
    <EuiPanel paddingSize="l" >
      <EuiButton fill href="#/task-creation">Create a New Task</EuiButton>
      <EuiButton fill href="#/task_selection">Do tasks for today</EuiButton>
    </EuiPanel>
  );
};

export default Page;
