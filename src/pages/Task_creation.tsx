import React, { Fragment, useEffect, useState } from 'react';
import {
    EuiButton,
    EuiCheckboxGroup,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiDescribedFormGroup,
    EuiTextArea,
} from '@elastic/eui';
import { EuiCheckboxGroupIdToSelectedMap } from '@elastic/eui/src/components/form/checkbox/checkbox_group';

interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string,

}
const Task: React.FC = () => {
    var newTask: ITaskData = {
        name: '',
        desc: '',
        daysOfWeek: [],
        mesure: 'timer'
    }
    var dotwCheckboxList = [
        { id: 'mon', label: 'Monday' },
        { id: 'tue', label: 'Tuesday' },
        { id: 'wen', label: 'Wensday' },
        { id: 'thur', label: 'Thursday' },
        { id: 'fri', label: 'Friday' },
        { id: 'sat', label: 'Saturday' },
        { id: 'sun', label: 'Sunday' },
    ];

    const [dotwIdMapping, setDotwIdMapping] = useState<EuiCheckboxGroupIdToSelectedMap>({});

    const onDotwChange = (optionId: keyof object | string) => {
        const newCheckboxIdToSelectedMap = {
            ...dotwIdMapping,
            ...{
                [optionId]: !dotwIdMapping[optionId],
            },
        };
        setDotwIdMapping(newCheckboxIdToSelectedMap)

    };
    useEffect(() => {
        newTask['daysOfWeek'] = Object.keys(dotwIdMapping).filter(key => dotwIdMapping[key] == true);
    },[dotwIdMapping])

    var taskMesureOptions = [
        {
            id: 'timer',
            label: 'Timer'
        },
        {
            id: 'counter',
            label: 'Counter'
        }
    ]

    var taskMesureIdMapDefault: EuiCheckboxGroupIdToSelectedMap = {
        timer: true,
        counter: false
    }

    const [taskMesureIdMapping, setTaskMesureIdMapping] = useState<EuiCheckboxGroupIdToSelectedMap>(taskMesureIdMapDefault);

    const onTaskMesureChange = (optionId: keyof object | string) => {
        setTaskMesureIdMapping(taskMesureIdMapDefault);
        const newTaskMesureIdMap = {
            ...taskMesureIdMapDefault,
            ...{
                [optionId]: !taskMesureIdMapping[optionId],
            },

        };
        setTaskMesureIdMapping(newTaskMesureIdMap);
    };

    function updateTaskValue(key: string, value: string) {
        newTask[key] = value
    }

    function createTask() {
        console.log(newTask)
    }

    return (
        <EuiDescribedFormGroup
            title={<h3>New task creation</h3>}
            description={
                <Fragment>
                    fillout each task
                </Fragment>
            }
        >
            <EuiForm component="form">

                <EuiFormRow label="Task name">
                    <EuiFieldText
                        name="name"
                        onBlur={(event) => updateTaskValue(event.currentTarget.name, event.currentTarget.value)}
                    />
                </EuiFormRow>

                <EuiFormRow label="Task Description">
                    <EuiTextArea
                        name="desc"
                        onBlur={(event) => updateTaskValue(event.currentTarget.name, event.currentTarget.value)}
                    />
                </EuiFormRow>

                <EuiFormRow label="Days of the Week">
                    <EuiCheckboxGroup
                        options={dotwCheckboxList}
                        idToSelectedMap={dotwIdMapping}
                        onChange={(id) => onDotwChange(id)}
                    />
                </EuiFormRow>

                <EuiFormRow label="Timed or Counted Task">
                    <EuiCheckboxGroup
                        options={taskMesureOptions}
                        idToSelectedMap={taskMesureIdMapping}
                        onChange={(id) => onTaskMesureChange(id)}
                    />
                </EuiFormRow>

                <EuiButton fill onClick={() => createTask()}>
                    Create
                </EuiButton>
            </EuiForm >
        </EuiDescribedFormGroup>
    );
};

export default Task;