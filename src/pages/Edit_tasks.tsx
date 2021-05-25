import React, { useState, useContext, useEffect, Fragment, Component } from 'react';
import {
    EuiButton,
    EuiPanel,
    EuiFlexGroup,
    EuiFlexGrid,
    EuiFlexItem,
    EuiCard
} from '@elastic/eui';
import { databaseContext } from '../App';
import { ITaskData, setRef, taskRef } from '../utils/custom_types';

const Edit_tasks: React.FC = () => {
    const [task_groups_list, set_task_groups_list] = useState<any>({})
    const [task_list, set_task_list] = useState<any>({
        misc: []
    })
    const db_context = useContext(databaseContext)

    const [current_filter_set, set_current_filter_set] = useState<string>('misc')

    useEffect(() => {
        db_context.getSetsFromDb().then((setGroups: any) => {
            set_task_groups_list(setGroups)

            let retrivedTaskList: any = {}
            Object.keys(setGroups).forEach((setId: string) => {
                let currentSet = setGroups[setId]
                db_context.getAllTaskDetails(currentSet.name)
                    .then((taskSet: any) => retrivedTaskList[currentSet.name.toLowerCase()] = taskSet)
                    .then(() => set_task_list(retrivedTaskList))
            })
        })
    }, [])

    const tabBar = (
        <div
            style={{
                backgroundColor: 'coral',
                width: '100%',
                height: '50px'
            }}
        />
    )

    const taskCard = (task: ITaskData) => {
        return (
            <EuiFlexItem key={task.id}>
                <EuiCard
                    textAlign="left"
                    image={tabBar}
                    style={{ height: '33vh' }}
                    title={task.name}
                    description={task.desc}
                    onClick={() => { }}
                />
            </EuiFlexItem>
        )
    }

    return (
        <EuiPanel paddingSize="l" >
            <EuiFlexGrid columns={3} gutterSize="l">

                {task_list[current_filter_set].map((task: ITaskData) => {
                    return taskCard(task)
                })}

            </EuiFlexGrid>

        </EuiPanel>
    );
};

export default Edit_tasks;
