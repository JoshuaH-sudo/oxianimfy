import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  EuiCard,
  EuiIcon,
  EuiPanel,
  EuiText,
  EuiButtonIcon,
} from "@elastic/eui";
import { databaseContext } from "../App";
import { ITaskData, setRef, taskRef } from "../utils/custom_types";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";
import { pageUrls } from "../utils/constants";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Task_selection: React.FC = () => {
  const [task_group_list, set_task_group_list] = useState<setRef[]>([]);
  const [taskToDo, setTaskToDo] = useState<any>({});
  const db_Context = useContext(databaseContext);

  const updateTaskToDo = (value: number, setName: string) => {
    //update number of tasks to do
    let updateTaskToDo = taskToDo;
    updateTaskToDo[setName] = {
      toDo: value,
    };
    setTaskToDo({ ...updateTaskToDo });
  };

  const updateSetsSelection = (set: any) => {
    //update number of tasks to do
    let updatedSetList = task_group_list;
    updatedSetList.push(set);
    set_task_group_list(updatedSetList);
  };

  useEffect(() => {
    db_Context.getSetsDetailsFromDbForToday().then((sets: setRef[] | any) => {
      sets.map(async (set: setRef) => {
        //check to see if this set is allready completed
        if (set && await db_Context.isSetNotDoneForToday(set.name)) {

          db_Context
            .getUncompletedTasks(set.tasks, set.name)
            .then((taskList: any) => {
              updateTaskToDo(taskList.length, set.name);
              //set them
              updateSetsSelection(set);
              set_task_group_list(sets);
            });
        } else {
          if (set) updateTaskToDo(0, set.name);
        }
      });
    });
  }, []);

  const cardClicked = (selectedSet: any) => {
    db_Context.app_manager.setSelectedTaskGroup(selectedSet);
  };

  function isSetCompleted(set: string) {
    if (taskToDo[set]) {
      return taskToDo[set].toDo <= 0;
    }
  }

  const displaySetCards = (set: any) => {
    return (
      <SwiperSlide id={set.name}>
        <EuiCard
          icon={
            <EuiIcon
              size="xxl"
              type={
                isSetCompleted(set.name) ? "starFilledSpace" : "starEmptySpace"
              }
            />
          }
          title={set.name}
          description={
            <EuiText className="set_select_card_desc">{set.desc}</EuiText>
          }
          display={isSetCompleted(set.name) ? "success" : undefined}
          footer={
            "Tasks to do: " + (taskToDo[set.name] ? taskToDo[set.name].toDo : 0)
          }
          selectable={{
            href: "#/play",
            onClick: () => cardClicked(set.name),
            isDisabled: isSetCompleted(set.name),
          }}
          className="set_select_card"
        />
      </SwiperSlide>
    );
  };

  const noCardDisplay = (
    <SwiperSlide>
      <EuiCard
        icon={<EuiIcon size="xxl" type="starFilledSpace" />}
        title={"No sets to do for today"}
        description={
          <Fragment>
            <EuiText className="set_select_card_desc">
              {"Lets create some tasks "}
              <EuiButtonIcon size="s" iconType="plusInCircle" />
            </EuiText>
          </Fragment>
        }
        display={"primary"}
        href={pageUrls.task_create}
        className="set_select_card"
      />
    </SwiperSlide>
  );

  return (
    <EuiPanel paddingSize="l">
      <Swiper
        id="set_selection"
        spaceBetween={50}
        slidesPerView={1}
        loop={task_group_list.length > 1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        onSlideChange={(swiper) =>
          db_Context.app_manager.setSelectedTaskGroup(
            swiper.slides[swiper.activeIndex].id
          )
        }
      >
        {task_group_list.length > 0
          ? task_group_list.map((set) => {
              return set ? displaySetCards(set) : '';
            })
          : noCardDisplay}
      </Swiper>
    </EuiPanel>
  );
};

export default Task_selection;
