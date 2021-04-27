import React, { useState } from "react";
import useDropDown from "../../../../hooks/useDropDown.jsx";

const Connection = (props) => {
  const [skrill, setSkrill] = useState(true);
  const [dropbox, setDropbox] = useState(true);
  const [drive, setDrive] = useState(false);
  const [trello, setTrello] = useState(false);
  const dropDown = useDropDown("collapse", "title collapsed");

  const handleChange = (event) => {
    const name = event.target.name;
    return name === "skrill"
      ? setSkrill(!skrill)
      : name === "dropbox"
      ? setDropbox(!dropbox)
      : name === "drive"
      ? setDrive(!drive)
      : setTrello(!trello);
  };

  return (
    <div className="category">
      <a
        onClick={dropDown.handleClick}
        href="#"
        className={dropDown.aValue}
        id="headingFour"
      >
        <i className="material-icons md-30 online">sync</i>
        <div className="data">
          <h5>Connections</h5>
          <p>Sync your social accounts</p>
        </div>
        <i className="material-icons">keyboard_arrow_right</i>
      </a>
      <div className={dropDown.divValue} id="collapseFour">
        <div className="content">
          <div className="app">
            <img src="dist/img/integrations/slack.svg" alt="app" />
            <div className="permissions">
              <h5>Skrill</h5>
              <p>Read, Write, Comment</p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="skrill"
                checked={skrill}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="app">
            <img src="dist/img/integrations/dropbox.svg" alt="app" />
            <div className="permissions">
              <h5>Dropbox</h5>
              <p>Read, Write, Upload</p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="dropbox"
                checked={dropbox}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="app">
            <img src="dist/img/integrations/drive.svg" alt="app" />
            <div className="permissions">
              <h5>Google Drive</h5>
              <p>No permissions set</p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="drive"
                checked={drive}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="app">
            <img src="dist/img/integrations/trello.svg" alt="app" />
            <div className="permissions">
              <h5>Trello</h5>
              <p>No permissions set</p>
            </div>
            <label className="switch">
              <input
                onChange={handleChange}
                type="checkbox"
                name="trello"
                checked={trello}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// class Connection extends Component {
// 	state = {
// 		skrill : true,
// 		dropbox : true,
// 		drive : false,
// 		trello : false,
// 		dropDivDownClass: "collapse",
// 		dropADownClass: "title collapsed"
// 	};

// 	handleDropDown = () => {
// 		return this.state.dropDivDownClass === "collapse" ?
// 			this.setState({ dropDivDownClass : "collapse show", dropADownClass : "title" }) :
// 				this.setState({ dropDivDownClass : "collapse", dropADownClass : "title collapsed" })
// 	}

// 	handleChange = (event) => {

// 	}

// 	render() {
// 		return (
// 			<div className="category">
// 				<a
// 					onClick={this.handleDropDown}
// 					href="#"
// 					className={this.state.dropADownClass}
// 					id="headingFour"
// 				>
// 					<i className="material-icons md-30 online">sync</i>
// 					<div className="data">
// 						<h5>Connections</h5>
// 						<p>Sync your social accounts</p>
// 					</div>
// 					<i className="material-icons">keyboard_arrow_right</i>
// 				</a>
// 				<div
// 					className={this.state.dropDivDownClass}
// 					id="collapseFour"
// 				>
// 					<div className="content">
// 						<div className="app">
// 							<img src="dist/img/integrations/slack.svg" alt="app" />
// 							<div className="permissions">
// 								<h5>Skrill</h5>
// 								<p>Read, Write, Comment</p>
// 							</div>
// 							<label className="switch">
// 								<input
// 									onChange={this.handleChange}
// 									type="checkbox"
// 									name="skrill"
// 									checked={this.state.skrill}
// 								/>
// 								<span className="slider round"></span>
// 							</label>
// 						</div>
// 						<div className="app">
// 							<img src="dist/img/integrations/dropbox.svg" alt="app" />
// 							<div className="permissions">
// 								<h5>Dropbox</h5>
// 								<p>Read, Write, Upload</p>
// 							</div>
// 							<label className="switch">
// 								<input
// 									onChange={this.handleChange}
// 									type="checkbox"
// 									name="dropbox"
// 									checked={this.state.dropbox}
// 								/>
// 								<span className="slider round"></span>
// 							</label>
// 						</div>
// 						<div className="app">
// 							<img src="dist/img/integrations/drive.svg" alt="app" />
// 							<div className="permissions">
// 								<h5>Google Drive</h5>
// 								<p>No permissions set</p>
// 							</div>
// 							<label className="switch">
// 								<input
// 									onChange={this.handleChange}
// 									type="checkbox"
// 									name="drive"
// 									checked={this.state.drive}
// 								/>
// 								<span className="slider round"></span>
// 							</label>
// 						</div>
// 						<div className="app">
// 							<img src="dist/img/integrations/trello.svg" alt="app" />
// 							<div className="permissions">
// 								<h5>Trello</h5>
// 								<p>No permissions set</p>
// 							</div>
// 							<label className="switch">
// 								<input
// 									onChange={this.handleChange}
// 									type="checkbox"
// 									name="trello"
// 									checked={this.state.trello}
// 								/>
// 								<span className="slider round"></span>
// 							</label>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}
// }

export default Connection;
