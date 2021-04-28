import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
    EuiButton,
    EuiCheckboxGroup,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiDescribedFormGroup,
    EuiTextArea,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiFieldNumber,
    EuiDatePicker,
} from '@elastic/eui';
import { EuiCheckboxGroupIdToSelectedMap } from '@elastic/eui/src/components/form/checkbox/checkbox_group';
import { databaseContext } from '../App';
import moment from 'moment';

interface ITaskData {
    [k: string]: any,
    name: string,
    desc: string,
    [index: number]: { day: string };
    mesure: string | any,
    unit: number | string

}

export const Task: React.FC = () => {
    const [newTask, setNewTask] = useState<ITaskData>({
        name: '',
        desc: '',
        daysOfWeek: [],
        mesure: 'timer',
        unit: 0
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
        },
        {
            id: 'none',
            label: 'None'
        }
    ]

    var taskMesureIdMapDefault: EuiCheckboxGroupIdToSelectedMap = {
        timer: true,
        counter: false,
        none: false,
    }

    const [taskMesureIdMapping, setTaskMesureIdMapping] = useState<EuiCheckboxGroupIdToSelectedMap>(taskMesureIdMapDefault);

    const onTaskMesureChange = (optionId: keyof object | string) => {
        var newTaskMesureIdMap: EuiCheckboxGroupIdToSelectedMap = {
            timer: false,
            counter: false,
            none: false,
        }
        switch (optionId) {
            case "timer":
                newTaskMesureIdMap['timer'] = true
                break
            case "counter":
                newTaskMesureIdMap['counter'] = true
                break
            case "none":
                newTaskMesureIdMap['none'] = true
                break
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

    const setCounter = (
        <EuiFormRow label="Counter">
            <EuiFieldNumber
                name="unit"
                onChange={(event) => updateTaskValue(event.currentTarget.name, event.currentTarget.value)}
            />
        </EuiFormRow>
    )

    const [startDate, setStartDate] = useState(moment());
    const [duration, setDuration] = useState(moment.duration({
        hours: 0,
        minutes: 0,
        seconds: 0
    }));
    const handleChange = (date: moment.Moment) => {
        if (date) {
            setStartDate(date);
        }
    };
    useEffect(() => {
        setDuration(moment.duration({ 
            hours: startDate.hours(),
            minutes: startDate.minutes(),
            seconds: startDate.seconds()
        }))
        updateTaskValue("unit", duration)
        console.log(duration)
    },[startDate])

    const setTimer = (
        <EuiFormRow
            label="Timer"
            helpText="Hours : Minute : Seconds"
        >
            <EuiDatePicker
                showTimeSelect
                showTimeSelectOnly
                selected={startDate}
                onChange={handleChange}
                dateFormat="HH:mm:ss"
                timeFormat="HH:mm:ss"
            />
        </EuiFormRow>
    )

    return (
        <EuiDescribedFormGroup
            title={<h3>New taskcreation</h3>}
            description={
                <Fragment>
                    fillout each task
                </Fragment>
            }>
            <EuiForm component="form" >
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

                <EuiSpacer />

                <EuiFlexGroup >
                    <EuiFlexItem >
                        <EuiFormRow label="Days of the Week">
                            <EuiCheckboxGroup
                                options={dotwCheckboxList}
                                idToSelectedMap={dotwIdMapping}
                                onChange={(id) => onDotwChange(id)}
                            />
                        </EuiFormRow>
                    </EuiFlexItem>
                    <EuiFlexItem >
                        <EuiFormRow label="Timed or Counted Task">
                            <EuiCheckboxGroup
                                options={taskMesureOptions}
                                idToSelectedMap={taskMesureIdMapping}
                                onChange={(id) => onTaskMesureChange(id)}
                            />
                        </EuiFormRow>

                        {(newTask['mesure'] == 'timer') ? setTimer : ''}
                        {(newTask['mesure'] == 'counter') ? setCounter : ''}

                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer />

                <EuiButton fill onClick={() => createTask()}>Create</EuiButton>
            </EuiForm >
        </EuiDescribedFormGroup>
    );
};

export default Task;