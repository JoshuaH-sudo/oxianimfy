import React, { useState, useContext, useEffect, Fragment, Component } from 'react';
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
import Countdown from 'react-countdown';
import moment from 'moment';

interface PrepareProps {
    list?: React.ReactNode;
    db_context: any
}

interface TaskProps {
    task: React.ReactNode;
    changeTask: Function;
}

interface PlayInterface {
    tasks_list: any;
}

interface PlayScreenProps {
    list: any[];
    index: number;
    changeTask: Function;
}

const Play: React.FC<PlayInterface> = (props) => {
    const [tasks_list, set_tasks_list] = useState<any[]>([])
    const db_context = useContext(databaseContext)

    useEffect(() => {
        db_context.app_manager.getSelectedTaskGroup()
            .then((setId: any) => db_context.getTasksFromSet(setId))
            .then((tasks: any) => set_tasks_list(tasks))
            .catch((error: any) => console.log(error))
    }, [])

    const noGame = (
        <EuiPanel paddingSize="l">
            <EuiText>No tasks for today hurray</EuiText>
            <EuiButton fill href="#/">Return</EuiButton>
        </EuiPanel>
    )

    return (
        <div>
            { tasks_list ? <Prepare db_context={db_context} list={tasks_list} /> : noGame}
        </div>
    )
}

const Prepare: React.FC<PrepareProps> = (props) => {
    const tasks_list: any = props.list
    const [current_task_index, set_current_task_index] = useState<number>(0);
    console.log(tasks_list)
    const changeTask = (step: number) => {
        const set_num = current_task_index + step
        set_current_task_index(set_num > 0 ? set_num : current_task_index)
    }

    const playGame = (
        <Play_screen list={tasks_list} index={current_task_index} changeTask={changeTask} />
    )

    const endGame = (
        <EuiPanel paddingSize="l">
            <EuiText>Finised all your tasks yay</EuiText>
            <EuiButton fill href="#/">Return</EuiButton>
        </EuiPanel>
    )
    return (
        <EuiPage paddingSize="none">
            <EuiPageBody paddingSize="l">
                <EuiPageContent
                    verticalPosition="center"
                    horizontalPosition="center"
                    paddingSize="none">
                    {current_task_index < tasks_list.length ? playGame : endGame}
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
};

const Play_screen: React.FC<PlayScreenProps> = (props) => {
    const tasks_list: any = props.list
    const current_task_index: any = props.index
    const changeTask = props.changeTask;

    const minStyle = {
        minWidth: 700,
        minHeight: 500
    }

    const task_intro = (
        <EuiText style={minStyle} grow={false}>
            <h1>{tasks_list[current_task_index].name}</h1>

            <EuiPanel style={minStyle} paddingSize="l">
                <p>{tasks_list[current_task_index].desc}</p>
            </EuiPanel>

        </EuiText>
    )

    return (
        <div>
            { task_intro}
            <EuiFlexGroup justifyContent="spaceEvenly">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        disabled={current_task_index <= 0 ? true : false}
                        onClick={() => changeTask(-1)}
                        fill
                        iconType={"arrowLeft"}
                    />
                </EuiFlexItem>

                {tasks_list[current_task_index].mesure == "counter" ? < Counter_task task={tasks_list[current_task_index]} changeTask={changeTask} /> : ''}
                {tasks_list[current_task_index].mesure == "timer" ? < Timer_task task={tasks_list[current_task_index]} changeTask={changeTask} /> : ''}
                {tasks_list[current_task_index].mesure == "none" ? < Simple_Task task={tasks_list[current_task_index]} changeTask={changeTask} /> : ''}

                <EuiFlexItem grow={false}>
                    <EuiButton
                        onClick={() => changeTask(1)}
                        fill
                        iconType={"arrowRight"}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    )
}

const Simple_Task: React.FC<TaskProps> = (props) => {
    const task: any = props.task

    const db_context = useContext(databaseContext)

    const done = () => {
        db_context.app_manager.getSelectedTaskGroup()
            .then((setId: string) => db_context.completeTask(task.id, setId.toLocaleLowerCase()))
            .then(() => props.changeTask(1))
    }
    return (
        <EuiFlexItem grow={false}>
            <EuiButton onClick={done}>
                Done
            </EuiButton>
        </EuiFlexItem>
    )
}

const Timer_task: React.FC<TaskProps> = (props) => {
    const task: any = props.task

    var timer_length = 0
    const duation = JSON.parse(task.unit as string)
    timer_length = moment.duration(duation).asMilliseconds()
    const db_context = useContext(databaseContext)

    const OnTimerFinish = () => {
        db_context.app_manager.getSelectedTaskGroup()
            .then((setId: string) => db_context.completeTask(task.id, setId.toLocaleLowerCase()))
            .then(() => props.changeTask(1))
    }

    return (
        <EuiFlexItem grow={false}>
            <Countdown
                date={Date.now() + timer_length}
                onComplete={OnTimerFinish}
            />
        </EuiFlexItem>
    )
}

const Counter_task: React.FC<TaskProps> = (props) => {
    const task: any = props.task

    const [current_counter, set_current_counter] = useState<number>(0);
    const db_context = useContext(databaseContext)

    const ChangeCounter = (step: number) => {
        const set_num = current_counter + step
        if (set_num >= task.unit) {
            db_context.app_manager.getSelectedTaskGroup()
                .then((setId: string) => db_context.completeTask(task.id, setId.toLowerCase()))
                .then(() => props.changeTask(1))
        } else {
            set_current_counter(set_num)
        }
    }

    return (
        <Fragment>
            <EuiFlexItem grow={false}>
                <EuiButton
                    disabled={current_counter <= 0 ? true : false}
                    fill
                    onClick={() => ChangeCounter(-1)}
                    iconType={"minus"}
                />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
                {current_counter + '/' + task.unit}
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
                <EuiButton
                    fill
                    disabled={current_counter >= task.unit ? true : false}
                    onClick={() => ChangeCounter(1)}
                    iconType={"plus"}
                />
            </EuiFlexItem>
        </Fragment>
    )
}
export default Play;
