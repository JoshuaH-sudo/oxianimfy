import React, { Fragment, useContext, useEffect, useState } from "react";
import { euiPaletteColorBlind } from "@elastic/eui";
import { databaseContext } from "../App";
import { ITaskData, setRef, taskRef } from "../utils/custom_types";

import {
  Chart,
  Axis,
  BarSeries,
  Position,
  Settings,
  ScaleType,
  DataGenerator,
} from "@elastic/charts";
import {
  EUI_CHARTS_THEME_DARK,
  EUI_CHARTS_THEME_LIGHT,
} from "@elastic/eui/dist/eui_charts_theme";

import { EuiStat, EuiFlexItem, EuiFlexGroup, EuiText } from "@elastic/eui";
import numeral from "numeral";

export const Set_streak_stats = () => {
  const db_Context = useContext(databaseContext);
  const [taskset_size_data, set_taskset_size_data] = useState<any>([]);

  useEffect(() => {
    let setMap: any = [];

    db_Context.stats_db.getSetStats().then((setStreaks: any) => {
      Object.keys(setStreaks).map((setId: any) => {
        setMap.push({
          vizType: setId,
          count: setStreaks[setId].streak,
          issueType: "Current Streak",
        });
      });
      set_taskset_size_data(setMap);
    });
  }, []);
  if (taskset_size_data.length > 0) {
    return (
      <Chart size={{ height: 300 }}>
        <Settings
          theme={EUI_CHARTS_THEME_DARK.theme}
          rotation={0}
          showLegend={true}
          legendPosition="right"
        />
        <BarSeries
          id="setStats"
          name="Set Stats"
          data={taskset_size_data}
          xScaleType={ScaleType.Linear}
          yScaleType={ScaleType.Linear}
          xAccessor="vizType"
          yAccessors={["count"]}
          splitSeriesAccessors={["issueType"]}
          color={euiPaletteColorBlind()}
        />
        <Axis id="bottom-axis" position={"bottom"} />
        <Axis id="left-axis" position={"left"} />
      </Chart>
    );
  } else {
    return (
      <EuiText>
        You have not completed any sets yet. complete some tasks to start
        earning streaks.
      </EuiText>
    );
  }
};

export const Week_workload = () => {
  const db_Context = useContext(databaseContext);
  const [taskset_size_data, set_taskset_size_data] = useState<any>([]);

  useEffect(() => {
    let setMap: any = [];

    db_Context.schedule_db.getSchedule().then((schedule: any) => {
      Object.keys(schedule).map((day: any) => {
        Object.keys(schedule[day]).map((setId: string) => {
          let taskNum = Object.keys(schedule[day][setId].tasks).length;
          setMap.push({ vizType: day, count: taskNum, issueType: setId });
        });
      });
      set_taskset_size_data(setMap);
    });
  }, []);

  return (
    <Chart size={{ height: 300 }}>
      <Settings
        theme={EUI_CHARTS_THEME_DARK.theme}
        rotation={90}
        showLegend
        legendPosition="bottom"
      />
      <BarSeries
        id="week-workload"
        name="Week workload"
        xScaleType={ScaleType.Linear}
        yScaleType={ScaleType.Linear}
        data={taskset_size_data}
        xAccessor="vizType"
        yAccessors={["count"]}
        splitSeriesAccessors={["issueType"]}
        stackAccessors={["issueType"]}
        color={euiPaletteColorBlind()}
      />
      <Axis
        id="bottom-axis"
        position={"bottom"}
        tickFormat={(d) => {
          if (d % 1 == 0) {
            return Number(d).toString();
          } else {
            return "";
          }
        }}
      />

      <Axis id="left-axis" position={"left"} />
    </Chart>
  );
};

export const App_stats = () => {
  const db_Context = useContext(databaseContext);
  const [app_stats, set_app_stats] = useState<any>({
    tasks_done: 0,
    sets_done: 0,
  });

  useEffect(() => {
    db_Context.stats_db.getStatsDB().then((stats: any) => {
      console.log(stats);
      set_app_stats({
        tasks_done: stats.app.tasks_done,
        sets_done: stats.app.sets_done,
      });
    });
  }, []);

  return (
    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiStat
          title={app_stats.tasks_done}
          description="Total Number of tasks completed"
          titleColor="primary"
        />
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiStat
          title={app_stats.sets_done}
          description="Total Number of sets completed"
          titleColor="secondary"
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
