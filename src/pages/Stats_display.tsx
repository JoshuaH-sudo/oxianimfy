import React, { Fragment, useEffect, useState } from "react";
import {
  EuiPanel,
  EuiTabs,
  EuiTab,
  EuiSpacer,
  EuiTabbedContent,
} from "@elastic/eui";
import {
  Set_streak_stats,
  Week_workload,
  App_stats,
} from "../components/stats_function";

import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Controller,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Controller]);

export const Stats: React.FC = () => {
  const tabs: any = [
    {
      id: "0",
      name: "Weekly Workload",
      disabled: false,
    },
    {
      id: "1",
      name: "Stats",
      disabled: false,
    },
  ];

  const [swiper, set_swiper] = useState<any>();
  useEffect(() => {
    let el: any = document.querySelector(".swiper-container");
    let new_swiper = el !== null ? el.swiper : "";
    set_swiper(new_swiper);
  }, []);

  const [current_stat_view, set_current_stat_view] = useState<any>(tabs[0]);
  const onTabClick = (selectedTab: any) => {
    swiper.slideTo(selectedTab.id.toString(), 300, () => {
      console.log("yeet");
    });
  };

  return (
    <div id='stats_swiper'>
      {tabs.map((tab: any, index: any) => (
        <EuiTab
          onClick={() => onTabClick(tab)}
          isSelected={tab.id === current_stat_view.id}
          disabled={tab.disabled}
          key={index}
        >
          {tab.name}
        </EuiTab>
      ))}

      <Swiper
        pagination
        onActiveIndexChange={(swiper) => {
          set_current_stat_view(tabs[swiper.activeIndex]);
        }}
      >
        <SwiperSlide>
          <Week_workload />
        </SwiperSlide>

        <SwiperSlide>
          <Set_streak_stats />
          <EuiSpacer />
          <App_stats />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
