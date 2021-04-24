import React, { useState } from 'react';
import {
  EuiButton
} from '@elastic/eui';

const Page: React.FC = () => {

  const name = "start"

  return (
    <EuiButton fill href="/task">Create a New Task</EuiButton>
  );
};

export default Page;
