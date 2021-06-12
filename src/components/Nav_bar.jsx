import React, { useState } from "react";
import {
  EuiButtonIcon,
  EuiPopover,
  EuiContextMenu,
  EuiHeader,
} from "@elastic/eui";

export const Nav_bar = () => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const panels = [
    {
      id: 0,
      title: "Navigation",
      items: [
        {
          name: "Home",
          href: "#/",
        },
        {
          name: "Create a New Task",
          href: "#/task-creation",
        },
        {
          name: "Do tasks for today",
          href: "#/task_selection",
        },
        {
          name: "Edit tasks",
          href: "#/edit-tasks",
        },
        {
          name: "View Stats",
          href: "#/stats",
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
