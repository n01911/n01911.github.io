// Lấy các phần tử từ DOM
const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('category-select');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const sortCompleted = document.getElementById('sort-completed');
const sortPending = document.getElementById('sort-pending');

// Hàm lưu công việc vào local storage
function saveTodos() {
    const todos = [];
    todoList.querySelectorAll('li').forEach(todo => {
        todos.push({
            text: todo.querySelector('span').textContent,
            completed: todo.querySelector('.complete-checkbox').checked,
            category: todo.querySelector('.category') ? todo.querySelector('.category').textContent.replace('(', '').replace(')', '') : ''
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Hàm tải công việc từ local storage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const newTodo = document.createElement('li');
        newTodo.classList.add(todo.category);

        newTodo.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${todo.completed ? 'checked' : ''}>
            <span>${todo.text}</span>
            <span class="category">${todo.category ? `(${todo.category})` : ''}</span>
            <button class="delete-btn">Xóa</button>
        `;

        todoList.appendChild(newTodo);

        const deleteBtn = newTodo.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            newTodo.remove();
            saveTodos();
        });

        const completeCheckbox = newTodo.querySelector('.complete-checkbox');
        completeCheckbox.addEventListener('change', function() {
            if (completeCheckbox.checked) {
                newTodo.classList.add('completed');
            } else {
                newTodo.classList.remove('completed');
            }
            saveTodos();
        });
    });
}

// Hàm thêm công việc
function addTodo() {
    const todoText = todoInput.value;
    const category = categorySelect.value;

    if (todoText === '') {
        alert('Vui lòng nhập công việc!');
        return;
    }

    const newTodo = document.createElement('li');
    newTodo.classList.add(category);

    newTodo.innerHTML = `
        <input type="checkbox" class="complete-checkbox">
        <span>${todoText}</span>
        <span class="category">${category ? `(${category})` : ''}</span>
        <button class="delete-btn">Xóa</button>
    `;

    todoList.appendChild(newTodo);
    todoInput.value = '';
    categorySelect.value = '';

    const deleteBtn = newTodo.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        newTodo.remove();
        saveTodos();
    });

    const completeCheckbox = newTodo.querySelector('.complete-checkbox');
    completeCheckbox.addEventListener('change', function() {
        if (completeCheckbox.checked) {
            newTodo.classList.add('completed');
        } else {
            newTodo.classList.remove('completed');
        }
        saveTodos();
    });

    saveTodos();
}

// Sự kiện khi người dùng nhấn nút 'Thêm'
addBtn.addEventListener('click', addTodo);

// Sự kiện tìm kiếm công việc
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const todos = todoList.querySelectorAll('li');

    todos.forEach(todo => {
        const text = todo.querySelector('span').textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            todo.style.display = '';
        } else {
            todo.style.display = 'none';
        }
    });
});

// Sắp xếp công việc hoàn thành và chưa hoàn thành
sortCompleted.addEventListener('click', function() {
    const todos = Array.from(todoList.querySelectorAll('li'));
    todos.sort((a, b) => {
        return b.querySelector('.complete-checkbox').checked - a.querySelector('.complete-checkbox').checked;
    }).forEach(todo => todoList.appendChild(todo));
});

sortPending.addEventListener('click', function() {
    const todos = Array.from(todoList.querySelectorAll('li'));
    todos.sort((a, b) => {
        return a.querySelector('.complete-checkbox').checked - b.querySelector('.complete-checkbox').checked;
    }).forEach(todo => todoList.appendChild(todo));
});

// Gọi hàm để tải công việc khi trang được tải
loadTodos();
