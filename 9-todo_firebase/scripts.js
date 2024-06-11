import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load todos from Firestore
    const q = query(collection(db, 'todos'), orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
        todoList.innerHTML = '';
        snapshot.forEach((doc) => {
            addTodoToList(doc.id, doc.data().text);
        });
    });

    todoForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const todoText = todoInput.value;
        if (todoText) {
            await addTodoToFirestore(todoText);
            todoInput.value = '';
        }
    });

    async function addTodoToFirestore(todoText) {
        await addDoc(collection(db, 'todos'), {
            text: todoText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    function addTodoToList(id, text) {
        const todoItem = document.createElement('li');
        const todoText = document.createElement('span');
        todoText.textContent = text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            await deleteDoc(doc(db, 'todos', id));
        });

        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteButton);
        todoList.appendChild(todoItem);
    }
});
