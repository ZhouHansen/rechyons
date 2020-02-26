import hyperstore, { store } from "./store";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import TestComponent from "./TestComponent";
import "@testing-library/jest-dom/extend-expect";

test("reducer key name ", () => {
  expect(hyperstore.user.name).toEqual("user/name");
  expect(hyperstore.items.data).toEqual("items/data");
});

test("get state", () => {
  expect(store.getState()[hyperstore.user.name]).toEqual("zhc");
});

test("update state", () => {
  hyperstore.user.update("name", "zhchh");
  expect(store.getState()[hyperstore.user.name]).toEqual("zhchh");
});

test("update state by passing object", () => {
  hyperstore.items.update({ data: [3, 2], height: 333 });
  expect(store.getState()[hyperstore.items.data]).toEqual([3, 2]);
  expect(store.getState()[hyperstore.items.height]).toEqual(333);
});

test("connect to react component", async () => {
  const { findByTestId } = render(
    <Provider store={store}>
      <TestComponent></TestComponent>
    </Provider>
  );
  const button = await findByTestId("button");
  expect(button.textContent).toEqual("zhchh");
  fireEvent.click(button);
  expect(button.textContent).toEqual("abc");
});
