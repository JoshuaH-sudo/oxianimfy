import React, { useState, useContext, useEffect } from "react";
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiConfirmModal,
} from "@elastic/eui";
import { databaseContext } from "../App";
import { ITaskData, setRef } from "../utils/custom_types";
import "../css/custom.css";
import {
  DotwProp,
  GroupSelectProp,
  MesureProp,
  TitleDescProp,
} from "./task_creation_props";

interface PlayInterface {
  task: any;
  submitChange: boolean;
  updateTask: any;
  groupId: string;
}

interface Confirm_prop {
  title: string;
  desc: string;
  cancel: any;
  confirm: any;
}

export const Edit_task: React.FC<PlayInterface> = (props) => {
  const db_context = useContext(databaseContext);
  const [editTask, setEditTask] = useState<ITaskData>({
    id: props.task.id,
    name: props.task.name,
    desc: props.task.desc,
    daysOfWeek: props.task.daysOfWeek,
    mesure: props.task.mesure,
    unit: props.task.unit,
  });

  const oldGroup = props.groupId;

  const [selectedGroup, setSelectedGroup] = useState(props.groupId);
  const selectGroup = (value: string) => setSelectedGroup(value);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const updateTaskValue = (key: string, value: string | any) => {
    const updatedTask = editTask;
    updatedTask[key] = value;
    setEditTask({ ...updatedTask });
  };

  const [newTaskGroup, setNewTaskGroup] = useState<setRef>({
    name: "",
    desc: "",
    tasks: [],
  });

  function createTaskGroup() {
    db_context
      .addTaskGroupToDB(newTaskGroup.name, newTaskGroup.desc)
      .then(() => {
        selectGroup(newTaskGroup.name);
        closeModal();
      });
  }

  useEffect(() => {
    if (props.submitChange) props.updateTask(editTask, selectedGroup, oldGroup);
  }, [props.submitChange]);

  const updateGroupValue = (field: string, value: string) => {
    let updatedTaskGroup = newTaskGroup;
    updatedTaskGroup[field] = value;
    setNewTaskGroup(updatedTaskGroup);
  };

  let createSetModal;

  if (isModalVisible) {
    createSetModal = (
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>Create A Task Set</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>
            <TitleDescProp updateTaskValue={updateGroupValue} />
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButton onClick={createTaskGroup} fill>
            Create Group
          </EuiButton>
          <EuiButton onClick={closeModal} fill color="danger">
            Cancel
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }

  return (
    <EuiForm component="form">
      <TitleDescProp updateTaskValue={updateTaskValue} editTask={editTask} />

      <EuiSpacer />

      <EuiFlexGroup>
        <EuiFlexItem>
          <DotwProp updateTaskValue={updateTaskValue} editTask={editTask} />
          <EuiFormRow label="Group this task">
            <GroupSelectProp
              selectedGroup={selectedGroup}
              selectGroup={selectGroup}
              showModal={showModal}
              isModalVisible={isModalVisible}
            />
          </EuiFormRow>
        </EuiFlexItem>

        {createSetModal}

        <EuiFlexItem>
          <MesureProp
            updateTaskValue={updateTaskValue}
            mesure={editTask["mesure"]}
            editTask={editTask}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiForm>
  );
};

export const Confirm_deletion_prompt: React.FC<Confirm_prop> = (props) => {
  return (
    <EuiConfirmModal
      title={props.title}
      onCancel={props.cancel}
      onConfirm={props.confirm}
      cancelButtonText={"Cancel"}
      confirmButtonText={"Ok"}
      buttonColor="danger"
    >
        {props.desc}
    </EuiConfirmModal>
  );
};
