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
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageContent,
  EuiPageBody,
  EuiPage,
  EuiHorizontalRule,
  EuiButtonIcon,
  EuiFlexGrid,
} from "@elastic/eui";
import { databaseContext } from "../App";
import { ITaskData } from "../utils/custom_types";
import Countdown from "react-countdown";
import moment from "moment";

interface PrepareProps {
  list?: React.ReactNode;
  db_context: any;
}

interface TaskProps {
  task: React.ReactNode;
  changeTask: Function;
}

interface PlayInterface {
  tasks_list: any;
}

interface PlayScreenProps {
  list: any[];
  index: number;
  changeTask: Function;
}

const Play: React.FC<PlayInterface> = (props) => {
  const [tasks_list, set_tasks_list] = useState<any[]>([]);
  const db_context = useContext(databaseContext);

  useEffect(() => {
    db_context.app_manager
      .getSelectedTaskGroup()
      .then((setId: any) => db_context.getTasksFromSetForToday(setId))
      .then((tasks: any) => set_tasks_list(tasks))
      .catch((error: any) => console.log(error));
  }, []);

  const noGame = (
    <EuiPanel paddingSize="l">
      <EuiText>No tasks for today hurray</EuiText>
      <EuiButton fill href="#/">
        Return
      </EuiButton>
    </EuiPanel>
  );

  return (
    <div>
      {tasks_list ? (
        <Prepare db_context={db_context} list={tasks_list} />
      ) : (
        noGame
      )}
    </div>
  );
};

const Prepare: React.FC<PrepareProps> = (props) => {
  const tasks_list: any = props.list;
  const [current_task_index, set_current_task_index] = useState<number>(0);

  const changeTask = (step: number) => {
    const set_num = current_task_index + step;
    set_current_task_index(set_num > 0 ? set_num : current_task_index);
  };

  const playGame = (
    <Play_screen
      list={tasks_list}
      index={current_task_index}
      changeTask={changeTask}
    />
  );

  const endGame = (
    <EuiPanel paddingSize="l">
      <EuiText>Finished all your tasks yay</EuiText>
      <EuiButton fill href="#/">
        Return
      </EuiButton>
    </EuiPanel>
  );
  return (
    <EuiPageBody paddingSize="l">
      <EuiPageContent
        verticalPosition="center"
        horizontalPosition="center"
        paddingSize="none"
      >
        {current_task_index < tasks_list.length ? playGame : endGame}
      </EuiPageContent>
    </EuiPageBody>
  );
};

const Play_screen: React.FC<PlayScreenProps> = (props) => {
  const tasks_list: any = props.list;
  const current_task_index: any = props.index;
  const changeTask = props.changeTask;

  const task_intro = (
    <EuiFlexItem>
      <EuiText>
        <h1>{tasks_list[current_task_index].name}</h1>

        <EuiHorizontalRule />

        <p>{tasks_list[current_task_index].desc}</p>

        <EuiHorizontalRule />
      </EuiText>
    </EuiFlexItem>
  );

  return (
    <EuiPanel>
      <EuiFlexGroup direction="column">
        {task_intro}

        <EuiFlexGroup gutterSize="m" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              disabled={current_task_index <= 0 ? true : false}
              onClick={() => changeTask(-1)}
              display="fill"
              iconType={"arrowLeft"}
              size="m"
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            {tasks_list[current_task_index].mesure == "counter" ? (
              <Counter_task
                task={tasks_list[current_task_index]}
                changeTask={changeTask}
              />
            ) : (
              ""
            )}
            {tasks_list[current_task_index].mesure == "timer" ? (
              <Timer_task
                task={tasks_list[current_task_index]}
                changeTask={changeTask}
              />
            ) : (
              ""
            )}
            {tasks_list[current_task_index].mesure == "none" ? (
              <Simple_Task
                task={tasks_list[current_task_index]}
                changeTask={changeTask}
              />
            ) : (
              ""
            )}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              onClick={() => changeTask(1)}
              display="fill"
              iconType={"arrowRight"}
              size="m"
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

const Simple_Task: React.FC<TaskProps> = (props) => {
  const task: any = props.task;

  const db_context = useContext(databaseContext);

  const done = () => {
    db_context.app_manager
      .getSelectedTaskGroup()
      .then((setId: string) =>
        db_context.completeTask(task.id, setId.toLocaleLowerCase())
      )
      .then(() => props.changeTask(1));
  };
  return <EuiButton onClick={done}>Done</EuiButton>;
};

const Timer_task: React.FC<TaskProps> = (props) => {
  const task: any = props.task;

  var timer_length = 0;
  const duation = JSON.parse(task.unit as string);
  timer_length = moment.duration(duation).asMilliseconds();
  const db_context = useContext(databaseContext);

  const OnTimerFinish = () => {
    db_context.app_manager
      .getSelectedTaskGroup()
      .then((setId: string) =>
        db_context.completeTask(task.id, setId.toLocaleLowerCase())
      )
      .then(() => props.changeTask(1));
  };

  return (
    <Countdown date={Date.now() + timer_length} onComplete={OnTimerFinish} />
  );
};

const Counter_task: React.FC<TaskProps> = (props) => {
  const task: any = props.task;

  const [current_counter, set_current_counter] = useState<number>(0);
  const db_context = useContext(databaseContext);

  const ChangeCounter = (step: number) => {
    const set_num = current_counter + step;
    if (set_num >= task.unit) {
      db_context.app_manager
        .getSelectedTaskGroup()
        .then((setId: string) =>
          db_context.completeTask(task.id, setId.toLowerCase())
        )
        .then(() => set_current_counter(0))
        .then(() => props.changeTask(1));
    } else {
      set_current_counter(set_num);
    }
  };

  return (
    <EuiFlexGroup gutterSize="m" responsive={false}>
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          disabled={current_counter <= 0 ? true : false}
          display="fill"
          onClick={() => ChangeCounter(-1)}
          iconType={"minus"}
          size="m"
        />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        {current_counter + "/" + task.unit}
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          disabled={current_counter >= task.unit ? true : false}
          display="fill"
          onClick={() => ChangeCounter(1)}
          iconType={"plus"}
          size="m"
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
export default Play;
