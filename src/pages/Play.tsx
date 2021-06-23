import React, {
  useState,
  useContext,
  useEffect,
  Fragment,
  Component,
  useRef,
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
import { ITaskData, taskRef } from "../utils/custom_types";
import Countdown from "react-countdown";
import moment from "moment";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import { pageUrls } from "../utils/constants";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

interface PrepareProps {
  list?: any;
  changeTask: Function;
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
  task: any;
  changeTask: Function;
}

const Play: React.FC<PlayInterface> = (props) => {
  const [tasks_todo, set_tasks_todo] = useState<any[]>([]);
  const db_context = useContext(databaseContext);

  const changeTask = (taskIdToRemove: string) => {
    let new_tasks_todo = tasks_todo;
    new_tasks_todo = new_tasks_todo.filter(
      (task: any) => task.id !== taskIdToRemove
    );
    set_tasks_todo(new_tasks_todo);
  };

  useEffect(() => {
    db_context.app_manager
      .getSelectedTaskGroup()
      .then((setId: any) => db_context.getTasksFromSetForToday(setId))
      .then((tasks: any) => set_tasks_todo(tasks))
      .catch((error: any) => console.log(error));
  }, []);

  const noGame = (
    <EuiPanel style={{ margin: "auto" }}>
      <EuiText>No tasks for today hurray</EuiText>
      <EuiButton fill href="#/">
        Return
      </EuiButton>
    </EuiPanel>
  );

  return (
    <Fragment>
      {tasks_todo ? (
        <Prepare
          db_context={db_context}
          list={tasks_todo}
          changeTask={changeTask}
        />
      ) : (
        noGame
      )}
    </Fragment>
  );
};

const Prepare: React.FC<PrepareProps> = (props) => {
  const endGame = (
    <div id="end_game">
    <EuiPanel style={{  textAlign: 'center'}}>
      <EuiText>Finished all your tasks yay</EuiText>
      <EuiButton fill href="#/">
        Return
      </EuiButton>
    </EuiPanel>
    </div>
  );

  const tasks = props.list.map((taskInfo: any) => {
    return (
      <SwiperSlide>
        <EuiPanel style={{ height: "inherit" }}>
          <Task_card task={taskInfo} changeTask={props.changeTask} />
        </EuiPanel>
      </SwiperSlide>
    );
  });

  const game_setup = (
    <Swiper
      style={{ height: "100%" }}
      slidesPerView={1}
      spaceBetween={50}
      loop={props.list.length > 1}
      navigation
      pagination={{ clickable: true, dynamicBullets: true }}
      onSlideChange={() => props.changeTask("")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {tasks}
    </Swiper>
  );

  return <Fragment>{props.list.length > 0 ? game_setup : endGame}</Fragment>;
};

const Task_card: React.FC<PlayScreenProps> = (props) => {
  const task = props.task;
  const changeTask = props.changeTask;

  const task_intro = (
    <Fragment>
      <EuiText className="center_text">
        <h1>{task.name}</h1>
      </EuiText>

      <EuiHorizontalRule />

      <EuiText className="center_text">
        <p>{task.desc}</p>
      </EuiText>

      <EuiHorizontalRule />
    </Fragment>
  );

  return (
    <Fragment>
      <EuiFlexGroup
        direction="column"
        justifyContent="center"
        style={{ flexWrap: "nowrap", height: "100%" }}
      >
        <EuiFlexItem style={{ height: "100%" }}>{task_intro}</EuiFlexItem>
        <EuiFlexItem id="play_tasks">
          {task.mesure == "counter" ? (
            <Counter_task task={task} changeTask={changeTask} />
          ) : (
            ""
          )}
          {task.mesure == "timer" ? (
            <Timer_task task={task} changeTask={changeTask} />
          ) : (
            ""
          )}
          {task.mesure == "none" ? (
            <Simple_Task task={task} changeTask={changeTask} />
          ) : (
            ""
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
    </Fragment>
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
      .then(() => props.changeTask(task.id));
  };

  return (
    <div style={{ margin: "auto" }}>
      <Countdown date={Date.now() + timer_length} onComplete={OnTimerFinish} />
    </div>
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
        .then(() => props.changeTask(task.id));
    } else {
      set_current_counter(set_num);
    }
  };

  return (
    <EuiFlexGroup
      gutterSize="m"
      justifyContent="spaceAround"
      responsive={false}
    >
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
