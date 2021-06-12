/* eslint-disable react/jsx-pascal-case */
import React, {
  useState,
  useContext,
  useEffect,
  Fragment,
  Component,
} from "react";
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
  EuiSelect,
} from "@elastic/eui";
import { databaseContext } from "../App";
import { ITaskData, setRef, taskRef } from "../utils/custom_types";
import "../css/custom.css";
import { FlexGridColumns } from "@elastic/eui/src/components/flex/flex_grid";
import {
  GroupDisplayProp,
  GroupEditProp,
} from "../components/task_creation_props";
import Edit_task from "../components/Edit_task";

const Edit_task_menu: React.FC = () => {
  const db_context = useContext(databaseContext);

  const [task_groups_list, set_task_groups_list] = useState<any>({});
  const [task_list, set_task_list] = useState<any>({
    misc: [],
  });

  const [current_filter_set, set_current_filter_set] = useState<string>("misc");
  const [taskToEdit, setTaskToEdit] = useState<ITaskData>();
  const [groupToEdit, setGroupToEdit] = useState<setRef>();
  const [submitChange, setSubmitChange] = useState(false);

  const refresh = () => {
    db_context.getSetsFromDb().then((setGroups: any) => {
      let retrivedTaskList: any = {};

      let promises: any = [];
      if (setGroups)
        Object.keys(setGroups).forEach((setId: string) => {
          promises.push(
            db_context
              .getAllTaskDetails(setId)
              .then((taskSet: any) => {
                retrivedTaskList[setId] = taskSet;
              })
              .catch((error: any) => console.log(error))
          );
        });

      Promise.all(promises).then(() => {
        set_task_list(retrivedTaskList);
        set_task_groups_list(setGroups);
        if (submitChange) setSubmitChange(false);
      });
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const [isGroupEditModalVisible, SetGroupEditModalVisible] = useState(false);
  const closeGroupEditModal = () => {
    SetGroupEditModalVisible(false);
  };

  const showGroupEditModal = (set: setRef) => {
    setGroupToEdit(set);
    SetGroupEditModalVisible(true);
  };

  const tabBar = (title: string) => (
    <div
      style={{
        backgroundColor: "coral",
        color: "black",
        width: "100%",
        height: "5vh",
        textAlign: "center",
      }}
    >
      <EuiText textAlign="center" size="m">
        <p
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </p>
      </EuiText>
    </div>
  );

  const cardActions = (
    task: ITaskData | any = null,
    set: setRef | any = null
  ) => (
    <EuiFlexGroup responsive={false} gutterSize="s" alignItems="center">
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          size="s"
          display="fill"
          iconType="pencil"
          color="primary"
          onClick={() => {
            if (task) showModal(task);
            else if (set) showGroupEditModal(set);
          }}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          display="fill"
          size="s"
          color="danger"
          iconType="trash"
          aria-label="More"
          onClick={() => {
            if (task) db_context.removeTask(task).then(() => refresh());
            else if (set) db_context.removeSet(set).then(() => refresh());
          }}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const taskCard = (task: ITaskData) => {
    if (task)
      return (
        <EuiFlexItem key={task.id} grow={1} style={{ overflow: "hidden" }}>
          <EuiCard
            textAlign="left"
            image={tabBar(task.name)}
            title={task.desc}
            description={cardActions(task)}
          />
        </EuiFlexItem>
      );
  };

  const displayTaskCards = () =>
    task_list[current_filter_set]
      ? task_list[current_filter_set].map((task: ITaskData) => {
          if (applyFilter(task)) return taskCard(task);
        })
      : "";

  useEffect(() => {
    refresh();
  }, [isGroupEditModalVisible]);

  const taskSetCard = (set: setRef) => (
    <EuiFlexItem key={set.key} grow={1} style={{ overflow: "hidden" }}>
      <EuiCard
        textAlign="left"
        image={tabBar(set.name)}
        title={set.desc}
        description={cardActions(null, set)}
        onClick={() => {}}
      />
    </EuiFlexItem>
  );

  const displayTaskGroups = () =>
    task_groups_list
      ? Object.keys(task_groups_list).map((setId: string) => {
          if (setId != "misc") return taskSetCard(task_groups_list[setId]);
        })
      : "";

  const columnNum = [
    {
      id: "1",
      label: "1",
    },
    {
      id: "2",
      label: "2",
    },
    {
      id: "3",
      label: "3",
    },
    {
      id: "4",
      label: "4",
    },
  ];

  const [columnNumIdSelected, setColumnNumIdSelected] =
    useState<FlexGridColumns>(2);

  const columnNumChange = (optionId: any) => {
    setColumnNumIdSelected(optionId);
  };

  const itemTypeOptions = [
    {
      id: "tasks",
      label: "Tasks",
    },
    {
      id: "set",
      label: "Task Groups",
    },
  ];

  const [itemTypeSelected, setItemTypeSelected] = useState<string>("tasks");

  const onItemTypeChange = (optionId: any) => {
    setItemTypeSelected(optionId);
  };

  const [searchValue, setSearchValue] = useState("");
  const onSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  const applyFilter = (task: ITaskData) => {
    return searchValue != ""
      ? task.desc.indexOf(searchValue) != -1 ||
          task.name.indexOf(searchValue) != -1
      : true;
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  const showModal = (task: ITaskData) => {
    setTaskToEdit(task);
    setIsModalVisible(true);
  };

  const updateTask = (task: ITaskData, group: string, oldGroup: string) => {
    db_context
      .updateTaskInDB(task, group, oldGroup)
      .then(() => closeModal())
      .then(() => refresh())
      .catch((error: Error) => {
        console.log(error);
        closeModal();
      });
  };

  let modal;
  if (isModalVisible) {
    modal = (
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>yeet</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <Edit_task
            task={taskToEdit}
            submitChange={submitChange}
            updateTask={updateTask}
            groupId={current_filter_set}
          />
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButton color="danger" onClick={closeModal} fill>
            Cancel
          </EuiButton>
          <EuiButton
            fill
            onClick={() => {
              setSubmitChange(true);
            }}
          >
            Done
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }

  const selectGroup = (value: string) => set_current_filter_set(value);

  return (
    <EuiPanel>
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem>
          <EuiFieldSearch
            placeholder="Search this"
            value={searchValue}
            isClearable={true}
            onChange={onSearchChange}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiButtonGroup
            legend="Column level choices"
            options={columnNum}
            idSelected={columnNumIdSelected.toString()}
            onChange={columnNumChange}
            isFullWidth
          />
        </EuiFlexItem>

        {itemTypeSelected == "tasks" ? (
          <EuiFlexItem>
            <GroupDisplayProp
              selectedGroup={current_filter_set}
              selectGroup={selectGroup}
              change={task_groups_list}
            />
          </EuiFlexItem>
        ) : (
          ""
        )}
        <EuiFlexItem>
          <EuiButtonGroup
            legend="Item type"
            options={itemTypeOptions}
            idSelected={itemTypeSelected.toString()}
            onChange={onItemTypeChange}
            isFullWidth
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiPanel>
        <EuiFlexGrid columns={columnNumIdSelected} responsive={false}>
          {itemTypeSelected == "tasks"
            ? displayTaskCards()
            : displayTaskGroups()}
        </EuiFlexGrid>
      </EuiPanel>

      {modal}
      {isGroupEditModalVisible ? (
        <GroupEditProp closeModal={closeGroupEditModal} editSet={groupToEdit} />
      ) : (
        ""
      )}
    </EuiPanel>
  );
};

export default Edit_task_menu;
