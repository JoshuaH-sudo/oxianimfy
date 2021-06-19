import React, { useState } from "react";
import {
  EuiButtonIcon,
  EuiPopover,
  EuiContextMenu,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
} from "@elastic/eui";

import { pageUrls } from "../utils/constants";

export const Nav_bar = () => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const panels = [
    {
      id: 0,
      title: "Navigation",
      items: [
        {
          name: "Home",
          href: pageUrls.home,
        },
        {
          name: "Create a New Task",
          href: pageUrls.task_create,
        },
        {
          name: "Do tasks for today",
          href: pageUrls.task_select,
        },
        {
          name: "Edit tasks",
          href: pageUrls.task_edit,
        },
        {
          name: "View Stats",
          href: pageUrls.stats,
        },
      ],
    },
  ];
  const nav_button = (
    <EuiButtonIcon
      iconType="menu"
      size="m"
      onClick={() => setPopoverOpen(true)}
    />
  );
  const menuNav = (
    <EuiPopover
      id="contextMenuExample"
      button={nav_button}
      isOpen={isPopoverOpen}
      closePopover={() => setPopoverOpen(false)}
      panelPaddingSize="none"
      anchorPosition="downLeft"
    >
      <EuiContextMenu initialPanelId={0} panels={panels} />
    </EuiPopover>
  );

  const sections = [
    {
      items: [<EuiButtonIcon iconType="home" size="m" href="#/" />],
      borders: "right",
    },
    {
      items: [menuNav],
    },
  ];

  return <EuiHeader sections={sections} />;
};
export const Control_bar = () => {
  return (
    <EuiFlexGroup
      id="control_bar_nav"
      gutterSize="none"
      justifyContent="spaceEvenly"
      responsive={false}
    >
      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          iconType="home"
          href={pageUrls.home}
          className="control_bar_item"
        />
        <EuiText>Home</EuiText>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          iconType="plus"
          href={pageUrls.task_create}
          className="control_bar_item"
        />
        <EuiText>Add Tasks</EuiText>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          iconType="pencil"
          href={pageUrls.task_edit}
          className="control_bar_item"
        />
        <EuiText>Edit Tasks</EuiText>
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiButtonIcon
          iconType="stats"
          href={pageUrls.stats}
          className="control_bar_item"
        />
        <EuiText>stats</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
