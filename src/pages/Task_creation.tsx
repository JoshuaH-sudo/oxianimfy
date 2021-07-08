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
  MesureProp,
  TitleDescProp,
} from "../components/task_creation_props";
const Joi = require("joi");
export const Task: React.FC = () => {
  const [newTask, setNewTask] = useState<ITaskData>({
    name: "",
    desc: "",
    daysOfWeek: [],
    mesure: "timer",
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
  }, [newTask.mesure]);

  function createTaskGroup() {
    db_context
      .addTaskGroupToDB(newTaskGroup.name, newTaskGroup.desc)
      .then(() => {
        selectGroup(newTaskGroup.name);
        closeModal();
      });
  }

  function createTask() {
    db_context.addTaskToDB(newTask, selectedGroup).catch((error: Error) => {
      console.log(error);
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
console.log('yeet', newTask)

const formSchema = Joi.object({
  name: Joi.string().required(),
  desc: Joi.string().empty(""),
  daysOfWeek: Joi.array().items(Joi.string().required()).min(1),
  mesure: Joi.string().valid("none", "timer", "counter"),
  unit: Joi.when("mesure", {
    switch: [
      { is: "none", then: Joi.string() },
      { is: "timer", then: Joi.string().invalid('"P0D"',"0") },
      { is: "counter", then: Joi.number().min(1) },
    ],
  }),
});
	const checkForm = () => {
		const formIsInvalid = formSchema.validate(newTask); 
		console.log(formIsInvalid)
		return formIsInvalid.error ? true : false 
	}

  return (
    <EuiPanel paddingSize="l">
      <EuiDescribedFormGroup
        title={<h3>New taskcreation</h3>}
        description={<Fragment>fillout each task</Fragment>}
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
              <MesureProp
                updateTaskValue={updateTaskValue}
                mesure={newTask["mesure"]}
              />
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer />
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiButton
                isDisabled={checkForm()}
                fill
                onClick={() => createTask()}
              >
                Create
              </EuiButton>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiButton fill href="#/task_selection">
                Do tasks for today
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiForm>
      </EuiDescribedFormGroup>
    </EuiPanel>
  );
};

export default Task;
