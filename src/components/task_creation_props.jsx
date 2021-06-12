import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  EuiButton,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSuperSelect,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiButtonIcon,
  EuiText,
  EuiCheckboxGroup,
  EuiFieldText,
  EuiTextArea,
} from "@elastic/eui";
import moment from "moment";
import { databaseContext } from "../App";

export const DotwProp = (props) => {
  const [dotwCheckboxList, setDotwCheckboxList] = useState([
    { id: "monday", label: "Monday", disabled: false },
    { id: "tuesday", label: "Tuesday", disabled: false },
    { id: "wednesday", label: "Wednesday", disabled: false },
    { id: "thursday", label: "Thursday", disabled: false },
    { id: "friday", label: "Friday", disabled: false },
    { id: "saturday", label: "Saturday", disabled: false },
    { id: "sunday", label: "Sunday", disabled: false },
    { id: "all", label: "Every Day", disabled: false },
  ]);

  const [dotwIdMapping, setDotwIdMapping] = useState({});

  useEffect(() => {
    if (props.editTask) {
      let initMappings = [];
      props.editTask.daysOfWeek.map((day) => {
        initMappings[day] = true;
      });
      setDotwIdMapping(initMappings);
    }
  }, []);

  const onDotwChange = (optionId) => {
    //disable all other options and set them unchecked
    if (optionId === "all") {
      var newSelectedMap = dotwIdMapping;
      const toDisabled = !dotwIdMapping["all"];

      const updatedDotwList = dotwCheckboxList.map((item) => {
        var updatedItem = item;
        if (item.id !== "all") {
          updatedItem.disabled = toDisabled;
          newSelectedMap[item.id] = false;
        } else {
          newSelectedMap["all"] = !dotwIdMapping["all"];
        }
        return updatedItem;
      });
      setDotwCheckboxList(updatedDotwList);
      setDotwIdMapping(newSelectedMap);
    } else {
      const newCheckboxIdToSelectedMap = {
        ...dotwIdMapping,
        ...{
          [optionId]: !dotwIdMapping[optionId],
        },
      };
      setDotwIdMapping(newCheckboxIdToSelectedMap);
    }
  };

  useEffect(() => {
    //set the item value when dotw changes
    if (
      Object.keys(dotwIdMapping).find(() => dotwIdMapping["all"] !== true) &&
      Object.keys(dotwIdMapping).length > 0
    ) {
      props.updateTaskValue(
        "daysOfWeek",
        Object.keys(dotwIdMapping).filter((key) => dotwIdMapping[key] === true)
      );
    } else if (Object.keys(dotwIdMapping).length > 0) {
      //this is to allow retriveing only the item's id without getting undefined
      props.updateTaskValue(
        "daysOfWeek",
        dotwCheckboxList
          .filter((item) => item.id !== "all")
          .map((filteredItems) => filteredItems.id)
      );
    }
  }, [dotwCheckboxList, dotwIdMapping]);

  const formValid =
    Object.keys(dotwIdMapping).filter((key) => dotwIdMapping[key] === true)
      .length > 0;

  return (
    <EuiFormRow
      label="Days of the Week"
      helpText={!formValid ? "Please select at least one option" : ""}
    >
      <EuiCheckboxGroup
        options={dotwCheckboxList}
        idToSelectedMap={dotwIdMapping}
        onChange={(id) => onDotwChange(id)}
      />
    </EuiFormRow>
  );
};
export const TimerProp = (props) => {
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const updateTimer = (event) => {
    let key = event.target.name;
    let value = event.target.value;

    if (!value.match(/[^$,.\d]/)) {
      const updateDuration = {
        ...duration,
        ...{
          [key]: value !== "" ? parseInt(value, 10) : 0,
        },
      };

      setDuration(updateDuration);
      props.updateTaskValue(
        "unit",
        JSON.stringify(moment.duration(updateDuration))
      );
    }
  };

  useEffect(() => {
    if (props.editTask) {
      let preSetDuration = moment.duration(JSON.parse(props.editTask.unit));
      setDuration({
        hours: preSetDuration.hours(),
        minutes: preSetDuration.minutes(),
        seconds: preSetDuration.seconds(),
      });
    }
  }, []);

  const timeValid =
    duration.hours > 0 || duration.minutes > 0 || duration.seconds > 0;

  return (
    <EuiForm>
      <EuiFormRow>
        <EuiFieldText
          name="hours"
          onChange={updateTimer}
          prepend={"Hours"}
          value={duration["hours"]}
        />
      </EuiFormRow>
      <EuiFormRow>
        <EuiFieldText
          name="minutes"
          onChange={updateTimer}
          prepend={"Minutes"}
          value={duration["minutes"]}
        />
      </EuiFormRow>
      <EuiFormRow helpText={!timeValid ? "Timer can not be set to zero" : ""}>
        <EuiFieldText
          name="seconds"
          onChange={updateTimer}
          prepend={"Seconds"}
          value={duration["seconds"]}
        />
      </EuiFormRow>
    </EuiForm>
  );
};
export const CounterProp = (props) => {
  const [counter, setCounter] = useState("0");

  useEffect(() => {
    if (props.editTask) {
      if (parseInt(props.editTask.unit)) setCounter(props.editTask.unit);
    }
  }, []);

  const updateCounter = (event) => {
    let value = event.target.value;

    if (!value.match(/[^$,.\d]/)) {
      value !== "" ? setCounter(parseInt(value, 10)) : setCounter("0");
    }
  };

  useEffect(() => {
    props.updateTaskValue("unit", counter);
  }, [counter]);

  return (
    <EuiFormRow
      label="Counter"
      helpText={counter === "0" ? "Counter can not be set to zero" : ""}
    >
      <EuiFieldText name="unit" value={counter} onChange={updateCounter} />
    </EuiFormRow>
  );
};
export const MesureProp = (props) => {
  var taskMesureIdMapDefault = {
    timer: true,
    counter: false,
    none: false,
  };

  var taskMesureOptions = [
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

  const [taskMesureIdMapping, setTaskMesureIdMapping] = useState(
    taskMesureIdMapDefault
  );

  const onTaskMesureChange = (optionId) => {
    var newTaskMesureIdMap = {
      timer: false,
      counter: false,
      none: false,
    };
    switch (optionId) {
      case "timer":
        newTaskMesureIdMap["timer"] = true;
        break;
      case "counter":
        newTaskMesureIdMap["counter"] = true;
        break;
      case "none":
        newTaskMesureIdMap["none"] = true;
        break;
      default:
        break;
    }

    props.updateTaskValue("mesure", optionId);
    if (optionId == "none") props.updateTaskValue("unit", "none");
    setTaskMesureIdMapping(newTaskMesureIdMap);
  };

  useEffect(() => {
    onTaskMesureChange(props.mesure);
  }, []);

  useEffect(() => {
    props.updateTaskValue(
      "mesure",
      Object.keys(taskMesureIdMapping).find(
        (item) => taskMesureIdMapping[item] == true
      )
    );
  }, [taskMesureIdMapping]);

  return (
    <Fragment>
      <EuiFormRow label="Timed or Counted Task">
        <EuiCheckboxGroup
          options={taskMesureOptions}
          idToSelectedMap={taskMesureIdMapping}
          onChange={(id) => onTaskMesureChange(id)}
        />
      </EuiFormRow>

      <EuiSpacer />

      {props.mesure == "timer" ? (
        <TimerProp
          updateTaskValue={props.updateTaskValue}
          editTask={props.editTask}
        />
      ) : (
        ""
      )}
      {props.mesure == "counter" ? (
        <CounterProp
          updateTaskValue={props.updateTaskValue}
          editTask={props.editTask}
        />
      ) : (
        ""
      )}
    </Fragment>
  );
};
export const TitleDescProp = (props) => {
  const [name, setTitle] = useState(props.name ?? "");
  const [desc, setDesc] = useState(props.desc ?? "");

  useEffect(() => {
    if (props.editTask) {
      setTitle(props.editTask.name);
      setDesc(props.editTask.desc);
    }
  }, []);

  useEffect(() => {
    props.updateTaskValue("name", name);
    props.updateTaskValue("desc", desc);
  }, [name, desc]);

  return (
    <Fragment>
      <EuiFormRow
        label="Task name"
        helpText={name === "" ? "Please give this task a name." : ""}
      >
        <EuiFieldText
          value={name}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
      </EuiFormRow>

      <EuiFormRow label="Task Description">
        <EuiTextArea
          value={desc}
          onChange={(event) => setDesc(event.currentTarget.value)}
        />
      </EuiFormRow>
    </Fragment>
  );
};
export const GroupModal = (props) => {
  const [name, setTitle] = useState(props.name ?? "");
  const [desc, setDesc] = useState(props.desc ?? "");

  useEffect(() => {
    if (props.editTask) {
      setTitle(props.editTask.name);
      setDesc(props.editTask.desc);
    }
  }, []);

  useEffect(() => {
    props.updateGroupValue("name", name);
    props.updateGroupValue("desc", desc);
  }, [name, desc]);

  const groupIsValid = name !== "";

  return (
    <EuiModal closeModal={props.closeModal}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>{props.editMode ? "Edit Task Set" : "Create Task Set"}</h1>
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiForm>
          <EuiFormRow
            label="Task name"
            helpText={name === "" ? "Please give this set a name." : ""}
          >
            <EuiFieldText
              value={name}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </EuiFormRow>

          <EuiFormRow label="Task Description">
            <EuiTextArea
              value={desc}
              onChange={(event) => setDesc(event.currentTarget.value)}
            />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButton onClick={props.closeModal} fill color="danger">
          Cancel
        </EuiButton>
        <EuiButton
          isDisabled={!groupIsValid}
          onClick={props.createTaskGroup}
          fill
        >
          {props.editMode ? "Edit Set" : "Create Set"}
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
export const GroupSelectProp = (props) => {
  const [taskGroups, setTaskGroups] = useState([]);
  const db_context = useContext(databaseContext);

  const groupDisplay = (title, desc) => {
    return (
      <Fragment>
        <strong>{title}</strong>
        <EuiText size="s" color="subdued">
          <p className="euiTextColor--subdued">{desc}</p>
        </EuiText>
      </Fragment>
    );
  };

  useEffect(() => {
    db_context.getSetsFromDb().then((sets) => {
      let parseSetData = Object.keys(sets).map((setName) => {
        let title = setName.charAt(0).toUpperCase() + setName.slice(1);
        let desc = sets[setName].desc;

        return {
          value: title.toLowerCase(),
          inputDisplay: title,
          dropdownDisplay: groupDisplay(title, desc),
        };
      });

      setTaskGroups(parseSetData);
    });
  }, [props.isModalVisible]);

  return (
    <EuiSuperSelect
      hasDividers
      options={taskGroups}
      valueOfSelected={props.selectedGroup}
      onChange={props.selectGroup}
      append={
        <EuiButtonIcon onClick={props.showModal} iconType="plusInCircle" />
      }
    />
  );
};
export const GroupDisplayProp = (props) => {
  const [taskGroups, setTaskGroups] = useState([]);
  const db_context = useContext(databaseContext);

  const groupDisplay = (title, desc) => {
    return (
      <Fragment>
        <strong>{title}</strong>
        <EuiText size="s" color="subdued">
          <p className="euiTextColor--subdued">{desc}</p>
        </EuiText>
      </Fragment>
    );
  };

  useEffect(() => {
    db_context.getSetsFromDb().then((sets) => {
      let parseSetData = Object.keys(sets).map((setName) => {
        let title = setName.charAt(0).toUpperCase() + setName.slice(1);
        let desc = sets[setName].desc;

        return {
          value: title.toLowerCase(),
          inputDisplay: title,
          dropdownDisplay: groupDisplay(title, desc),
        };
      });

      setTaskGroups(parseSetData);
    });
  }, [props.change]);

  return (
    <EuiSuperSelect
      hasDividers
      options={taskGroups}
      valueOfSelected={props.selectedGroup}
      onChange={props.selectGroup}
    />
  );
};
export const GroupEditProp = (props) => {
  const db_context = useContext(databaseContext);
  const [editTaskGroup, setEditTaskGroup] = useState({
    key: props.editSet ? props.editSet.key : "",
    name: "",
    desc: "",
    tasks: props.editSet ? props.editSet.tasks : [],
  });

  const updateValues = (key, value) => {
    let updatedEditTaskGroup = editTaskGroup;
    updatedEditTaskGroup[key] = value;
    setEditTaskGroup(updatedEditTaskGroup);
  };

  function createTaskGroup() {
    db_context.updateTaskSetInDB(editTaskGroup).then(() => {
      props.closeModal();
    });
  }

  return (
    <GroupModal
      editMode={true}
      updateGroupValue={updateValues}
      editTask={props.editSet}
      createTaskGroup={createTaskGroup}
    />
  );
};
