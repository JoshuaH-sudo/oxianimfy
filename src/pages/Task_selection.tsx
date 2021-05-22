import React, { useContext, useEffect, useState } from 'react';
import {
  EuiButton,
  EuiSpacer,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPanel
} from '@elastic/eui';
import { appContext } from '../App';
import { databaseContext } from '../App';
import { ITaskData, setRef, taskRef } from '../utils/custom_types';

const Task_selection: React.FC = () => {

  const [task_group_list, set_task_group_list] = useState<setRef[]>([])
  const [taskToDo, setTaskToDo] = useState<any>({
    Misc: {
      toDo: 0,
    }
  })

  const app_Context = useContext(appContext)
  const db_Context = useContext(databaseContext)

  useEffect(() => {
    db_Context.getSetsDetailsFromDbForToday().then((sets: setRef[] | any) => {
      set_task_group_list(sets)
    })
  }, [])

  useEffect(() => {
    let updateTaskToDo = taskToDo
    task_group_list.map((set: setRef) => {

      let setTaskRef = set.tasks
      console.log('setTaskRef', setTaskRef)

      db_Context.getTasksFromSet(set.name).then((taskList: any) => {
        let taskToDoList:any = []

        taskList.forEach((taskDetails: any) => {
          let foundTask = setTaskRef.find((taskRefrence: taskRef) => taskRefrence.taskId == taskDetails.id)
          console.log('foundTask', foundTask)
          if (foundTask != undefined) taskToDoList.push(foundTask)
        });

        console.log('taskToDoList', taskToDoList)

        updateTaskToDo[set.name] = {
          toDo: taskToDoList.length
        }
        setTaskToDo(updateTaskToDo)
      })
    })
  }, [task_group_list])

  const cardClicked = (selectedSet: any) => {
    app_Context.setSelectedTaskGroup(selectedSet)
  };

  const isSetCompleted = (set: string) => {
    if (taskToDo[set]) {
      console.log('taskToDo', taskToDo[set])
      return taskToDo[set].toDo <= 0
    }
  }

  return (
    <EuiPanel paddingSize="l" >
      <EuiFlexGroup gutterSize="l">

        {task_group_list.map((set) => {
          return (
            <EuiFlexItem key={set.key} grow={false}>
              <EuiCard
                icon={<EuiIcon size="xxl" type={isSetCompleted(set.name) ? "starFilledSpace" : "starEmptySpace"} />}
                title={set.name}
                description={set.desc}
                display={isSetCompleted(set.name) ? "success" : undefined}
                footer={'Tasks to do: ' + taskToDo[set.name].toDo}
                selectable={{
                  href: "#/play",
                  onClick: () => cardClicked(set.name),
                  isDisabled: isSetCompleted(set.name)
                }}
              />
            </EuiFlexItem>
          )
        })}

      </EuiFlexGroup>

      <EuiSpacer />

      <EuiButton fill href="#/">Go back</EuiButton>
      <EuiButton fill href="#/play">Do all tasks</EuiButton>
    </EuiPanel>
  );
};

export default Task_selection;
