import React, { useEffect, useReducer } from "react";
import axios from "axios";
import useAbortableEffect from "./useAbortableEffect";
import userData from "./usersData";

const initState = {
  loading: false,
  user: null,
  filter: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload,
      };

    default:
      return state;
  }
};

const Users = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  const getUser = async (userId) => {
    return new Promise((resolve) => {
      const user = userId
        ? userData.filter((user) => user.id === userId)[0]
        : null;
      setTimeout(() => {
        resolve(user);
      }, Math.random() * 5000);
    });
  };

  const userClickHandler = (userIndex) => () =>
    dispatch({ type: "SET_FILTER", payload: userIndex });

  useAbortableEffect(
    (status) => {
      dispatch({ type: "SET_LOADING", payload: true });
      getUser(state.filter).then((user) => {
        if (status.aborted) return;
        dispatch({ type: "SET_USER", payload: user });
        dispatch({ type: "SET_LOADING", payload: false });
      });

      return {};
    },
    [state.filter]
  );

  return (
    <div className="userBox">
      <div className="leftPan">
        <h2>Users</h2>
        <ul>
          {userData.map((currentUser) => (
            <li key={currentUser.id} onClick={userClickHandler(currentUser.id)}>
              {currentUser.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="rightPan">
        <h2>
          User details of{" "}
          {state.filter !== null
            ? userData.filter((user) => user.id === state.filter)[0].name
            : null}
        </h2>
        {state.loading && <h1>Loading....</h1>}
        {state.user && !state.loading && (
          <ul>
            <li>{state.user.name}</li>
            <li>{state.user.email}</li>
            <li>{state.user.username}</li>
            <li>{state.user.phone}</li>
            <li>{state.user.website}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Users;
