document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  function addTodo(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span class="todo-text">${text}</span>
      <div class="todo-actions">
        <button class="todo-btn done-btn" title="Oznacz jako zrobione">&#10003;</button>
        <button class="todo-btn delete-btn" title="Usuń">&#10005;</button>
      </div>
    `;
    list.appendChild(li);
    setTimeout(() => li.classList.add('visible'), 50);

    li.querySelector('.done-btn').onclick = () => {
      li.classList.toggle('done');
    };
    li.querySelector('.delete-btn').onclick = () => {
      li.classList.remove('visible');
      setTimeout(() => li.remove(), 400);
    };
  }

  form.onsubmit = e => {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
      addTodo(value);
      input.value = '';
      input.focus();
    }
  };
}); 