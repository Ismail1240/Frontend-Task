const createTaskBtn = document.querySelector("#createTaskBtn");
const overlay = document.querySelector(".overlay");
const addTaskBtn = document.querySelector("#addTaskBtn");
const closeOverlay = document.querySelector("#closeOverlay");
const form = document.querySelector("form");
const taskCont = document.querySelector(".taskCont");
const searchBar = document.querySelector("#searchBar");
const changeThemeBtn = document.querySelector("#changeThemeBtn");
const themeImg = document.querySelector("#themeImg");
const body = document.querySelector("body");
const pending = document.querySelector("#pending");
const completed = document.querySelector("#completed");
const clearAll = document.querySelector("#clearAll");
const filterLabel = document.querySelector("#filterLabel");
const filterBy = document.querySelector(".filterBy");
const info = document.querySelector(".info") 

let img = "./resources/dark-mode.png";

let isEditTask = null;
let isDeleteTask = null;
let isFilterTask = null;

let theme = JSON.parse(localStorage.getItem("Theme")) || "dark";

let tasksCount = JSON.parse(localStorage.getItem("Task Count")) || [];
let taskArr = JSON.parse(localStorage.getItem("Task Details")) || [];
let filterArr = [];

let pendingTasks = tasksCount.pendingTasks || 0;
let completedTasks = tasksCount.completedTasks || 0;

const currentTheme = () => {
  if (theme === "dark") {
    console.log("Applying dark theme");
    body.classList.remove("toggle");
    img = "./resources/dark-mode.png";
    themeImg.src = img;
    changeThemeBtn.dataset.theme = "dark";
    changeThemeBtn.classList.remove("light-theme");
    changeThemeBtn.classList.add("dark-theme");
  } else if (theme == "light") {
    body.classList.add("toggle");
    img = "./resources/light-mode.png";
    themeImg.src = img;
    changeThemeBtn.dataset.theme = "light";
    changeThemeBtn.classList.remove("dark-theme");
    changeThemeBtn.classList.add("light-theme");
  }
};
currentTheme()

filterLabel.addEventListener("mouseover",()=>{
  console.log("hovered")
  info.classList.toggle("info")
})

changeThemeBtn.addEventListener("click", (e) => {
  body.classList.toggle("toggle");

  if (theme == "dark") {
    theme = "light";
    img = "./resources/light-mode.png";
    themeImg.src = img;
    changeThemeBtn.dataset.theme = "light";
    changeThemeBtn.classList.remove("dark-theme");
    changeThemeBtn.classList.add("light-theme");
  } else {
    theme = "dark";
    img = "./resources/dark-mode.png";
    themeImg.src = img;
    changeThemeBtn.dataset.theme = "dark";
    changeThemeBtn.classList.remove("light-theme");
    changeThemeBtn.classList.add("dark-theme");
  }

  localStorage.setItem("Theme", JSON.stringify(theme));
});


filterLabel.addEventListener("click", (e) => {
  filterBy.classList.toggle("toggle");
  filterBy.focus();
});

filterBy.addEventListener("change", (e) => {
  filterBy.classList.remove("toggle");
  if (e.target.value === "all-categories") {
    isFilterTask = null;
  } else {
    isFilterTask = e.target.value;
  }

  console.log(e.target.value);

  filterArr = taskArr.filter((val) => {
    if (val.category === isFilterTask) {
      return val;
    }
  });

  renderUi();
});



clearAll.addEventListener("click", () => {
  if (confirm("Are you sure to delete all tasks ?")) {
    console.log("yes");
    taskArr = [];
    localStorage.setItem("Task Details", JSON.stringify(taskArr));
    tasksCount = [];
    localStorage.setItem("Task Count", JSON.stringify(tasksCount));
    pendingTasks = 0;
    completedTasks = 0;

    renderUi();
  } else {
    return;
  }
});


searchBar.addEventListener("input", (e) => {
  console.log(e.target.value);
  taskArr = JSON.parse(localStorage.getItem("Task Details"));

  let searchedArrValues = taskArr.filter((val, id) => {
    return val.title.toLowerCase().startsWith(`${e.target.value.trim()}`);
  });

  taskArr = searchedArrValues;
  renderUi();

  // console.log("search : " , search)
});

createTaskBtn.addEventListener("click", () => {
  //   console.log("i am create task");
  overlay.style.display = "flex";
  form[0].value = "";
  form[1].value = "";
  form[2].value = "all-categories";
  form[3].value = "none";
});


closeOverlay.addEventListener("click", () => {
  overlay.style.display = "none";
  form[0].value = "";
  form[1].value = "";
  form[2].value = "all-categories";
  form[3].value = "not started";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTaskBtn.textContent = "Add Task";

  let title = e.target[0].value.trim();
  let description = e.target[1].value.trim();
  let category = e.target[2].value.trim();
  let status = e.target[3].value.trim();

  if (
    title === "" ||
    description === "" ||
    status === "" ||
    status === "none" ||
    category === "" ||
    category === "all-categories"
  ) {
    alert("Please fill require fields !");

    return;
  }

  updateCounters(isEditTask, status, isDeleteTask);

  const tasksObj = {
    pendingTasks,
    completedTasks,
  };

  const obj = {
    title,
    description,
    category,
    status,
  };

  if (isEditTask !== null) {
    taskArr[isEditTask] = obj;
    localStorage.setItem("Task Details", JSON.stringify(taskArr));
    localStorage.setItem("Task Count", JSON.stringify(tasksObj));
    // pending.textContent = `Pending : ${pendingTasks}`;
    // completed.textContent = `Completed : ${completedTasks}`;
  } else {
    taskArr.push(obj);
    localStorage.setItem("Task Details", JSON.stringify(taskArr));
    localStorage.setItem("Task Count", JSON.stringify(tasksObj));
    // pending.textContent = `Pending : ${pendingTasks}`;
    // completed.textContent = `Completed : ${completedTasks}`;
  }

  overlay.style.display = "none";
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "all-categories";
  e.target[3].value = "none";

  renderUi();
});

const renderUi = () => {
  taskCont.textContent = "";
  pending.textContent = `Pending : ${pendingTasks}`;
  completed.textContent = `Completed : ${completedTasks}`;

  (isFilterTask !== null ? filterArr : taskArr).forEach((val, idx) => {
    const card = document.createElement("div");
    card.className = "card";

    card.setAttribute("data-id", `${idx}`);
    card.setAttribute("data-status", `${val.status}`);
    card.setAttribute("data-category", `${val.category}`);

    card.innerHTML = `<div class="top" id="${idx}">
              <h1>${val.title}</h1>
              <h3>${val.category}</h3>
              <h4>${val.status}</h4>
            </div>
            <h2 >${val.description}</h2>
            <div class="bottom">
                <button id="editTaskBtn" onClick="editTaskBtn(${idx})" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path></svg> Edit</button>

                <button id="deleteTaskBtn" onClick="deleteData(${idx})"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17 4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7V2H17V4ZM9 9V17H11V9H9ZM13 9V17H15V9H13Z"></path></svg> Delete</button>

                <button id="markAsCompleted" onClick="markAsCompletedFunc(${idx})" ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg></button>
            </div>`;

    taskCont.appendChild(card);


  });
  isFilterTask = null;
  filterArr = [];
  console.log(taskArr, filterArr);
};
renderUi();



const markAsCompletedFunc = (id) => {
  if (taskArr[id].status !== "completed") {
    pendingTasks--;
    completedTasks++;
  }

  taskArr[id].status = "completed";
  //   console.log(taskArr);
  localStorage.setItem("Task Details", JSON.stringify(taskArr));

  renderUi();
};

const editTaskBtn = (id) => {
  overlay.style.display = "flex";
  addTaskBtn.textContent = "Update Task";
  //   console.log(taskArr);
  //   console.log("form", form);

  form[0].value = taskArr[id].title;
  form[1].value = taskArr[id].description;
  form[2].value = taskArr[id].category;
  form[3].value = taskArr[id].status;

  isEditTask = id;
};

const deleteData = (id) => {
  isDeleteTask = taskArr[id].status;

  taskArr.splice(id, 1);
  localStorage.setItem("Task Details", JSON.stringify(taskArr));

  if (isDeleteTask !== null) {
    if (isDeleteTask === "pending") {
      pendingTasks--;
    } else {
      completedTasks--;
    }
  } else {
    console.log("is delete is null");
  }

  renderUi();
};

const updateCounters = (isEditTask, status, isDeleteTask) => {
  if (isEditTask === null) {
    if (status === "pending") {
      pendingTasks++;
    } else if (status === "completed") {
      completedTasks++;
    }
  } else if (isEditTask !== null && taskArr[isEditTask].status === status) {
    console.log("Status Not change");
  } else if (isEditTask !== null && taskArr[isEditTask].status !== status) {
    if (status === "pending") {
      pendingTasks++;
      completedTasks--;
    } else if (status === "completed") {
      completedTasks++;
      pendingTasks--;
    }
  }

  pending.textContent = `Pending : ${pendingTasks}`;
  completed.textContent = `Completed : ${completedTasks}`;
};
