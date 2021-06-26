/* eslint-disable react/jsx-pascal-case */
import React, { useState, useContext, useEffect, Fragment } from "react";
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
  EuiFieldSearch,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiButtonIcon,
  EuiHighlight,
} from "@elastic/eui";
import { databaseContext } from "../App";
import { ITaskData, setRef, taskRef } from "../utils/custom_types";
import "../css/custom.css";
import { FlexGridColumns } from "@elastic/eui/src/components/flex/flex_grid";
import {
  GroupDisplayProp,
  GroupEditProp,
} from "../components/task_creation_props";
import {
  Confirm_deletion_prompt,
  Edit_task,
  Filter_flyout_button,
} from "../components/Edit_task_menu_props";
const Joi = require("joi");

const Edit_task_menu: React.FC = () => {
  const db_context = useContext(databaseContext);

  const [task_list, set_task_list] = useState<any>({
    misc: [],
  });
  const [filter_options, set_filter_options] = useState<any>({
    current_filter_set: "misc",
    itemType: "tasks",
    columnNumIdSelected: 2,
    taskType: "all",
  });
  const [taskToEdit, setTaskToEdit] = useState<ITaskData>();
  const [groupToEdit, setGroupToEdit] = useState<setRef>();
  const [submitChange, setSubmitChange] = useState(false);
  const [task_groups_list, set_task_groups_list] = useState<any>({});
  const [show_confirm, set_show_confirm] = useState<any>({});

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
        set_task_groups_list(setGroups);
        set_task_list(retrivedTaskList);
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

  const highlightFilter = (text: string) => (
    <EuiHighlight search={searchValue} highlightAll={true}>
      {text}
    </EuiHighlight>
  );

  const tabBar = (
    title: string,
    barColor: string = "coral",
    textColor: string = "black"
  ) => (
    <div
      id="card_bar"
      style={{
        backgroundColor: barColor,
        color: textColor,
      }}
    >
      <EuiText textAlign="center" size="m">
        <p id="card_title">{highlightFilter(title)}</p>
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
            if (set)
              set_show_confirm({
                show: true,
                desc: "Are you sure you want to delete " + set.name + "?",
                confirm: () => {
                  db_context.removeSet(set).then(() => {
                    set_show_confirm({ show: false });
                    refresh();
                  });
                },
                cancel: () => set_show_confirm({ show: false }),
              });
            else if (task) db_context.removeTask(task).then(() => refresh());
          }}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );

  const noCardDisplay = () => (
    <EuiFlexItem key={"no-card"} grow={1}>
      <EuiCard
        textAlign="left"
        image={tabBar("No Cards", "black", "white")}
        title={"There are no items to display, try diffrent filter settings"}
        description={""}
        onClick={() => {}}
      />
    </EuiFlexItem>
  );

  const taskCard = (task: ITaskData) => {
    if (task)
      return (
        <EuiFlexItem key={task.id} grow={1} id="edit_task_card">
          <EuiCard
            textAlign="left"
            image={tabBar(task.name)}
            title={task.desc}
            description={cardActions(task)}
          />
        </EuiFlexItem>
      );
  };
  const taskFilter = (tasks: any) => {
    const search_check = new RegExp(searchValue);
    const schema = Joi.object({
      name: Joi.string().regex(search_check),
      desc: Joi.string(),
      daysOfWeek: Joi.array(),
      id: Joi.string(),
      mesure: Joi.string().when(Joi.ref("$show_all_task"), {
        is: true,
        then: Joi.valid(filter_options.taskType),
        otherwise: Joi.string(),
      }),
      unit: Joi.any(),
    });

    let filteredTasks = tasks.filter((task: taskRef) => {
      const check = schema.validate(task, {
        context: { show_all_task: filter_options.taskType != "all" },
      });
      if (!check.error) return task;
    });

    return filteredTasks;
  };

  const displayTaskCards = () => {
    const filtered_tasks = taskFilter(
      task_list[filter_options.current_filter_set]
    );
    if (filtered_tasks.length > 0) {
      return filtered_tasks.map((task: ITaskData) => {
        return taskCard(task);
      });
    } else {
      return noCardDisplay();
    }
  };

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
    task_groups_list && Object.keys(task_groups_list).length > 1
      ? Object.keys(task_groups_list).map((setId: string) => {
          if (setId != "misc") return taskSetCard(task_groups_list[setId]);
        })
      : noCardDisplay();

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
            <h1>Edit</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <Edit_task
            task={taskToEdit}
            submitChange={submitChange}
            updateTask={updateTask}
            groupId={filter_options.current_filter_set}
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

  const displayCards = () => {
    switch (filter_options.itemType) {
      case "tasks":
        return displayTaskCards();
        break;
      case "sets":
        return displayTaskGroups();
        break;
    }
  };
  const [searchValue, setSearchValue] = useState("");
  const onSearchChange = (e: any) => {
    setSearchValue(e.target.value);
  };
  let cards = displayCards();
  return (
    <EuiPanel>
      <EuiFlexGroup
        responsive={false}
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <EuiFlexItem>
          <EuiFieldSearch
            placeholder="Search this"
            value={searchValue}
            isClearable={true}
            onChange={onSearchChange}
          />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <Filter_flyout_button
            filter_options={filter_options}
            updateFilter={set_filter_options}
          />
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiPanel>
        <EuiFlexGrid
          columns={filter_options.columnNumIdSelected}
          responsive={false}
        >
          {cards}
        </EuiFlexGrid>
      </EuiPanel>

      {modal}

      {show_confirm.show ? (
        <Confirm_deletion_prompt
          title={"Warning!"}
          desc={show_confirm.desc}
          confirm={show_confirm.confirm}
          cancel={show_confirm.cancel}
        />
      ) : (
        ""
      )}

      {isGroupEditModalVisible ? (
        <GroupEditProp closeModal={closeGroupEditModal} editSet={groupToEdit} />
      ) : (
        ""
      )}
    </EuiPanel>
  );
};

export default Edit_task_menu;
