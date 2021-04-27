import React from "react";
import { loadingDiv } from "../../../constants";

const SideItem = (props) => {
  const { id, form, refreshButton, buttons, head, loading, list, popUp } = props;
  const display = loading === true ? loadingDiv :
    list && list.length <= 0 ? <h1 className="text-center">There are no {head}!</h1> :
      list;
  return (
    <React.Fragment>
      <div id={id} className="tab-pane fade active show">
        <div className="search">{form}</div>
        {refreshButton}
        <div className="list-group sort">{buttons}</div>
        <div className={id}>
          <h1>{head}</h1>
          <div className="list-group" id="chats" role="tablist">
            {display}
          </div>
        </div>
      </div>
      {popUp && popUp !== undefined && popUp}
    </React.Fragment>
  );
};

export default SideItem;
