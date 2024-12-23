// export default defineBackground(() => {
//   console.log('Hello background!', { id: browser.runtime.id });
// });

import "webext-dynamic-content-scripts";
import addPermissionToggle from "webext-permission-toggle";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  addPermissionToggle();
});