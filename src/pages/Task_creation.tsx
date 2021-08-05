import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  EuiButton,
  EuiForm,
  EuiFormRow,
  EuiDescribedFormGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiPanel,
} from "@elastic/eui";
import { ITaskData, setRef } from "../utils/custom_types";
import { databaseContext } from "../App";
import {
  DotwProp,
  GroupModal,
  GroupSelectProp,
  MeasureProp,
  TitleDescProp,
} from "../components/task_creation_props";
import {validateTask} from "../utils/tools";
export const Task: React.FC = () => {
  const [newTask, setNewTask] = useState<ITaskData>({
    name: "",
    desc: "",
    daysOfWeek: [],
    measure: "none",
    unit: "0",
  });

  const [selectedGroup, setSelectedGroup] = useState("misc");
  const selectGroup = (value: string) => setSelectedGroup(value);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  const [newTaskGroup, setNewTaskGroup] = useState<setRef>({
    name: "",
    desc: "",
    tasks: [],
  });

  const updateTaskValue = (key: string, value: string | any) => {
    const updatedTask = newTask;
    updatedTask[key] = value;
    setNewTask({ ...updatedTask });
  };

  const db_context = useContext(databaseContext);

  useEffect(() => {
    updateTaskValue("unit", "0");
  }, [newTask.measure]);

  function createTaskGroup() {
    db_context
      .addTaskGroupToDB(newTaskGroup.name, newTaskGroup.desc)
      .then(() => {
        selectGroup(newTaskGroup.name);
        closeModal();
      });
  }

  function createTask() {
    console.log('yeet', newTask, selectedGroup)
    db_context.addTaskToDB(newTask, selectedGroup).catch((error: Error) => {
      console.log(error);
      console.log('yeet', error)
    });
  }

  const updateGroupValue = (field: string, value: string) => {
    let updatedTaskGroup = newTaskGroup;
    updatedTaskGroup[field] = value;
    setNewTaskGroup(updatedTaskGroup);
  };

  let createSetModal;

  if (isModalVisible) {
    createSetModal = (
      <GroupModal
        updateGroupValue={updateGroupValue}
        closeModal={closeModal}
        createTaskGroup={createTaskGroup}
      />
    );
  }
  return (
      <EuiDescribedFormGroup
        title={<h3>New task</h3>}
      >
        <EuiForm component="form">
          <TitleDescProp updateTaskValue={updateTaskValue} />

          <EuiSpacer />

          <EuiFlexGroup>
            <EuiFlexItem>
              <DotwProp updateTaskValue={updateTaskValue} />

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
              <MeasureProp
                updateTaskValue={updateTaskValue}
                measure={newTask["measure"]}
              />
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer />
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiButton
                isDisabled={validateTask(newTask)}
                fill
                onClick={() => createTask()}
              >
                Create
              </EuiButton>
            </EuiFlexItem>

          </EuiFlexGroup>
        </EuiForm>
      </EuiDescribedFormGroup>
  );
};

export default Task;
