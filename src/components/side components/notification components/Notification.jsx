import React, { useState } from "react";
import ButtonData from "./ButtonData.jsx";
import ButtonItem from "../containers/ButtonItem.jsx";
import FormItem from "../containers/FormItem.jsx";
import ListItem from "../containers/ListItem.jsx";
import SideItem from "../containers/SideItem.jsx";
import useRefreshIcon from "../../../hooks/useRefreshIcon.jsx";
import useStatusForm from "../../../hooks/useStatusForm.jsx";

const Notification = (props) => {
  const { loading, username } = props;
  const className = "btn filterMembersBtn active show";
  
  const [search, setSearch] = useState("");

  const notifications = useStatusForm(props.notifications, ["seen"], ["message"]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    return notifications.handleSearch(value);
  };

  const buttons = ButtonData.map((button) => (
    <ButtonItem
      key={button.id}
      name={button.name}
      className={
        notifications.showStatus === button.name ? className : button.className
      }
      text={button.text}
      handleStatus={notifications.handleStatus}
    />
  ));

  const myNotifications = notifications.status &&
    notifications.status !== undefined &&
    notifications.status.map((notification) => (
      <ListItem
        key={notification.id}
        className="notification"
        obj={notification}
      />
    ));

  const form = (
    <FormItem
      key="NotificationForm"
      search={search}
      iconText="filter_list"
      className="filter-list"
      placeholder="Filter notifications..."
      handleChange={handleChange}
    />
  );

  return (
    <SideItem
      id="notifications"
      head="Notifications"
      form={form}
      refreshButton={props.refresh.button}
      buttons={buttons}
      list={myNotifications}
      loading={loading}
    />
  );
};


export default Notification;
