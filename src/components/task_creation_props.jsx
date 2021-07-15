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
	EuiFlexGroup,
	EuiFlexItem,
	EuiSwitch,
	EuiRange,
} from "@elastic/eui";
import TimeField from 'react-simple-timefield';
import moment from "moment";
import { databaseContext } from "../App";
import { every_day_set, every_second_day_sun_set, every_second_day_mon_set } from "../utils/constants.ts"
export const DotwProp = (props) => {
  const [dotwCheckboxList, setDotwCheckboxList] = useState([
    { id: "sunday", label: "Sunday", disabled: false },
    { id: "monday", label: "Monday", disabled: false },
    { id: "tuesday", label: "Tuesday", disabled: false },
    { id: "wednesday", label: "Wednesday", disabled: false },
    { id: "thursday", label: "Thursday", disabled: false },
    { id: "friday", label: "Friday", disabled: false },
    { id: "saturday", label: "Saturday", disabled: false },
  ]);

	const simple_dotw_options = [
    {
      value: "every_day",
      inputDisplay: "Every day",
      dropdownDisplay: "Do this task everyday",
    },
    {
      value: "every_second_day",
      inputDisplay: "Every second day, Sun",
      dropdownDisplay: "Do every second day, starting from Sunday",
    },
    {
      value: "every_second_day_mon",
      inputDisplay: "Every second day, Mon",
      dropdownDisplay: "Do every second day, starting from Monday",
    },
		{
      value: "other",
      inputDisplay: "Custom",
      dropdownDisplay: "Choose each day",
    },

  ];
				
	const [simple_dotw, set_simple_dotw] = useState("every_day");	

	const [dotwIdMapping, setDotwIdMapping] = useState([]);

  useEffect(() => {
    if (props.editTask) {
      let initMappings = [];
      props.editTask.daysOfWeek.map((day) => {
        initMappings[day] = true;
      });
      setDotwIdMapping(initMappings);
    }
		onDotwChange("all");
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

      const updatedDotwList = dotwCheckboxList.map((item) => {
        var updatedItem = item;
        if (item.id !== "all") {
          updatedItem.disabled = false;
        }
        return updatedItem;
      });
      setDotwCheckboxList(updatedDotwList);

    } else if (Object.keys(dotwIdMapping).length > 0) {
      //this is to allow retriveing only the item's id without getting undefined
      props.updateTaskValue(
        "daysOfWeek",
        dotwCheckboxList
          .filter((item) => item.id !== "all")
          .map((filteredItems) => filteredItems.id)
      );
    }
  }, [dotwIdMapping]);

		useEffect(() => {
		switch(simple_dotw) {
			case 'every_day':
				setDotwIdMapping(every_day_set)
				break;
		 case 'every_second_day':
				setDotwIdMapping(every_second_day_sun_set);
				break;
		 case 'every_second_day_mon':
				setDotwIdMapping(every_second_day_mon_set);
				break;
		}

	},[simple_dotw] )

  const formValid =
    Object.keys(dotwIdMapping).filter((key) => dotwIdMapping[key] === true)
      .length > 0;

  return (
    <EuiFormRow
      label="Days of the Week"
      helpText={!formValid ? "Please select at least one option" : ""}
    >
      <Fragment>
        <EuiSuperSelect
          options={simple_dotw_options}
          valueOfSelected={simple_dotw}
          onChange={(value) => set_simple_dotw(value)}
          hasDividers
        />
        <EuiSpacer size="s" />
        {simple_dotw == "other" ? (
          <EuiCheckboxGroup
            options={dotwCheckboxList}
            idToSelectedMap={dotwIdMapping}
            onChange={(id) => onDotwChange(id)}
          />
        ) : (
          ""
        )}
      </Fragment>
    </EuiFormRow>
  );
};

export const TimerProp = (props) => {
  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (props.editTask) {
      let preSetDuration = moment.duration(JSON.parse(props.editTask.unit));
      setDuration({
        hours: preSetDuration.hours(),
        minutes: preSetDuration.minutes(),
        seconds: preSetDuration.seconds(),
      });

			const time_string =
        preSetDuration.hours().toString() +
        preSetDuration.minutes().toString() +
        preSetDuration.seconds().toString(); 
			set_time(time_string);
    }
  }, []);

	const [time, set_time] = useState();

	const onTimeChange = (event, time) => {
    set_time(time);
		const time_props = time.split(':')
		const updateDuration = {
			hours: time_props[0],
			minutes: time_props[1],
			seconds: time_props[2]
		}

		setDuration(updateDuration);
    props.updateTaskValue(
    	"unit",
      JSON.stringify(moment.duration(updateDuration))
    );
  };

	const timer_input = ( 
		<EuiFieldText prepend='Time' />
	)
				
  return (
    <EuiForm>
				<EuiFormRow isInvalid={time == '00:00:00'} error="Cannot be set to zero" >

        <TimeField
          value={time}
          onChange={onTimeChange}
          input={timer_input}
          colon=":"
          showSeconds
        />
      </EuiFormRow>
    </EuiForm>
  );
}; 

export const CounterProp = (props) => {
  const [counter, setCounter] = useState("0");

  const updateCounter = (event) => {
    let value = event.target.value;

    if (!value.match(/[^$,.\d]/)) {
      value !== "" ? setCounter(parseInt(value, 10)) : setCounter("0");
    }
  };

  useEffect(() => {
    if (props.editTask) {
      if (!isNaN(parseInt(props.editTask.unit, 10)))
        setCounter(props.editTask.unit);
    }
  }, []);

  useEffect(() => {
    props.updateTaskValue("unit", counter);
  }, [counter]);

  return (
    <EuiFormRow
      helpText={counter === "0" ? "Counter can not be set to zero" : ""}
    >
      <EuiFieldText prepend='Counter' name="unit" value={counter} onChange={updateCounter} />
    </EuiFormRow>
  );
};

export const MesureProp = (props) => {
  var taskMesureIdMapDefault = {
    timer: props.mesure === "timer" || props.mesure === "" ? true : false,
    counter: props.mesure === "counter" ? true : false,
    none: props.mesure === "none" ? true : false,
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
				props.updateTaskValue("unit", "none");
        break;
      default:
        break;
    }

    props.updateTaskValue("mesure", optionId);
    setTaskMesureIdMapping(newTaskMesureIdMap);
  };

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

  const [group_list, set_group_list] = useState([]);
  const db_context = useContext(databaseContext);

  useEffect(() => {
    if (props.editGroupSet) {
      setTitle(props.editGroupSet.name);
      setDesc(props.editGroupSet.desc);
    }

    db_context.getSetsFromDb().then((sets) => {
      let parseSetList = Object.keys(sets);
      set_group_list(parseSetList);
    });
  }, []);

  useEffect(() => {
    props.updateGroupValue("name", name);
    props.updateGroupValue("desc", desc);
  }, [name, desc]);

  const groupIsValid =
    name !== "" &&
    group_list.find((setName) => setName === name.toLowerCase()) === undefined;

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
            isInvalid={group_list.find(
              (setName) => setName === name.toLowerCase()
            )}
            error={"That Name is in use, please choose another"}
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
			if (props.allowAll) parseSetData.unshift({
        value: "all",
        inputDisplay: "All",
        dropdownDisplay: groupDisplay("All", "Show all"),
      });
      setTaskGroups(parseSetData);
    });
		
  }, [props.change]);

  return (
    <EuiSuperSelect
      disabled={props.disable}
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
			closeModal={props.closeModal}
    />
  );
};
