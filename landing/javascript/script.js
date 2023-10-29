initAddTareaButtonsHandler();

initFilterButtonsHandler();

getTareaData();
class Todo {
  constructor(id, title, description, completed, priority,dueDate,tag) {
    this.id = id; 
    this.title = title; 
    this.description = description;
    this.completed = completed;
    this.priority = priority;
    this.dueDate = dueDate;
    this.tag = tag;
    
  }
}
function mapAPIToTareas(data) {
  return data.map(item => {
    return new Todo(
      item.id,
      item.title,
      item.description,
      item.completed,
      item.priority,
      new Date(item.dueDate),
      item.tag
    );
  });
}

class Tarea {

  constructor(id, title, priority) {
    this.id = id;
    this.title = title;
    this.priority = priority;
  }

}
function getTareasData(title,priority, completed,dueDate, tag ) {

  const url = buildGetTareasDataUrl(title,priority, completed, dueDate, tag);

  fetchAPI(url, 'GET')
    .then(data => {
      const tasksList = mapAPIToTareas(data);
      displayTareasView(tasksList);
    });
}


function deleteTarea(taskId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la tarea ${taskId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/tasks/${taskId}`, 'DELETE')
      .then(() => {
        resetTareas();
        window.alert("Nota eliminada.");
      });

  }
}

function createTarea(tarea) {

  fetchAPI(`${apiURL}/tasks`, 'POST', tarea)
    .then(tarea => {
      closeAddTareaModal();
      resetTareas();
      window.alert(`Nota ${tarea.id} creada correctamente.`);
    });

}


function saveEdit(taskId,taskData) {
  fetch(`${apiURL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then(response => {
      if (response.ok) {
        console.log("Datos enviados")
      } else {
        console.error('Error al guardar los datos en el servidor');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud HTTP:', error);
    });
}



function displayTareasView(tareas) {

  clearTable();

  showLoadingMessage();

  if (tareas.length === 0) {

    showNotFoundMessage();

  } else {

    hideMessage();

    displayTareasTable(tareas);
  }

}


function displayClearTareasView() {
  clearTable();

  showInitialMessage();
}

function displayTareasTable(tareas) {
  const tablaBody = document.getElementById('data-table-body');

  tareas.forEach(tarea => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tarea.id}</td>
      <td class="editable" contenteditable="false">${tarea.title}</td>
      <td class="editable" contenteditable="false">${tarea.description}</td>
      <td class="editable" contenteditable="false">${tarea.completed}</td>
      <td class="editable" contenteditable="false">${tarea.priority}</td>
      <td class="editable" contenteditable="false">${formatDate(tarea.dueDate)}</td>
      <td class="editable" contenteditable="false">${tarea.tag}</td>
      <td>
        <button class="btn-update" data-task-id="${tarea.id}">Editar</button>
        <button class="btn-delete" data-task-id="${tarea.id}">Eliminar</button>
      </td>
    `;

    const editButton = row.querySelector('.btn-update');
    editButton.addEventListener('click', () => {
      toggleEditRow(row);
    });

    tablaBody.appendChild(row);
  });

  initDeleteTareaButtonHandler();
}
function buildGetTareasDataUrl(title, priority, completed, dueDate,tag) {

  const url = new URL(`${apiURL}/tasks`);
  
  if (title) {
    url.searchParams.append('title', title);
  }
  
  if (priority) {
    url.searchParams.append('priority', priority);
  }
  
  if (dueDate) {
    url.searchParams.append('dueDate', dueDate);
  }
  if (completed) {
    url.searchParams.append('completed', completed);
  }
  
  if (tag) {
    url.searchParams.append('tag', tag);
  }
  
  return url;
  }
  function mapAPIToTareaDescriptors(data) {
    return data.map(tarea => {
      return new Tarea(
        tarea.id,
        tarea.title,
        tarea.priority
      );
    });
  }
function clearTable() {
  const tableBody = document.getElementById('data-table-body');

  tableBody.innerHTML = '';
}

function toggleEditRow(row) {

  const editButton = row.querySelector('.btn-update');
  const taskId = editButton.getAttribute('data-task-id');
  const editableCells = row.querySelectorAll('.editable');

  if (editButton.textContent === 'Editar') {
    editButton.textContent = 'Guardar';
    editButton.classList.add('btn-update-saving');
    editableCells.forEach(cell => {
      cell.contentEditable = 'true';

      
      
    });
  } else {
    editButton.textContent = 'Editar';
    editButton.classList.remove('btn-update-saving'); 
    editableCells.forEach(cell => {
      cell.contentEditable = 'false';

      
    });

    const taskData = {
      id:taskId,
      title: row.cells[1].textContent,
      description: row.cells[2].textContent,
      completed: row.cells[3].textContent,
      priority: row.cells[4].textContent,
      dueDate: row.cells[5].textContent,
      tag: row.cells[6].textContent,
    };

    saveEdit(taskId,taskData);
  };
}



function initFilterButtonsHandler() {

  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    searchTareas();
  });

  document.getElementById('reset-filters').addEventListener('click', () => clearTareas());

}


function clearTareas() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');

  displayClearTareasView();
}


function resetTareas() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
  searchTareas();
}


function searchTareas() {
  const title = document.getElementById('title-filter').value;
  const priority = document.getElementById('priority-filter').value;
  const completed = document.getElementById('completed-filter').value;
  const dueDate = document.getElementById('date-filter').value;
  const tag = document.getElementById('tag-filter').value;
 

  getTareasData(title,priority, completed, dueDate,tag );
}
function initAddTareaButtonsHandler() {

document.getElementById('addTask').addEventListener('click', () => {
  openAddTareaModal()
});

document.getElementById('modal-background').addEventListener('click', () => {
  closeAddTareaModal();
});

document.getElementById('task-form').addEventListener('submit', event => {
  event.preventDefault();
  processSubmitTarea();
});

}
function openAddTareaModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
}


function closeAddTareaModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}


function processSubmitTarea() {
  const title = document.getElementById('title-field').value;
  const description = document.getElementById('description-field').value;
  const completed = document.getElementById('completed-field').value;
  const priority = document.getElementById('priority-field').value;
  const dueDate = document.getElementById('dueDate-field').value;
  const tag = document.getElementById('tag-field').value;
  
  
 const taskToSave = new Todo(
    null,
    title,
    description,
    completed,
    priority,
    dueDate,
    tag
  );

  createTarea(taskToSave);
}



function initDeleteTareaButtonHandler() {

  document.querySelectorAll('.btn-delete').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-task-id');
      deleteTarea(taskId); 

    });

  });

}

function displayTareaOptions(tareas) {

  const taskFilter = document.getElementById('task-filter');
  

  const taskModal = document.getElementById('priority-field');


  tareas.forEach(tarea => {

    const optionFilter = document.createElement('option');
    optionFilter.value = tarea.title;
    optionFilter.text = `${tarea.title} - ${tarea.priority}`;
    taskFilter.appendChild(optionFilter);
  });

}
function showLoadingMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'Cargando...';

  message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una consulta de tareas.';

  message.style.display = 'block';
}

function showNotFoundMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se encontraron tareas con el filtro proporcionado.';

  message.style.display = 'block';
}

function hideMessage() {
  const message = document.getElementById('message');

  message.style.display = 'none';
}

function getTareaData() {
  fetchAPI(`${apiURL}/tasks`, 'GET')
    .then(data => {
      const tasksList = mapAPIToTareaDescriptors(data);
      displayTareaOptions(tasksList);
    });

}