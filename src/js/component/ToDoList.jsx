import React, { useEffect, useState } from "react";

export const ToDoList = () => {
    const host = "https://playground.4geeks.com/todo";
    const [users, setUsers] = useState([]);
    const [todos, setTodos] = useState({});

    // Obtener todos los usuarios
    const getUsers = async () => {
        const uri = `${host}/users`;
        const options = {
            method: "GET"
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Failed to fetch users");
            return;
        }
        const data = await response.json();
        setUsers(data.users);
    };

    // Obtener las tareas de un usuario
    const getUserTodos = async (userName) => {
        const uri = `${host}/users/${userName}`;
        const options = {
            method: "GET"
        };
        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Failed to fetch todos");
            return;
        }
        const data = await response.json();
        setTodos((prevTodos) => ({
            ...prevTodos,
            [userName]: data.todos
        }));
    };

    // Agregar un nuevo usuario
    const addUser = async () => {
        const newUser = "Guille21"; // Puedes cambiar el nombre del usuario aquí
        const uri = `${host}/users/${newUser}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Failed to add user");
            return;
        }
        getUsers(); // Actualiza la lista de usuarios después de agregar uno nuevo
    };

    // Eliminar un usuario
    const deleteUser = async (userName) => {
        const uri = `${host}/users/${userName}`;
        const options = {
            method: "DELETE"
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Failed to delete user");
            return;
        }
        getUsers(); // Actualiza la lista de usuarios después de eliminar uno
    };

    // Agregar una nueva tarea para un usuario
    const addTodo = async (userName) => {
        const uri = `${host}/todos/${userName}`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                label: "Tarea desde Postman", // Puedes cambiar el label de la tarea aquí
                is_done: false
            })
        };

        const response = await fetch(uri, options);
        if (!response.ok) {
            console.error("Failed to add todo");
            return;
        }
        getUserTodos(userName); // Actualiza las tareas del usuario después de agregar una nueva
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="container col-6">
            <h1>User List</h1>
            <div className="d-flex mt-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter user details"
                    aria-label="User Details"
                    aria-describedby="basic-addon1"
                />
                <button className="btn btn-primary ms-4" onClick={addUser}>
                    Add User
                </button>
            </div>
            <ul className="list-group text-start mt-2">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{user.name}</strong>
                                <ul>
                                    {todos[user.name] && todos[user.name].length > 0 ? (
                                        todos[user.name].map((todo) => (
                                            <li key={todo.id}>{todo.label}</li>
                                        ))
                                    ) : (
                                        <li>No todos found</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <button className="btn btn-success btn-sm me-2" onClick={() => addTodo(user.name)}>
                                    Add Todo
                                </button>
                                <i
                                    className="fas fa-trash-alt"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => deleteUser(user.name)}
                                />
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No users found</li>
                )}
            </ul>
        </div>
    );
};