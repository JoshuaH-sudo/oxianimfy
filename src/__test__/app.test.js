import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import Play from "../pages/Play";
import Task from "../pages/Task_creation";
import Edit_task_menu from "../pages/Edit_task_menu";
import { Stats } from "../pages/Stats_display";
import Task_selection from "../pages/Task_selection";
const pages = [
  <App />,
  <Play tasks_list={""} />,
  <Task />,
  <Edit_task_menu />,
  <Stats />,
  <Task_selection />,
];

describe("Rendering pages", () => {
  test.each(pages)("Page %p renders without crashing", (element) => {
    const { baseElement } = render(element);
    expect(baseElement).toBeDefined();
  });
});