let allFilters = document.querySelectorAll(".filter div");
let body = document.querySelector("body");
let addBtn = document.querySelector(".add__btn");
let grid = document.querySelector(".grid__container");
let modalFlag = false;
let deleteBtnFlag = false;

let uid = new ShortUniqueId();

let colors = {
  blue: "#0984e3",
  green: "#00b894",
  orange: "#e17055",
  red: "#d63031",
};

let colorClasses = ["blue", "green", "orange", "red"];

if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify([]));
}

for (let i = 0; i < allFilters.length; i++) {
  allFilters[i].addEventListener("click", function (e) {
    if (
      e.currentTarget.parentElement.classList.contains("selected-filter-class")
    ) {
      e.currentTarget.parentElement.classList.remove("selected-filter-class");
      loadTasks();
    } else {
      let color = e.currentTarget.classList[0].split("-")[0];
      e.currentTarget.parentElement.classList.add("selected-filter-class");
      loadTasks(color);
    }
  });
}

addBtn.addEventListener("click", function () {
  if (modalFlag) return;

  if (delBtn.classList.contains("delBtn__flag")) {
    deleteBtnFlag = false;
    delBtn.classList.remove("delBtn__flag");
  }

  let modal = document.createElement("div");
  modal.classList.add("modal__container");
  modal.setAttribute("click-first", true);
  modal.innerHTML = `<div class="writing__container" contenteditable>Enter you task...</div>
        <div class="select__priority__container">
          <div class="modal-priority blue active_modal_filter"></div>
          <div class="modal-priority green"></div>
          <div class="modal-priority orange"></div>
          <div class="modal-priority red"></div>
        </div>`;

  let allModalFilters = modal.querySelectorAll(".modal-priority");

  for (let i = 0; i < allModalFilters.length; i++) {
    allModalFilters[i].addEventListener("click", function (e) {
      for (let j = 0; j < allModalFilters.length; j++) {
        allModalFilters[j].classList.remove("active_modal_filter");
      }
      e.currentTarget.classList.add("active_modal_filter");
    });
  }

  let wa = modal.querySelector(".writing__container");
  wa.addEventListener("click", function (e) {
    if (modal.getAttribute("click-first") == "true") {
      wa.innerHTML = "";
      modal.setAttribute("click-first", false);
    }
  });

  wa.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      let task = e.currentTarget.innerText;
      let selectedModalFilter = document.querySelector(".active_modal_filter");
      let color = selectedModalFilter.classList[1];
      let ticket = document.createElement("div");
      let id = uid();
      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket__color ${color}"></div>
            <div class="task__id">#${id}</div>
            <div class="ticket__box" contenteditable>${task}
            </div>`;

      saveTicketIntoLocalStorage(id, color, task);

      let ticketWritingArea = ticket.querySelector(".ticket__box");
      ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

      ticket.addEventListener("click", function (e) {
        if (deleteBtnFlag) {
          let id = e.currentTarget
            .querySelector(".task__id")
            .innerText.split("#")[1];
          let tasksArr = JSON.parse(localStorage.getItem("tasks"));

          tasksArr = tasksArr.filter(function (el) {
            return el.id != id;
          });

          localStorage.setItem("tasks", JSON.stringify(tasksArr));

          if (deleteBtnFlag) {
            e.currentTarget.remove();
          }
        }
      });

      let ticket_color_div = ticket.querySelector(".ticket__color");
      ticket_color_div.addEventListener("click", ticketColorHandler);

      grid.appendChild(ticket);
      modal.remove();
      modalFlag = false;
    }
  });

  body.appendChild(modal);
  modalFlag = true;
});

let delBtn = document.querySelector(".del");
delBtn.addEventListener("click", function (e) {
  if (deleteBtnFlag) {
    deleteBtnFlag = false;
    e.currentTarget.classList.remove("delBtn__flag");
  } else {
    deleteBtnFlag = true;
    e.currentTarget.classList.add("delBtn__flag");
  }
});

function saveTicketIntoLocalStorage(id, color, task) {
  let reqObj = { id, color, task };
  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  tasksArr.push(reqObj);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function ticketColorHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".task__id")
    .innerText.split("#")[1];

  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }

  let currColor = e.currentTarget.classList[1];
  let index = colorClasses.indexOf(currColor);
  index++;
  index = index % 4;
  e.currentTarget.classList.remove(currColor);
  e.currentTarget.classList.add(colorClasses[index]);
  tasksArr[reqIndex].color = colorClasses[index];
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function ticketWritingAreaHandler(e) {
  let id = e.currentTarget.parentElement
    .querySelector(".task__id")
    .innerText.split("#")[1];
  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  let reqIndex = -1;
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id == id) {
      reqIndex = i;
      break;
    }
  }
  tasksArr[reqIndex].task = e.currentTarget.innerText;
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function loadTasks(passedColor) {
  if (delBtn.classList.contains("delBtn__flag")) {
    deleteBtnFlag = false;
    delBtn.classList.remove("delBtn__flag");
  }

  let allTickets = document.querySelectorAll(".ticket");
  for (let t = 0; t < allTickets.length; t++) allTickets[t].remove();

  let tasksArr = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < tasksArr.length; i++) {
    let id = tasksArr[i].id;
    let color = tasksArr[i].color;
    let task = tasksArr[i].task;

    if (passedColor) {
      if (passedColor != color) continue;
    }

    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket__color ${color}" title="click to change priority"></div>
          <div class="task__id">#${id}</div>
          <div class="ticket__box" contenteditable>${task}
          </div>`;

    let ticket_color_div = ticket.querySelector(".ticket__color");
    ticket_color_div.addEventListener("click", ticketColorHandler);

    let ticketWritingArea = ticket.querySelector(".ticket__box");
    ticketWritingArea.addEventListener("input", ticketWritingAreaHandler);

    ticket.addEventListener("click", function (e) {
      let id = e.currentTarget
        .querySelector(".task__id")
        .innerText.split("#")[1];
      let tasksArr = JSON.parse(localStorage.getItem("tasks"));

      if (deleteBtnFlag) {
        tasksArr = tasksArr.filter(function (el) {
          return el.id != id;
        });
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
        e.currentTarget.remove();
      }
    });

    grid.appendChild(ticket);
  }
}

loadTasks();
