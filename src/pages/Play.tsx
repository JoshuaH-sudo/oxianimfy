import React, { useState, useContext, useEffect } from 'react';
import {
    EuiButton,
    EuiPanel,
    EuiText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPageContent,
    EuiPageBody,
    EuiPage
} from '@elastic/eui';
import { databaseContext } from '../App';
import { ITaskData } from '../utils/custom_types'

const Page: React.FC = () => {
    const db_context = useContext(databaseContext);

    const [tasks_list, set_tasks_list] = useState<ITaskData[]>([]);
    const [current_task_index, set_current_task_index] = useState<number>(0);

    let intro = null;
    let counter = null;

    useEffect(() => {
        db_context.getTasks().then((tasks: ITaskData[]) => {
            set_tasks_list(tasks)
        })
    }, [])

    const changeTask = (step: number) => {
        const set_num = current_task_index + step
        set_current_task_index(set_num > 0 ? set_num : current_task_index)
    }

    try {
        intro = (
            <EuiText grow={false}>
                <h1>{tasks_list[current_task_index].name}</h1>

                <EuiPanel paddingSize="l">
                    <p>{tasks_list[current_task_index].desc}</p>
                </EuiPanel>

            </EuiText>
        )

        counter = (
            <EuiFlexGroup justifyContent="spaceEvenly">
                <EuiFlexItem grow={false}>
                    <EuiButton disabled={current_task_index == 0 ? true : false} onClick={() => changeTask(-1)} fill>left</EuiButton>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    {tasks_list[current_task_index].unit}
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiButton onClick={() => changeTask(1)} fill>right</EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
        )
    } catch (error) {
        console.log(error)
    }

    const endGame = (

        <EuiPanel paddingSize="l">
            you finished all youur tasks hurray !!!!!
        </EuiPanel>
    )

    return (
        <EuiPage paddingSize="none">
            <EuiPageBody paddingSize="l">
                <EuiPageContent
                    verticalPosition="center"
                    horizontalPosition="center"
                    paddingSize="none">
                    {intro ?? ''}
                    {counter ?? ''}
                    { (intro == null && counter == null) ? endGame : ''}
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
};

export default Page;
