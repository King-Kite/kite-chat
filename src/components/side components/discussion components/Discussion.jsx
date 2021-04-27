import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/chat";
import ButtonData from "./ButtonData.jsx";
import ButtonItem from "../containers/ButtonItem.jsx";
import FormItem from "../containers/FormItem.jsx";
import ListItem from "../containers/ListItem.jsx";
import SideItem from "../containers/SideItem.jsx";
import Popup from "./Popup.jsx";
import usePopClass from "../../../hooks/usePopClass.jsx";
import useRefreshIcon from "../../../hooks/useRefreshIcon.jsx";
import useStatusForm from "../../../hooks/useStatusForm.jsx";

const Discussion = (props) => {
  const { loading, username } = props;
  const className = "btn filterDiscussionsBtn active show";

  const [search, setSearch] = useState("");

  const discussions = useStatusForm(
    props.discussions,
    ["user_info", "unread_count"],
    ["user_info", "full_name"]
  );
  const popUp = usePopClass("modal fade");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    return discussions.handleSearch(value);
  };

  const myDiscussions =
    discussions.status &&
    discussions.status.map((friend) => (
      <ListItem
        key={friend.user_info !== null && friend.user_info !== undefined && friend.user_info.username}
        className="unread single active"
        obj={friend && friend !== undefined && friend}
        handleClick={() => props.startChat(friend.name, username, props.name)}
      />
    ));

  const buttons = ButtonData.map((button) => (
    <ButtonItem
      key={button.id}
      name={button.name}
      className={
        discussions.showStatus === button.name ? className : button.className
      }
      text={button.text}
      handleStatus={discussions.handleStatus}
    />
  ));

  const form = (
    <FormItem
      key={"discussionForm"}
      search={search}
      placeholder="Search for conversations..."
      iconText="search"
      handleChange={handleChange}
      handlePopClass={popUp.handlePopClass}
    />
  );

  const pop = (
    <div className={popUp.value} id="exampleModalCenter">
      <Popup
        key={"createDiscussion"}
        username={username}
        discussions={discussions.list}
        contacts={props.contacts}
        handlePopClass={popUp.handlePopClass}
      />
    </div>
  );

  return (
    <SideItem
      id="discussions"
      head="Discussions"
      form={form}
      refreshButton={props.refresh.button}
      buttons={buttons}
      list={myDiscussions}
      popUp={pop}
      loading={loading}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    name: state.chat.name,
    contacts: state.contacts.contacts,
    discussions: state.discussions.discussions,
    loading: state.discussions.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startChat: (chat_name, username, name) => {
      if (name !== chat_name) {
        dispatch(actions.stopChat(chat_name, username));
        dispatch(actions.startChat(chat_name, username))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);
