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

function App() {
  const [todos, setTodos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState(null);
  const [selectedTodoText, setSelectedTodoText] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) setTodos(storedTodos);
  }, []);

  useEffect(() => {
    const active = todos.filter((todo) => !todo.completed);
    const completed = todos.filter((todo) => todo.completed);
    setActiveTodos(active);
    setCompletedTodos(completed);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const createTodo = (text) => {
    const newTodos = [...todos, { text, completed: false, id: Date.now() }];
    setTodos(newTodos);
  };

  const completeTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = true;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
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
      const newTodos = [...todos];
      newTodos[selectedTodoIndex].text = selectedTodoText;
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
        </Tabs>
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
  );
}

export default App;