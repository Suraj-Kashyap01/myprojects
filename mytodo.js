
let addbtn = document.querySelector("#btn");
let inputtext = document.querySelector("#text");
let todolist = document.querySelector(".todolist");
let previous;
let edittodo = null;

function addtodo() {
  if (inputtext.value == "") {
    alert("You must add some text in todo");
    return false;
  }
  if (addbtn.value === "Edit") {
    let todoelement = document.getElementById(edittodo); 
    todoelement.innerHTML = inputtext.value; 
    let id = todoelement.id;
    let checkbox = todoelement.parentElement.querySelector('input[type="checkbox"]');
    let status = checkbox.checked ? "done" : "pending"; 
    console.log("Editing todo ID: ", id, " with status: ", status);
    editlocaltodo(inputtext.value, id, status); 
    addbtn.value = "Add";
    inputtext.value = "";
  } else {
    let li = document.createElement("li");
    let p = document.createElement("p");
    p.innerHTML = inputtext.value;
    li.appendChild(p);
    todolist.appendChild(li);

    let edit = document.createElement("button");
    edit.innerHTML = "Edit";
    edit.setAttribute("class", "editbtn");
    li.appendChild(edit);

    let deletebtn = document.createElement("button");
    deletebtn.innerHTML = "Remove";
    deletebtn.setAttribute("class", "removebtn");
    li.appendChild(deletebtn);

    let checkbox = document.createElement('input');
        checkbox.setAttribute("class", "box");

    checkbox.type = 'checkbox';
    li.appendChild(checkbox);

    let obj = { id: Date.now(), text: inputtext.value, status: "pending" };
    p.id = obj.id;

    checkbox.addEventListener('change', function () {
      let p = checkbox.parentElement.querySelector("p"); 
      let id = p.id;
      let newtext = p.innerHTML;
      obj.status = checkbox.checked ? "done" : "pending";
      p.style.textDecoration = checkbox.checked ? "line-through" : "none"; 
      editlocaltodo(newtext, id, obj.status);
    });

    savelocaltodo(obj);
    inputtext.value = "";
  }
}

function updatetodo(e) {
  if (e.target.innerHTML === "Remove") {
    todolist.removeChild(e.target.parentElement);
    deletelocaltodo(e.target.parentElement);
  }
  if (e.target.innerHTML === "Edit") {
    inputtext.value = e.target.previousElementSibling.innerHTML;
    inputtext.focus();
    addbtn.value = "Edit";
    previous = inputtext.value;
    edittodo = e.target.previousElementSibling.id; 
  }
}

function savelocaltodo(todo) {
  let arr = JSON.parse(localStorage.getItem("tododata")) || [];
  arr.push(todo);
  localStorage.setItem("tododata", JSON.stringify(arr));
}

function editlocaltodo(newtext, id, status) {
  let data = JSON.parse(localStorage.getItem("tododata")) || [];
  let todoindex = data.findIndex((todo) => todo.id == id);
  if (todoindex !== -1) {
    data[todoindex].text = newtext;
    data[todoindex].status = status;
    localStorage.setItem("tododata", JSON.stringify(data));
  } else {
    console.log("Todo not found in local storage!");
  }
}

function deletelocaltodo(todoElement) {
  let data = JSON.parse(localStorage.getItem("tododata")) || [];
  let id = todoElement.querySelector("p").id;
  data = data.filter((todo) => todo.id != id);
  localStorage.setItem("tododata", JSON.stringify(data));
}

window.onload = function () {
  let data = JSON.parse(localStorage.getItem("tododata")) || [];
  data.forEach((todo) => {
    let li = document.createElement("li");
    let p = document.createElement("p");
    p.innerHTML = todo.text;
    p.id = todo.id;
    li.appendChild(p);
    todolist.appendChild(li);

    let edit = document.createElement("button");
    edit.innerHTML = "Edit";
    edit.setAttribute("class", "editbtn");
    li.appendChild(edit);

    let deletebtn = document.createElement("button");
    deletebtn.innerHTML = "Remove";
    deletebtn.setAttribute("class", "removebtn");
    li.appendChild(deletebtn);

    let checkbox = document.createElement('input');
    checkbox.setAttribute("class", "box");
    checkbox.type = 'checkbox';
    checkbox.checked = (todo.status === 'done');
    
    p.style.textDecoration = checkbox.checked ? "line-through" : "none";

    checkbox.addEventListener('change', function () {
      let p = checkbox.parentElement.querySelector("p"); 
      let id = p.id;
      let status = checkbox.checked ? "done" : "pending";
      p.style.textDecoration = checkbox.checked ? "line-through" : "none";
      console.log("Checkbox change detected. Status: ", status);
      editlocaltodo(p.innerHTML, id, status);
    });
    li.appendChild(checkbox);
  });
};

addbtn.addEventListener("click", addtodo);
todolist.addEventListener("click", updatetodo);
