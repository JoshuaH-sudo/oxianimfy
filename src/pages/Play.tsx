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
  task: any;
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
    <Fragment>
      <EuiText>No tasks for today hurray</EuiText>
      <EuiButton fill href="#/">
        Return
      </EuiButton>
    </Fragment>
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
  let tasks_list: any = props.list;

  const changeTask = (taskIdToRemove: string) => {
    tasks_list = tasks_list.filter((task: any) => task.id !== taskIdToRemove);
  };

  const endGame = (
    <EuiPanel paddingSize="l">
      <EuiText>Finished all your tasks yay</EuiText>
      <EuiButton fill href="#/">
        Return
      </EuiButton>
    </EuiPanel>
  );

  const tasks = tasks_list.map((taskInfo: any) => {
    console.log("yeet", taskInfo);
    return (
      <SwiperSlide>
        <Task_card task={taskInfo} changeTask={changeTask} />
      </SwiperSlide>
    );
  });

  const game_setup = (
    <Swiper
      slidesPerView={1}
      spaceBetween={50}
      loop={tasks_list.length > 1}
      navigation
      pagination={{ clickable: true, dynamicBullets: true }}
      onSlideChange={() => console.log("slide changse")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {tasks}
    </Swiper>
  );

  return (
    <EuiPanel>
      {tasks_list.length > 0 ? game_setup : endGame}
    </EuiPanel>
  );
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
    <EuiPanel>
      <EuiFlexGroup direction="column" justifyContent="center">
        <EuiFlexItem>{task_intro}</EuiFlexItem>
        <EuiFlexItem>
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
        .then(() => props.changeTask(task.id));
    } else {
      set_current_counter(set_num);
    }
  };

  return (
    <EuiFlexGroup gutterSize="m" justifyContent="center" responsive={false}>
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
