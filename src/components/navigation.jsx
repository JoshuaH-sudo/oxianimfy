import React, { useEffect, useState } from "react";
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

  return <EuiHeader id="header_nav" sections={sections} />;
};
export const Control_bar = () => {
  const [current_hash, set_hash] = useState(window.location.hash);
  window.addEventListener("hashchange", () => set_hash(window.location.hash)); 
  return (
    <EuiFlexGroup
      id="control_bar_nav"
      gutterSize="none"
      justifyContent="spaceEvenly"
      responsive={false}
    >
      <EuiFlexItem >
        <EuiButtonIcon
          iconType="home"
          href={pageUrls.home}
          display={current_hash === pageUrls.home ? "fill" : ""}
          className="control_bar_item"
        />
        <EuiText>Home</EuiText>
      </EuiFlexItem>

      <EuiFlexItem >
        <EuiButtonIcon
          iconType="play"
          href={pageUrls.task_select}
          display={current_hash === pageUrls.task_select ? "fill" : ""}
          className="control_bar_item"
        />
        <EuiText>Play</EuiText>
      </EuiFlexItem>

      <EuiFlexItem >
        <EuiButtonIcon
          iconType="plus"
          href={pageUrls.task_create}
          display={current_hash === pageUrls.task_create ? "fill" : ""}
          className="control_bar_item"
        />
        <EuiText>Add</EuiText>
      </EuiFlexItem>

      <EuiFlexItem >
        <EuiButtonIcon
          iconType="pencil"
          href={pageUrls.task_edit}
          display={current_hash === pageUrls.task_edit ? "fill" : ""}
          className="control_bar_item"
        />
        <EuiText>Edit</EuiText>
      </EuiFlexItem>

      <EuiFlexItem >
        <EuiButtonIcon
          iconType="stats"
          href={pageUrls.stats}
          display={current_hash === pageUrls.stats ? "fill" : ""}
          className="control_bar_item"
        />
        <EuiText>stats</EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};
