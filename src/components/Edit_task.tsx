
import React, { useState, useContext, useEffect, Fragment, Component } from 'react';
import {
    EuiButton,
    EuiPanel,
    EuiFlexGroup,
    EuiFlexGrid,
    EuiFlexItem,
    EuiCard,
    EuiText,
    EuiSpacer,
    EuiButtonGroup,
    EuiTitle,
    EuiFieldSearch,
    EuiForm,
    EuiFormRow,
    EuiDescribedFormGroup,
    EuiSuperSelect,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiButtonIcon,
    EuiSelect
} from '@elastic/eui';
import { databaseContext } from '../App';
import { ITaskData, setRef, taskRef } from '../utils/custom_types';
import '../css/custom.css'
import { FlexGridColumns } from '@elastic/eui/src/components/flex/flex_grid';
import { DotwProp, GroupDisplayProp, GroupSelectProp, MesureProp, TitleDescProp } from './task_creation_props';

interface PlayInterface {
    task: any;
    submitChange: boolean;
    updateTask: any;
    groupId: string
}

const Edit_task: React.FC<PlayInterface> = (props) => {
    const db_context = useContext(databaseContext);

    const [editTask, setEditTask] = useState<ITaskData>({
        id: props.task.id,
        name: props.task.name,
        desc: props.task.desc,
        daysOfWeek: props.task.daysOfWeek,
        mesure: props.task.mesure,
        unit: props.task.unit
    })

    const oldGroup = props.groupId

    const [selectedGroup, setSelectedGroup] = useState(props.groupId)
    const selectGroup = (value: string) => setSelectedGroup(value)

    const [isModalVisible, setIsModalVisible] = useState(false)
    const closeModal = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);

    const updateTaskValue = (key: string, value: string | any) => {
        const updatedTask = editTask
        updatedTask[key] = value
        setEditTask({ ...updatedTask })
    }

    const [newTaskGroup, setNewTaskGroup] = useState<setRef>({
        name: '',
        desc: '',
        tasks: []
    })

    function createTaskGroup() {
        db_context.addTaskGroupToDB(newTaskGroup.name, newTaskGroup.desc).then(() => {
            selectGroup(newTaskGroup.name)
            closeModal()
        })
    }

    useEffect(() => {
        if (props.submitChange) props.updateTask(editTask, selectedGroup, oldGroup)
    }, [props.submitChange])

    const updateGroupValue = (field: string, value: string) => {
        let updatedTaskGroup = newTaskGroup
        updatedTaskGroup[field] = value
        setNewTaskGroup(updatedTaskGroup)
    }

    let createSetModal

    if (isModalVisible) {
        createSetModal = (
            <EuiModal onClose={closeModal}>
                <EuiModalHeader>
                    <EuiModalHeaderTitle><h1>Create A Task Set</h1></EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>
                    <EuiForm>
                        <TitleDescProp updateTaskValue={updateGroupValue} />
                    </EuiForm>
                </EuiModalBody>

                <EuiModalFooter>
                    <EuiButton onClick={createTaskGroup} fill>Create Group</EuiButton>
                    <EuiButton onClick={closeModal} fill color='danger'>Cancel</EuiButton>
                </EuiModalFooter>
            </EuiModal>
        )
    }

    return (

        <EuiForm component="form" >

            <TitleDescProp updateTaskValue={updateTaskValue} editTask={editTask} />

            <EuiSpacer />

            <EuiFlexGroup>
                <EuiFlexItem >
                    <DotwProp updateTaskValue={updateTaskValue} editTask={editTask} />
                    <EuiFormRow label="Group this task">
                        <GroupSelectProp selectedGroup={selectedGroup} selectGroup={selectGroup} showModal={showModal} isModalVisible={isModalVisible} />
                    </EuiFormRow>
                </EuiFlexItem>

                {createSetModal}

                <EuiFlexItem >
                    <MesureProp updateTaskValue={updateTaskValue} mesure={editTask['mesure']} editTask={editTask} />
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiForm >
    );
}

export default Edit_task;