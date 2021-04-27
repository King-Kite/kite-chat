import React from "react";

const ListItem = (props) => {
  const obj = props.obj;

  const iClassName =
    obj.logged_in !== null && obj.logged_in !== undefined
      ? obj.logged_in === true
        ? "online"
        : "offline"
      : obj.user_info.logged_in !== null &&
        obj.user_info.logged_in !== undefined
      ? obj.user_info.logged_in === true
        ? "online"
        : "offline"
      : "offline";

  const handleClick =
    props.handleClick && props.handleClick !== undefined && props.handleClick;

  const data1 = (
    <React.Fragment>
      <div className="data">
        <h5>{obj.user_info.full_name}</h5>
        <p>{obj.user_info.location}</p>
      </div>
      <div className="person-add">
        <i className="material-icons">person</i>
      </div>
    </React.Fragment>
  );

  const data2 = (
    <React.Fragment>
      <div className="data">
        <p>{obj.message}</p>
        <span>{new Date(obj.date).toDateString()}</span>
        {obj.seen === true ? (
          <span className="ml-3">Seen</span>
        ) : (
          <span className="text-danger font-italic ml-3">New</span>
        )}
      </div>
    </React.Fragment>
  );

  const get_unread_class = () => {
    let count = obj.user_info.unread_count;
    let className;
    if (obj.user_info.is_friend === true) {
      if (count == 0) {
        className = "d-none";
      } else if (count > 0 && count < 5) {
        className = "new bg-green";
      } else if (count >= 5 && count < 10) {
        className = "new bg-yellow";
      } else if (count >= 10) {
        className = "new bg-pink";
      }
    } else {
      className = "new bg-gray";
    }
    return className;
  };

  const data3 = (
    <React.Fragment>
      <div className="data">
        <div className={get_unread_class()}>
          <span>
            {obj.user_info.is_friend === true
              ? `+${obj.user_info.unread_count}`
              : "?"}
          </span>
        </div>
        <h5>{obj.user_info.full_name}</h5>
        <span>
          {new Date(obj.user_info.last_msg_time).toString().slice(0, 3).trim()}
        </span>
        <p>{obj.user_info.last_message}</p>
      </div>
    </React.Fragment>
  );

  const getData = (className) => {
    return className === "contact"
      ? data1
      : className === "notification"
      ? data2
      : data3;
  };

  return (
    <a onClick={handleClick} href="#" className={props.className}>
      <img
        className="avatar-md"
        src={`http://localhost:8000${obj.user_info.image_url}`}
        title={obj.user_info.username}
        alt={obj.user_info.username}
      />
      <div className="status">
        <i className={`material-icons ${iClassName}`}>fiber_manual_record</i>
      </div>
      {getData(props.className)}
    </a>
  );
};

export default ListItem;
