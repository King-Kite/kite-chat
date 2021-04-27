import { store } from "./index";
import { chatUrl } from "./constants";
import * as actions from "./store/actions/base";

class WebSocketService {

  constructor() {
    this.socketRef = null;
  }

  callbacks = {};

  connect(chat_name, username) {
    let token = store.getState().auth.token;
    if (token !== null && token !== undefined) {
      const path = `${chatUrl}/${chat_name}/?token=${token}`;
      try {
        this.socketRef = new WebSocket(path);
      } catch (error) {
        // console.log(error);
      }
      if (this.socketRef !== null && this.socketRef !== undefined) {
        this.socketRef.onopen = () => {
          this.performAction({command: "new_presence", chat_name, username})
          store.dispatch(actions.baseConnected());
        };
        this.socketRef.onmessage = (e) => {
          this.socketNewMessage(e.data);
        };
        this.socketRef.onerror = (e) => {
          if (e.message && e.message !== undefined) {
            // console.log(e.message);
          }
        };
        this.socketRef.onclose = () => {
          const chat = store.getState().chat.name;
          token = store.getState().auth.token;
          if (chat_name === username) {
            store.dispatch(actions.baseConnectFail());
          }
          if (token !== null && (chat_name === username || chat_name === chat)) {
            this.connect(chat_name, username);
          }
        };
      }
    }
  }

  disconnect() {
    try {
      this.socketRef !== null && this.socketRef.close();
    } catch (error) {
      console.log(error);
    }
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    const info = parsedData.data;
    const keys = Object.keys(this.callbacks);
    if (keys.length === 0) {
      return;
    }
    if (keys.includes(command) === true) {
      this.callbacks[command](info)
    }
  }

  addCallback(name, callback) {
    this.callbacks[name] = callback;
  }

  removeCallback(name) {
    try {
      delete this.callbacks[name];
    } catch (error) {
      console.log(error);
    }
  }

  performAction(data) {
    this.sendMessage({ ...data })
  }

  sendMessage(data) {
    if (
      this.socketRef !== null &&
      this.socketRef !== undefined &&
      this.socketRef.readyState === 1 &&
      data !== null &&
      data !== undefined
    ) {
      try {
        this.socketRef.send(JSON.stringify({ ...data }));
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  state() {
    return this.socketRef !== null && this.socketRef.readyState;
  }

  waitForSocketConnection(callback) {
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(function () {
      if (socket.readyState === 1) {
        if (callback != null) {
          callback();
        }
        return;
      } else {
        recursion(callback);
      }
    }, 1);
  }
}

class BaseWebSocket extends WebSocketService {
  static instance = null;

  static getInstance() {
    if (!BaseWebSocket.instance) {
      BaseWebSocket.instance = new BaseWebSocket();
    }
    return BaseWebSocket.instance;
  };
};

class ChatWebSocket extends WebSocketService {
  static instance = null;

  static getInstance() {
    if (!ChatWebSocket.instance) {
      ChatWebSocket.instance = new ChatWebSocket();
    }
    return ChatWebSocket.instance;
  };
};

export const BaseInstance = BaseWebSocket.getInstance();
export const ChatInstance = ChatWebSocket.getInstance();
