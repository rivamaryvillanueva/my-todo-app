import React, { useEffect, useState } from "react";
import "./App.css";
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Components/Header";
import { Tab, Tabs } from 'react-bootstrap';

function Todo({ todo, index, completeTodo, deleteTodo, editTodo }) {
  const handleChange = () => {
    completeTodo(index);
  };
  return (
    <div className="todo-section" style={{margin: "0px"}} >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Form.Check
          style={{ width: "450px" }}
          type="checkbox"
          label ={<span style={{ textDecoration: todo.completed ? "line-through" : "" }}>{todo.text}</span>}
          checked={todo.isDone}
          onChange={handleChange}
        />
        <div>
          <Button style={{ marginTop: "0px" }} variant="outline-primary" onClick={() => editTodo(index)}>🖊</Button>{' '}
          <Button style={{ marginTop: "0px" }} variant="outline-danger" onClick={() => deleteTodo(index)}>✕</Button>
        </div>
      </div>

    </div>
  );
}

function CompletedTodo({ todo, index, completeTodo, deleteTodo }) {
  const handleChange = () => {
    completeTodo(index);
  };
  return (
    <div className="todo-section" style={{margin: "0px"}} >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Form.Check
          style={{ width: "450px" }}
          type="checkbox"
          label ={<span style={{ textDecoration: todo.completed ? "line-through" : "" }}>{todo.text}</span>}
          checked={todo.isDone}
          onChange={handleChange}
        />
        <div>
          <Button style={{ marginTop: "0px", marginLeft: "45px" }} variant="outline-danger" onClick={() => deleteTodo(index)}>✕</Button>
        </div>
      </div>

    </div>
  );
}

function TodoForm({ createTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    createTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}> 
    <InputGroup  style={{marginTop:"10px"}} className="mb-3">
      <Button style={{marginTop:"0px"}} variant="outline-secondary" type="submit"> + </Button>
      <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new todo" />
    </InputGroup>
  </Form>
  );
}

function DeleteAllButton({ deleteAllTodos }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteAll = () => {
    deleteAllTodos();
    setShowConfirmation(false);
  };

  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button variant="danger" onClick={handleShowConfirmation}>
        Clear All
      </Button>
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Clear All Todos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to clear all todos? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteAll}>
            Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  const [selectedTodoText, setSelectedTodoText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
      setAllTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    const active = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);
    setActiveTodos(active);
    setCompletedTodos(completed);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(allTodos));
  }, [allTodos]);

  const createTodo = (text) => {
    const newTodos = [...allTodos, { text, completed: false, id: Date.now() }];
    setAllTodos(newTodos);
    setTodos(newTodos);
  };

  const completeTodo = (index) => {
    const newTodos = [...allTodos];
    newTodos[index].completed = true;
    setAllTodos(newTodos);
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = allTodos.filter((_, i) => i !== index);
    setAllTodos(newTodos);
    setTodos(newTodos);
  };

  const deleteAllTodos = () => {
    setAllTodos([]);
    setTodos([]);
  };

  const handleInputChange = (e) => {
    setSelectedTodoText(e.target.value);
    if (e.key === 'Enter') {
      handleSaveChanges();
    }
  };

  const handleShowModal = (index) => {
    setSelectedTodoIndex(index);
    setShowModal(true);
    setSelectedTodoText(todos[index].text);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTodoText('');
  };

  const editTodo = (index) => {
    handleShowModal(index);
  };

  const handleSaveChanges = () => {
    if (selectedTodoIndex !== null && selectedTodoText !== '') {
      const newTodos = [...allTodos];
      newTodos[selectedTodoIndex].text = selectedTodoText;
      setAllTodos(newTodos);
      setTodos(newTodos);
      setShowModal(false);
      setSelectedTodoText('');
    }
  };

  return (
    <div className="todo-app">
      <Header />
      <div className="taskContainer">
      <TodoForm createTodo={createTodo} />
        <Tabs className="activeTab" defaultActiveKey="active" id="todo-tabs">
          <Tab eventKey="active" title="Active">
            <div>
              {activeTodos.map((todo) => (
                <Card key={todo.id}>
                  <Card.Body>
                    <Todo
                      index={todos.indexOf(todo)}
                      todo={todo}
                      completeTodo={completeTodo}
                      deleteTodo={deleteTodo}
                      editTodo={editTodo}
                    />
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab eventKey="completed" title="Completed">
            <div>
              {completedTodos.map((todo) => (
                <Card key={todo.id}>
                  <Card.Body>
                    <CompletedTodo
                      index={todos.indexOf(todo)}
                      todo={todo}
                      completeTodo={completeTodo}
                      deleteTodo={deleteTodo}
                    />
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Tab>
        </Tabs>
        <div className="clearCompleted">
          <DeleteAllButton deleteAllTodos={deleteAllTodos} />
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Control type="text" value={selectedTodoText} onChange={handleInputChange} onKeyPress={handleInputChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
}

export default App;