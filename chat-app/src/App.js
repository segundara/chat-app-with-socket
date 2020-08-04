import React from "react";
import "./App.css";
import io from "socket.io-client";
import { Modal, InputGroup, FormControl, Button } from "react-bootstrap";
class App extends React.Component {
  socket = null;

  state = {
    username: null,
    message: "",
    messages: [],
    showModal: true,
  };

  componentDidMount() {
    const connOpt = {
      transports: ["websocket"],
    };

    this.socket = io("https://striveschool.herokuapp.com/", connOpt);

    this.socket.on("bmsg", (msg) =>
      this.setState({ messages: this.state.messages.concat(msg) })
    );
  }

  handleMessage = (e) => {
    this.setState({
      message: e.currentTarget.value,
    });
  };

  sendMessage = (e) => {
    e.preventDefault();
    if (this.state.message !== "") {
      this.socket.emit("bmsg", {
        user: this.state.username,
        message: this.state.message,
      });
      this.setState({
        message: "",
      });
    }
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  render() {
    return (
      <>
        <div className="App">
          <ul id="messages">
            {this.state.messages.map((msg, i) => (
              <li key={i}>
                <strong>{msg.user}</strong> {msg.message}
              </li>
            ))}
          </ul>
          <form id="chat" onSubmit={this.sendMessage}>
            <input
              autoComplete="off"
              value={this.state.message}
              onChange={this.handleMessage}
            />
            <button>Send</button>
          </form>
        </div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showModal}
          onHide={this.toggleModal}
        >
          <Modal.Header>
            <Modal.Title>Set username</Modal.Title>
            <Modal.Body>
              <InputGroup className="mb-3">
                <FormControl
                  onChange={(e) =>
                    this.setState({ username: e.currentTarget.value })
                  }
                ></FormControl>
              </InputGroup>
            </Modal.Body>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.toggleModal}>Submit</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default App;