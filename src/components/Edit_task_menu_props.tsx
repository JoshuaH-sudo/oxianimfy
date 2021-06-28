import React, { useState, useContext, useEffect, Fragment } from "react";
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
  EuiButtonGroup,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
} from "@elastic/eui";
import { FlexGridColumns } from "@elastic/eui/src/components/flex/flex_grid";
import { databaseContext } from "../App";
import { ITaskData, setRef } from "../utils/custom_types";
import "../css/custom.css";
import {
  DotwProp,
  GroupSelectProp,
  GroupDisplayProp,
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

export const Filter_flyout_button: React.FC<any> = (props) => {
  const db_context = useContext(databaseContext);
  const [task_groups_list, set_task_groups_list] = useState<any>({});
  const [columnNumIdSelected, setColumnNumIdSelected] =
    useState<FlexGridColumns>(2);
  const [itemTypeSelected, setItemTypeSelected] = useState<string>("task");
  const [show_filter_flyout, set_show_filter_flyout] = useState(false);

  const itemTypeOptions = [
    {
      id: "task",
      label: "Tasks",
    },
    {
      id: "set",
      label: "Task Groups",
    },
  ];

  const taskTypeOptions = [
    {
      id: "all",
      label: "All",
    },
    {
      id: "timer",
      label: "Timer",
    },
    {
      id: "counter",
      label: "Counter",
    },
    {
      id: "none",
      label: "None",
    },
  ];

    const [, render] = useState({});
  const filter_change = (key: string, value: any) => {
    let updatedValue = { ...props.filter_options };
    updatedValue[key] = value;
    props.updateFilter(updatedValue);
    render({});
  };

  const refresh = () => {
    db_context.getSetsFromDb().then((setGroups: any) => {
      set_task_groups_list(setGroups);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const selectGroup = (value: string) =>
    filter_change("current_filter_set", value);

  const taskFilter = (
    <Fragment>
      <EuiFormRow label="Select Task Group">
        <GroupDisplayProp
          disable={props.filter_options.itemType != "task"}
          selectedGroup={props.filter_options.current_filter_set}
          selectGroup={selectGroup}
          change={task_groups_list}
        />
      </EuiFormRow>

      <EuiFormRow label="Task type">
        <EuiButtonGroup
          legend="Task Type"
          options={taskTypeOptions}
          idSelected={props.filter_options.taskType}
          onChange={(e: any) => filter_change("taskType", e)}
        />
      </EuiFormRow>
    </Fragment>
  );
  const filterGroup = () => {
    switch (props.filter_options.itemType) {
      case "task":
        return taskFilter;
    }
  };
  if (!show_filter_flyout) {
    return (
      <EuiButton
        size="m"
        iconSide="right"
        iconType="filter"
        fill
        onClick={() => set_show_filter_flyout(true)}
      >
        Filter
      </EuiButton>
    );
  } else {
    return (
      <EuiFlyout
        size="s"
        ownFocus
        onClose={() => set_show_filter_flyout(false)}
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle>
            <h2>Filter</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiForm>
									<EuiFormRow label="Item to Edit">
              <EuiButtonGroup
                legend="Item type"
                options={itemTypeOptions}
                idSelected={props.filter_options.itemType}
                onChange={(e: any) => filter_change("itemType", e)}
                isFullWidth
                buttonSize="compressed"
              />
            </EuiFormRow>

            <EuiSpacer />

            {filterGroup()}
          </EuiForm>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }
};
