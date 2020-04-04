/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export default (effect, dependencies) => {
  const status = {}; // mutable status object

  useEffect(() => {
    status.aborted = false;
    // pass the mutable object to the effect callback
    // store the returned value for cleanup
    const cleanUp = effect(status);

    return () => {
      // mutate the object to signal the consumer
      // this effect is cleaning up
      status.aborted = true;
      typeof cleanUp === "function" && cleanUp();
    };
  }, [...dependencies]);
};
