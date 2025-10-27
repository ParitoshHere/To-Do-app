const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");
const searchInput = document.getElementById("search-input");
const filterCategory = document.getElementById("filter-category");
const progressText = document.getElementById("progress-text");
const progressBar = document.querySelector(".progress");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
searchInput.addEventListener("input", filterTasks);
filterCategory.addEventListener("change", filterTasks);

function addTask() {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (text === "") return alert("Please enter a task!");

  const task = { text, category, priority, dueDate, completed: false };
  createTaskElement(task);
  saveTask(task);

  taskInput.value = "";
  updateProgress();
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task priority-${task.priority}`;
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <div class="details">
      <strong>${task.text}</strong> <br />
      <small>${task.category} | ${task.priority} Priority | Due: ${task.dueDate || "N/A"}</small>
    </div>
    <div class="actions">
      <button class="done">✔</button>
      <button class="edit">✎</button>
      <button class="delete">✖</button>
    </div>
  `;

  li.querySelector(".done").addEventListener("click", () => {
    li.classList.toggle("completed");
    updateStorage();
    updateProgress();
  });

  li.querySelector(".delete").addEventListener("click", () => {
    li.remove();
    updateStorage();
    updateProgress();
  });

  li.querySelector(".edit").addEventListener("click", () => {
    const newText = prompt("Edit your task:", task.text);
    if (newText) {
      li.querySelector("strong").textContent = newText;
      updateStorage();
    }
  });

  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll(".task").forEach((li) => {
    tasks.push({
      text: li.querySelector("strong").textContent,
      category: li.querySelector("small").textContent.split(" | ")[0],
      priority: li.className.match(/priority-(\w+)/)[1],
      dueDate: li.querySelector("small").textContent.split("Due: ")[1],
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTaskElement(task));
  updateProgress();
}

function filterTasks() {
  const search = searchInput.value.toLowerCase();
  const category = filterCategory.value;

  document.querySelectorAll(".task").forEach((li) => {
    const text = li.querySelector("strong").textContent.toLowerCase();
    const cat = li.querySelector("small").textContent.split(" | ")[0];
    const matchText = text.includes(search);
    const matchCat = category === "All" || cat === category;

    li.style.display = matchText && matchCat ? "flex" : "none";
  });
}

function updateProgress() {
  const tasks = document.querySelectorAll(".task");
  const completed = document.querySelectorAll(".task.completed");
  const percent = tasks.length ? (completed.length / tasks.length) * 100 : 0;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${completed.length} of ${tasks.length} tasks completed`;
}
