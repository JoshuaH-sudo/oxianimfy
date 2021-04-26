import React, { Fragment, useContext, useEffect, useState } from 'react';
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
import { databaseContext } from '../App';

interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string | any,

}

export const Task: React.FC = () => {
    const [newTask, setNewTask] = useState<ITaskData>({
        name: '',
        desc: '',
        daysOfWeek: [],
        mesure: 'timer'
    })

    const [dotwCheckboxList, setDotwCheckboxList] = useState([
        { id: 'mon', label: 'Monday', disabled: false },
        { id: 'tue', label: 'Tuesday', disabled: false },
        { id: 'wen', label: 'Wensday', disabled: false },
        { id: 'thur', label: 'Thursday', disabled: false },
        { id: 'fri', label: 'Friday', disabled: false },
        { id: 'sat', label: 'Saturday', disabled: false },
        { id: 'sun', label: 'Sunday', disabled: false },
        { id: 'all', label: 'Every Day', disabled: false },
    ]);

    const [dotwIdMapping, setDotwIdMapping] = useState<EuiCheckboxGroupIdToSelectedMap>({});


    const onDotwChange = (optionId: keyof object | string) => {
        //disable all other options and set them unchecked
        if (optionId == "all") {

            var newSelectedMap = dotwIdMapping;
            const toDisabled = !dotwIdMapping['all']

            const updatedDotwList = dotwCheckboxList.map((item) => {
                var updatedItem = item
                if (item.id != 'all') {
                    updatedItem.disabled = toDisabled
                    newSelectedMap[item.id] = false
                } else {
                    newSelectedMap['all'] = !dotwIdMapping['all']
                }
                return updatedItem
            })
            setDotwCheckboxList(updatedDotwList)
            setDotwIdMapping(newSelectedMap)

        } else {
            const newCheckboxIdToSelectedMap = {
                ...dotwIdMapping,
                ...{
                    [optionId]: !dotwIdMapping[optionId],
                },
            };
            setDotwIdMapping(newCheckboxIdToSelectedMap)
        }
    };

    useEffect(() => {
        //set the item value when dotw changes
        if (Object.keys(dotwIdMapping).find(() => dotwIdMapping['all'] != true)) {
            updateTaskValue('daysOfWeek', Object.keys(dotwIdMapping).filter(key => dotwIdMapping[key] == true))
        } else {
            updateTaskValue('daysOfWeek', Object.values(dotwCheckboxList).map((item) => {
                if (item.id != "all") {
                    return item.id
                }
            }))
        }
    }, [dotwCheckboxList, dotwIdMapping])

    var taskMesureOptions = [
        {
            id: 'timer',
            label: 'Timer',
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
        var newTaskMesureIdMap: EuiCheckboxGroupIdToSelectedMap = {}
        if (optionId == "timer") {
            newTaskMesureIdMap = {
                timer: true,
                counter: false
            }
        } else {
            newTaskMesureIdMap = {
                timer: false,
                counter: true
            }
        }

        updateTaskValue('mesure', optionId)
        setTaskMesureIdMapping(newTaskMesureIdMap);
    };

    useEffect(() => {
        updateTaskValue('mesure', Object.keys(taskMesureIdMapping).find((item) => taskMesureIdMapping[item] == true))
    }, [taskMesureIdMapping])

    function updateTaskValue(key: string, value: string | any) {
        const updatedTask = newTask
        updatedTask[key] = value
        setNewTask(updatedTask)
    }
    const db_context = useContext(databaseContext);


    function createTask() {

        db_context.storeItem('task', newTask).then(() => {
            db_context.retriveItem('task').then((result) => {
                console.log(result)
            })
        })
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
                        onChange={(event) => updateTaskValue(event.currentTarget.name, event.currentTarget.value)}
                    />
                </EuiFormRow>

                <EuiFormRow label="Task Description">
                    <EuiTextArea
                        name="desc"
                        onChange={(event) => updateTaskValue(event.currentTarget.name, event.currentTarget.value)}
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