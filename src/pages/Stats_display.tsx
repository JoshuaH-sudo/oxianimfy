import React, { Fragment, useState } from "react";
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
import Swiper from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Controller]);

export const Stats: React.FC = () => {
  const swiper: any = new Swiper(".swiper-container", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
  });
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

  const [current_stat_view, set_current_stat_view] = useState<any>(tabs[0]);
  const onTabClick = (selectedTab: any) => {
    swiper.slideTo(selectedTab.id.toString(), 300, () => {
      console.log("yeet");
    });
  };

  swiper.on("activeIndexChange", (swiper: any) => {
    console.log(swiper.activeIndex);
    set_current_stat_view(tabs[swiper.activeIndex]);
  });
				
  return (
    <Fragment>
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

      <EuiSpacer />

      <div className="swiper-container">

        <div className="swiper-wrapper">

          <div className="swiper-slide">
            <Week_workload />
          </div>

          <div className="swiper-slide">
            <Set_streak_stats />
            <EuiSpacer />
            <App_stats />
          </div>

        </div>
        <div className="swiper-pagination"></div>

        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>

        <div className="swiper-scrollbar"></div>
      </div>
    </Fragment>
  );
};
