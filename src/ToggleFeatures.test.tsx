// import * as React from "react";
import renderer from "react-test-renderer";

import { ToggleFeatures } from "./ToggleFeatures";
import { Features } from "./Features";

it("renders ToggleFeatures with correct checkboxes checked", () => {
  const component1 = renderer.create(
    <Features defaultEnabled={[]} features={[{ name: "A" }, { name: "B" }]}>
      <ToggleFeatures />
    </Features>
  );

  const component2 = renderer.create(
    <Features defaultEnabled={["A"]} features={[{ name: "A" }, { name: "B" }]}>
      <ToggleFeatures />
    </Features>
  );

  const component3 = renderer.create(
    <Features defaultEnabled={["C"]} features={[{ name: "A" }, { name: "B" }]}>
      <ToggleFeatures />
    </Features>
  );

  expect(component1.toJSON()).toMatchSnapshot();
  expect(component2.toJSON()).toMatchSnapshot();
  expect(component3.toJSON()).toMatchSnapshot();
});
