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
import { databaseContext } from '../App';
import { ITaskData, setRef, taskRef } from '../utils/custom_types';

const Task_selection: React.FC = () => {

  const [task_group_list, set_task_group_list] = useState<setRef[]>([])
  const [taskToDo, setTaskToDo] = useState<any>({})

  const db_Context = useContext(databaseContext)

  useEffect(() => {
    db_Context.getSetsDetailsFromDbForToday().then((sets: setRef[] | any) => {
      sets.map(async (set: setRef) => {
        //get task refrence from set
        let setTaskRef = set.tasks

        //check to see if this set is allready completed
        if (await db_Context.isSetNotDoneForToday(set.name)) {
          db_Context.getUncompletedTasks(setTaskRef, set.name).then((taskList: any) => {
            //update number of tasks to do

            let updateTaskToDo = taskToDo
            updateTaskToDo[set.name] = {
              toDo: taskList.length
            }

            //set them
            setTaskToDo({ ...updateTaskToDo })
            set_task_group_list(sets)
          })
        } else {
          let updateTaskToDo = taskToDo
          updateTaskToDo[set.name] = {
            toDo: 0
          }
          setTaskToDo({ ...updateTaskToDo })
          set_task_group_list(sets)
        }

      })
    })
  }, [])

  const cardClicked = (selectedSet: any) => {
    db_Context.app_manager.setSelectedTaskGroup(selectedSet)
  };

  function isSetCompleted(set: string) {
    if (taskToDo[set]) {
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
                footer={'Tasks to do: ' + (taskToDo[set.name] ? taskToDo[set.name].toDo : 0)}
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

    </EuiPanel>
  );
};

export default Task_selection;
