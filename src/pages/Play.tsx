import React, { useState, useContext } from 'react';
import {
    EuiButton,
    EuiPanel,
    EuiText,
    EuiFlexGroup,
    EuiFlexItem
} from '@elastic/eui';
import { databaseContext } from '../App';
import { ITaskData } from '../utils/custom_types'

const Page: React.FC = () => {
    const db_context = useContext(databaseContext);

    const [tasks_list, set_tasks_list] = useState<ITaskData[]>([]);
    const [current_task_index, set_current_task_index] = useState<number>(0);

    db_context.getTasks().then((tasks: ITaskData[]) => {
        set_tasks_list(tasks)
    })

    const intro = (
        <EuiText grow={false}>
            <h1>{tasks_list[current_task_index].name}</h1>

            <EuiPanel paddingSize="l">
                <p>{tasks_list[current_task_index].desc}</p>
            </EuiPanel>

        </EuiText>
    )

    const counter = (
        <EuiFlexGroup>
            <EuiFlexItem>
                <EuiButton>left</EuiButton>
            </EuiFlexItem>
            <EuiFlexItem>{tasks_list[current_task_index].unit}</EuiFlexItem>
            <EuiFlexItem>
                <EuiButton>left</EuiButton>
            </EuiFlexItem>
        </EuiFlexGroup>
    )
    return (
        <EuiPanel paddingSize="l">
            {tasks_list != [] ? intro : ''}
            {tasks_list != [] ? counter : ''}
        </EuiPanel>
    );
};

export default Page;
