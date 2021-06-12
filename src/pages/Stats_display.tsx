import React, { useState } from "react";
import { EuiPanel, EuiTabs, EuiTab, EuiSpacer } from "@elastic/eui";
import {
  Set_streak_stats,
  Week_workload,
  App_stats,
} from "../components/stats_function";

export const Stats: React.FC = () => {
  const [current_stat_view, set_current_stat_view] =
    useState<string>("set_streak");

  const display = () => {
    switch (current_stat_view) {
      case "set_streak":
        return <Set_streak_stats />;
      case "week_workload":
        return <Week_workload />;
      case "app_stats":
        return <App_stats />;
    }
  };
  return (
    <EuiPanel paddingSize="l">
      <EuiTabs display="condensed">
        <EuiTab onClick={() => set_current_stat_view("set_streak")}>
          Set Streaks
        </EuiTab>
        <EuiTab onClick={() => set_current_stat_view("week_workload")}>
          Week Workload
        </EuiTab>
        <EuiTab onClick={() => set_current_stat_view("app_stats")}>
          App Stats
        </EuiTab>
      </EuiTabs>

      <EuiSpacer />

      {display()}
    </EuiPanel>
  );
};
