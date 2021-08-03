import React, { Fragment, useState } from "react";
import { EuiPanel, EuiTabs, EuiTab, EuiSpacer } from "@elastic/eui";
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
  const [current_stat_view, set_current_stat_view] = useState<any>({
    index: 0,
    name: "week_workload",
  });
  const [controlledSwiper, setControlledSwiper] = useState(null);
  return (
    <EuiPanel paddingSize="l">
      <EuiTabs>
        <EuiTab
          isSelected={current_stat_view.name === "week_workload"}
          onClick={() => {
            set_current_stat_view({ index: 0, name: "week_workload" });
            console.log(controlledSwiper);
          }}
        >
          Week Workload
        </EuiTab>

        <EuiTab
          isSelected={current_stat_view.name === "app_stats"}
          onClick={() => set_current_stat_view({ index: 1, name: "app_stats" })}
        >
          Stats
        </EuiTab>
      </EuiTabs>

      <EuiSpacer />

      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ dynamicBullets: true }}
        onSlideChange={(swiper) => {
          switch (swiper.activeIndex) {
            case 0:
              set_current_stat_view({ index: 0, name: "week_workload" });
              break;
            case 1:
              set_current_stat_view({ index: 1, name: "app_stats" });
              break;
            default:
              set_current_stat_view({ index: 0, name: "week_workload" });
              break;
          }
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
    </EuiPanel>
  );
};
