import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const LOCAL_STORAGE_KEY = "react_todo_list";

function Header(props) {
  return <h1>{props.name}</h1>;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      note: "",
      editedNote: { id: null, value: "" },
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let savedNotes;
    try {
      savedNotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch (error) {
      savedNotes = [];
      this.saveNotes(savedNotes);
    }

    this.setState({
      notes: savedNotes,
    });
  }

  handleChange(value) {
    this.setState({ note: value });
  }

  saveEditedNote(index) {
    const notes = this.state.notes;
    const foundNote = this.state.notes.find((note) => note.id === index);

    if (foundNote && this.state.editedNote.value.trim()) {
      foundNote.value = this.state.editedNote.value;
      this.setState({ notes: notes });
      this.setState({
        editedNote: { ...this.state.editedNote, value: "" },
      });
      this.saveNotesToLocalStorage(notes);
    }
    this.setState({ editedNote: { id: null, value: "" } });
  }

  addNote() {
    const notesCount = this.state.notes.length;
    const lastId = this.state.notes[notesCount - 1]?.id || 0;
    const todoItem = this.state.note.trim();

    if (todoItem) {
      const notes = [
        ...this.state.notes,
        { id: lastId + 1, value: todoItem, striked: false },
      ];

      this.setState({
        notes: notes,
      });
      this.saveNotesToLocalStorage(notes);
    }

    this.setState({ note: "" });
  }

  saveNotesToLocalStorage(notes) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }

  deleteNote(index) {
    const notes = this.state.notes.filter((note) => note.id !== index);

    this.setState({
      notes: notes,
    });
    this.saveNotesToLocalStorage(notes);
  }

  changeNoteStatus(index) {
    const notes = this.state.notes.map((note) => ({
      ...note,
      striked: note.id !== index ? note.striked : !note.striked,
    }));

    this.setState({
      notes: notes,
    });
    this.saveNotesToLocalStorage(notes);
  }

  handleEditingNoteChange(value) {
    this.setState({ editedNote: { ...this.state.editedNote, value: value } });
  }

  enableEditMode(index) {
    const foundNote = this.state.notes.find((note) => note.id === index);
    this.setState({ editedNote: { id: index, value: foundNote.value } });
  }

  disableEditMode() {
    this.setState({ editedNote: { id: null, value: "" } });
  }

  render() {
    return (
      <div>
        <Header name="ToDo list" />
        <div>
          <input
            onChange={(event) => this.handleChange(event.target.value)}
            value={this.state.note}
          ></input>
          <button className="btn" onClick={() => this.addNote()}>
            Add task
          </button>
          {this.state.notes.map((note) => (
            <ToDoItem
              key={note.id}
              name={note.value}
              id={note.id}
              striked={note.striked}
              editedNote={this.state.editedNote}
              onNoteStatusChange={() => this.changeNoteStatus(note.id)}
              onNoteDelete={() => this.deleteNote(note.id)}
              onEditNoteInput={(value) => this.handleEditingNoteChange(value)}
              onEditConfirm={() => this.saveEditedNote(note.id)}
              onEditBtnClick={() => this.enableEditMode(note.id)}
              onEditCancel={() => this.disableEditMode()}
            />
          ))}
        </div>
      </div>
    );
  }
}

function ToDoItem(props) {
  return (
    <div className="todo-item">
      <button className="btn" onClick={props.onNoteDelete}>
        X
      </button>

      {props.editedNote.id !== null && props.editedNote.id === props.id ? (
        <>
          <input
            className="ml20"
            value={props.editedNote.value}
            onChange={(event) => props.onEditNoteInput(event.target.value)}
          ></input>
          <button className="btn" onClick={props.onEditConfirm}>
            Save
          </button>
          <button className="btn" onClick={props.onEditCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            className={(props.striked ? " striked " : "") + "ml20"}
            onClick={props.onNoteStatusChange}
          >
            {props.name}
          </span>
          <button className="btn" onClick={props.onEditBtnClick}>
            Edit
          </button>
        </>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
