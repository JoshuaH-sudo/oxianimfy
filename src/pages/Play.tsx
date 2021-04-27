import React, { useState, useContext } from 'react';
import {
    EuiButton,
    EuiPanel
} from '@elastic/eui';
import { databaseContext } from '../App';

const Page: React.FC = () => {

    const db_context = useContext(databaseContext);
    // const tasks_list = db_context.retriveItem
    return (
        <EuiPanel paddingSize="l">

        </EuiPanel>
    );
};

export default Page;
