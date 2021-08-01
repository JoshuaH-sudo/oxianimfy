import React, { Fragment, useState } from "react";
import { EuiPanel, EuiTabs, EuiTab, EuiSpacer } from "@elastic/eui";
import {
  Set_streak_stats,
  Week_workload,
  App_stats,
} from "../components/stats_function";

export const Stats: React.FC = () => {
  const [current_stat_view, set_current_stat_view] =
    useState<string>("week_workload");

  const display = () => {
    switch (current_stat_view) {
      case "week_workload":
        return <Week_workload />
      case "app_stats":
        return (
          <Fragment>
            <Set_streak_stats />
            <App_stats />
          </Fragment>
        );
    }
  };
  return (
    <EuiPanel paddingSize="l">
      <EuiTabs display="condensed">
        <EuiTab onClick={() => set_current_stat_view("week_workload")}>
          Week Workload
        </EuiTab>

        <EuiTab onClick={() => set_current_stat_view("app_stats")}>
          Stats
        </EuiTab>
      </EuiTabs>

      <EuiSpacer />

      {display()}
    </EuiPanel>
  );
};
