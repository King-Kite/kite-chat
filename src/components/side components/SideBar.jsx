import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as cActions from "../../store/actions/contacts";
import * as dActions from "../../store/actions/discussions";
import * as mActions from "../../store/actions/myInfo";
import * as nActions from "../../store/actions/notifications";
import Discussion from "./discussion components/Discussion.jsx";
import Member from "./member components/Member.jsx";
import Notification from "./notification components/Notification.jsx";
import Settings from "./settings components/Settings.jsx";
import useRefreshIcon from "../../hooks/useRefreshIcon.jsx";

const SideBar = (props) => {
  const { username, contacts, connected, notifications, cLoading, nLoading } = props;

  const getContacts = () => {
    props.onGetContacts(username);
    return cRefresh.handleClick(false);
  }

  const getDiscussions = () => {
    props.getDiscussions(username);
    return dRefresh.handleClick(false);
  }

  const getUserData = () => {
    props.onGetMyInfo(username);
    return mRefresh.handleClick(false);
  };

  const getNotifications = () => {
    props.getNotifications(username);
    return nRefresh.handleClick(false);
  }

  const cRefresh = useRefreshIcon(getContacts);
  const dRefresh = useRefreshIcon(getDiscussions);
  const mRefresh = useRefreshIcon(getUserData);
  const nRefresh = useRefreshIcon(getNotifications);

  useEffect(() => {
    if (connected === true) {
      getUserData();
      getContacts();
      getNotifications();
      getDiscussions();
    }
  }, [connected]);

  const display =
    props.component_name === "member" ? (
      <Member
        key={1}
        username={username}
        contacts={contacts}
        loading={cLoading}
        refresh={cRefresh}
      />
    ) : props.component_name === "discussion" ? (
      <Discussion
        key={2}
        connected={connected}
        username={username}
        refresh={dRefresh}
      />
    ) : props.component_name === "notification" ? (
      <Notification 
        key={3} 
        username={username} 
        refresh={nRefresh}
        notifications={notifications} 
        loading={nLoading}
      />
    ) : (
      <Settings
        key={4}
        refresh={mRefresh}
      />
    );

  return (
    <div className="sidebar" id="sidebar">
      <div className="container">
        <div className="col-md-12">
          <div className="tab-content">{display}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    connected: state.base.connected,
    contacts: state.contacts.contacts,
    cLoading: state.contacts.loading,
    notifications: state.notifications.notifications,
    nLoading: state.notifications.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetContacts: (username) => dispatch(cActions.getContacts(username)),
    onGetMyInfo: (username) => dispatch(mActions.getMyInfo(username)),
    getDiscussions: (username) => dispatch(dActions.getDiscussions(username)),
    getNotifications: (username) => dispatch(nActions.getNotifications(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);