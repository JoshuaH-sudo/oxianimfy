import React, { Fragment, useContext } from "react";
import {
  EuiButton,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from "@elastic/eui";
import { databaseContext } from "../App";
import Task_selection from "./Task_selection";

const Page: React.FC = () => {
  const db_context = useContext(databaseContext);

  return (
    <Fragment>
      <EuiText>Tasks To Do Today</EuiText>
      <Task_selection />
      <EuiPanel paddingSize="l">
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              href="/"
              onClick={() => {
                db_context.app_manager.subtractDay(3);
              }}
            >
              go back 1 day
            </EuiButton>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              href="/"
              onClick={() => {
                db_context.app_manager.addDay();
              }}
            >
              go foward 1 day
            </EuiButton>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              href="/"
              onClick={() => {
                db_context.app_storage.clear();
              }}
            >
              Clear data
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
    </Fragment>
  );
};

export default Page;
