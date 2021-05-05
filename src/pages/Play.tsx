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

interface ParentCompProps {
    list?: React.ReactNode;
}

interface PlayInterface {
    tasks_list: any[];
}

class Play extends Component<{}, PlayInterface> {
    static contextType = databaseContext;
    constructor(props: any) {
        super(props);
        this.state = {
            tasks_list: []
        }
    }

    retriveTasks() {
        this.context.db_context.getTasks().then((tasks: ITaskData[]) => {
            this.setState({ tasks_list: tasks })
        })
        console.log("yeet")
        console.log(this.state.tasks_list)
    }

    render() {
        const endGame = (
            <EuiPanel paddingSize="l">
                <EuiText>you finished all youur tasks hurray !!!!!</EuiText>
                <EuiButton fill href="#/">Return</EuiButton>
            </EuiPanel>
        )

        return (
            <div>
                { this.state.tasks_list == [] ? <Prepare list={this.state.tasks_list} /> : endGame}
            </div>
        )
    }

}

const Prepare: React.FC<ParentCompProps> = (props) => {

    const tasks_list: any = props.list ?? []
    const [current_task_index, set_current_task_index] = useState<number>(0);

    const [current_counter, set_current_counter] = useState<number>(0);

    let task_intro = null;
    let counter = null;
    let timer = null;
    let play_screen = null;

    const changeTask = (step: number) => {
        const set_num = current_task_index + step
        set_current_task_index(set_num > 0 ? set_num : current_task_index)
    }

    const ChangeCounter = (step: number) => {
        const set_num = current_task_index + step
        if (set_num >= tasks_list[current_task_index].unit) {
            changeTask(1)
        } else {
            set_current_counter(set_num)
        }
    }

    task_intro = (
        <EuiText grow={false}>
            <h1>{tasks_list[current_task_index].name}</h1>

            <EuiPanel paddingSize="l">
                <p>{tasks_list[current_task_index].desc}</p>
            </EuiPanel>

        </EuiText>
    )

    if (tasks_list[current_task_index].mesure == "counter") {
        counter = (
            <EuiFlexGroup justifyContent="spaceEvenly">
                <EuiFlexItem grow={false}>
                    <EuiButton
                        disabled={current_counter <= 0 ? true : false}
                        fill
                        onClick={() => ChangeCounter(-1)}
                        iconType={"minus"}
                    />
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    {current_counter}
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiButton
                        fill
                        onClick={() => ChangeCounter(1)}
                        iconType={"plus"}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
        )
    }

    var timer_length = 0
    if (tasks_list[current_task_index].mesure == "timer") {
        const duation = JSON.parse(tasks_list[current_task_index].unit as string)
        timer_length = moment.duration(duation).asMilliseconds()
        console.log(timer_length)
        console.log(duation)
        timer = (
            <EuiFlexItem grow={false}>
                <Countdown date={Date.now() + timer_length}></Countdown>
            </EuiFlexItem>
        )

    }

    play_screen = (
        <Fragment>
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

                {counter ?? ''}
                {timer ?? ''}

                <EuiFlexItem grow={false}>
                    <EuiButton
                        onClick={() => changeTask(1)}
                        fill
                        iconType={"arrowRight"}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
        </Fragment>
    )


    return (
        <EuiPage paddingSize="none">
            <EuiPageBody paddingSize="l">
                <EuiPageContent
                    verticalPosition="center"
                    horizontalPosition="center"
                    paddingSize="none">
                    {play_screen}
                </EuiPageContent>
            </EuiPageBody>
        </EuiPage>
    );
};

export default Play;
