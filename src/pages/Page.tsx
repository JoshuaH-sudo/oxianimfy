import React, { useContext } from 'react';
import {
  EuiButton,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui';
import { databaseContext } from '../App';

const Page: React.FC = () => {
  const db_context = useContext(databaseContext)

  return (
    <EuiPanel paddingSize="l" >
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiButton fill href="#/task-creation">Create a New Task</EuiButton>
        </EuiFlexItem>
        
        <EuiFlexItem grow={false}>
          <EuiButton fill href="#/task_selection">Do tasks for today</EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton fill href="#/edit-tasks">Edit tasks</EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiButton fill onClick={() => {db_context.app_storage.clear()}}>Clear data</EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>

    </EuiPanel>
  );
};

export default Page;
