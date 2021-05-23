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
    EuiSuperSelect,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiButtonIcon,
    EuiText
} from '@elastic/eui';
import { EuiCheckboxGroupIdToSelectedMap } from '@elastic/eui/src/components/form/checkbox/checkbox_group';
import { ITaskData, setRef } from '../utils/custom_types'
import { databaseContext } from '../App';
import moment from 'moment';
import { string } from 'prop-types';

export const Task: React.FC = () => {
    const [newTask, setNewTask] = useState<ITaskData>({
        name: '',
        desc: '',
        daysOfWeek: [],
        mesure: 'timer',
        unit: 0
    })

    const [selectedGroup, setSelectedGroup] = useState('misc')
    const selectGroup = (value: string) => setSelectedGroup(value)

    const [isModalVisible, setIsModalVisible] = useState(false)
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);

    const [newTaskGroup, setNewTaskGroup] = useState<setRef>({
        name: '',
        desc: '',
        tasks: []
    })

    const [dotwCheckboxList, setDotwCheckboxList] = useState([
        { id: 'monday', label: 'Monday', disabled: false },
        { id: 'tuesday', label: 'Tuesday', disabled: false },
        { id: 'wednesday', label: 'Wednesday', disabled: false },
        { id: 'thursday', label: 'Thursday', disabled: false },
        { id: 'friday', label: 'Friday', disabled: false },
        { id: 'saturday', label: 'Saturday', disabled: false },
        { id: 'sunday', label: 'Sunday', disabled: false },
        { id: 'all', label: 'Every Day', disabled: false },
    ]);

    const [dotwIdMapping, setDotwIdMapping] = useState<EuiCheckboxGroupIdToSelectedMap>({});

    var taskMesureIdMapDefault: EuiCheckboxGroupIdToSelectedMap = {
        timer: true,
        counter: false,
        none: false,
    }

    const [taskMesureIdMapping, setTaskMesureIdMapping] = useState<EuiCheckboxGroupIdToSelectedMap>(taskMesureIdMapDefault);

    const [duration, setDuration] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    const groupDisplay = (title: string, desc: string) => {
        return (
            <Fragment>
                <strong>{title}</strong>
                <EuiText size="s" color="subdued">
                    <p className="euiTextColor--subdued">
                        {desc}
                    </p>
                </EuiText>
            </Fragment>
        )
    }

    const [taskGroups, setTaskGroups] = useState<any>([])

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
            //this is to allow retriveing only the item's id without getting undefined
            updateTaskValue('daysOfWeek', dotwCheckboxList
                .filter(item => item.id != "all")
                .map(filteredItems => filteredItems.id)
            )
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
        if (optionId == "none") updateTaskValue('unit', 0);
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

    useEffect(() => {
        db_context.getSetsFromDb().then((sets: any) => {
            let parseSetData = Object.keys(sets).map((setName: string) => {
                let title = setName.charAt(0).toUpperCase() + setName.slice(1);
                let desc = sets[setName].desc

                return {
                    value: title.toLowerCase(),
                    inputDisplay: title,
                    dropdownDisplay: (
                        groupDisplay(title, desc)
                    )
                }
            })

            setTaskGroups(parseSetData)
        })
    }, [isModalVisible])

    function createTaskGroup() {
        db_context.addTaskGroupToDB(newTaskGroup.name, newTaskGroup.desc).then(() => {
            selectGroup(newTaskGroup.name)
            closeModal()
        })
    }

    function createTask() {
        db_context.addTaskToDB(newTask, selectedGroup).catch((error: Error) => {
            console.log(error)
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

    const updateTimer = (event: any) => {
        let key = event.target.name
        let value = event.target.value

        const updateDuration = {
            ...duration,
            ...{
                [key]: value
            },
        };

        setDuration(updateDuration)
        updateTaskValue("unit", JSON.stringify(moment.duration(updateDuration)))
    };


    const setTimer = (
        <EuiForm>
            <EuiFormRow>
                <EuiFieldNumber
                    name='hours'
                    onChange={updateTimer}
                    prepend={'Hours'}
                    value={duration['hours']}

                />
            </EuiFormRow>
            <EuiFormRow>
                <EuiFieldNumber
                    name='minutes'
                    onChange={updateTimer}
                    prepend={'Minutes'}
                    value={duration['minutes']}

                />
            </EuiFormRow>
            <EuiFormRow>
                <EuiFieldNumber
                    name='seconds'
                    onChange={updateTimer}
                    prepend={'Seconds'}
                    value={duration['seconds']}
                />
            </EuiFormRow>
        </EuiForm>
    )

    const updateGroupValue = (field:string, value:string) => {
        let updatedTaskGroup = newTaskGroup
        updatedTaskGroup[field] = value
        setNewTaskGroup(updatedTaskGroup)
    }

    const createSetForm = (
        <EuiForm>
            <EuiFormRow label="Set Name">
                <EuiFieldText
                    name="name"
                    onChange={(event) => updateGroupValue(event.currentTarget.name, event.currentTarget.value)}
                />
            </EuiFormRow>
            <EuiFormRow label="Set Description">
                <EuiTextArea
                    name="desc"
                    onChange={(event) => updateGroupValue(event.currentTarget.name, event.currentTarget.value)}
                />
            </EuiFormRow>

            <EuiSpacer />

        </EuiForm>
    )

    let createSetModal

    if (isModalVisible) {
        createSetModal = (
            <EuiModal onClose={closeModal}>
                <EuiModalHeader>
                    <EuiModalHeaderTitle><h1>Create A Task Set</h1></EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>
                    {createSetForm}
                </EuiModalBody>

                <EuiModalFooter>
                    <EuiButton onClick={createTaskGroup} fill>Create Group</EuiButton>
                    <EuiButton onClick={closeModal} fill color='danger'>Cancel</EuiButton>
                </EuiModalFooter>
            </EuiModal>
        )
    }

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

                        <EuiFormRow label="Group this task">
                            <EuiSuperSelect
                                options={taskGroups}
                                valueOfSelected={selectedGroup}
                                onChange={selectGroup}
                                append={<EuiButtonIcon onClick={showModal} iconType="plusInCircle" />}
                            />
                        </EuiFormRow>

                    </EuiFlexItem>

                    {createSetModal}

                    <EuiFlexItem >
                        <EuiFormRow label="Timed or Counted Task">
                            <EuiCheckboxGroup
                                options={taskMesureOptions}
                                idToSelectedMap={taskMesureIdMapping}
                                onChange={(id) => onTaskMesureChange(id)}
                            />
                        </EuiFormRow>

                        <EuiSpacer />

                        {(newTask['mesure'] == 'timer') ? setTimer : ''}
                        {(newTask['mesure'] == 'counter') ? setCounter : ''}

                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer />

                <EuiButton fill onClick={() => createTask()}>Create</EuiButton>
                <EuiButton fill href="#/task_selection">Do tasks for today</EuiButton>
            </EuiForm >
        </EuiDescribedFormGroup>
    );
};

export default Task;