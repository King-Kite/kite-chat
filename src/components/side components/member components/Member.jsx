import React, { useState } from "react";
import ButtonData from "./ButtonData.jsx";
import ButtonItem from "../containers/ButtonItem.jsx";
import FormItem from "../containers/FormItem.jsx";
import ListItem from "../containers/ListItem.jsx";
import SideItem from "../containers/SideItem.jsx";
import Popup from "./Popup.jsx";
import usePopClass from "../../../hooks/usePopClass.jsx";
import useStatusForm from "../../../hooks/useStatusForm.jsx";

const Member = (props) => {
  const { loading, username } = props;
  const className = "btn filterMembersBtn active show";

  const members = useStatusForm(
    props.contacts,
    ["logged_in"],
    ["user_info", "full_name"]
  );
  const popUp = usePopClass("modal fade");

  const [search, setSearch] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    return members.handleSearch(value);
  };

  const buttons = ButtonData.map((button) => (
    <ButtonItem
      key={button.id}
      name={button.name}
      className={
        members.showStatus === button.name ? className : button.className
      }
      text={button.text}
      handleStatus={members.handleStatus}
    />
  ));

  const myMembers = members.status !== null &&
    members.status !== undefined &&
    members.status.map((user) => (
      <ListItem key={user.id} className="contact" obj={user} />
    ));

  const form = (
    <FormItem
      key={1}
      search={search}
      iconText="search"
      placeholder="Search for people..."
      handleChange={handleChange}
      handlePopClass={popUp.handlePopClass}
    />
  );

  const pop = (
    <div className={popUp.value} id="exampleModalCenter">
      <Popup
        key={2}
        contacts={members.list}
        handlePopClass={popUp.handlePopClass}
        username={username}
      />
    </div>
  );
  return (
    <SideItem
      id="contacts"
      head="Contacts"
      form={form}
      refreshButton={props.refresh.button}
      buttons={buttons}
      list={myMembers}
      popUp={pop}
      loading={loading}
    />
  );
};

export default Member;

/*
function toCapitalize(str) {
  let firstletter = str[0].toUpperCase();
  let otherLetters = str.slice(1);
  let otherArray = [];
  for (let i = 0; i < otherLetters.length; i++) {
    otherArray.push(otherLetters[i].toLowerCase());
  }
  let value = firstletter + otherArray.join('')
  return value;
}
*/
