import { App_index } from "../src/index";
import { pageUrls } from "../src/utils/constants";

const renderer = require("react-test-renderer");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);

/**
 * @jest-environment jsdom
 */

describe("page renders", () => {
  it("app renders correctly", () => {
    const main_app = renderer.create(<App_index />).toJSON();
    expect(main_app).toMatchSnapshot();
  });

  it("pages renders correctly", () => {
    const url_refs: any = Object.keys(pageUrls);
    url_refs.forEach((url: any) => {
      window.location.hash = url_refs[url];
      const main_app = renderer.create(<App_index />).toJSON();
      expect(main_app).toMatchSnapshot();
    });
  });
});
