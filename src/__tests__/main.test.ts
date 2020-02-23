import mystore, { store } from "./store";

test("1", () => {
  expect(mystore.user.name).toEqual("username");
  expect(mystore.items.data).toEqual("itemsdata");
});

test("2", () => {
  expect(store.getState[mystore.user.name]).toEqual("username");
});
