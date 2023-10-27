const apiURL = 'https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219218539';

let todo = [];

class Todolist{

    constructor (id, title, description,completed, priority, tag, dueDate){
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.priority = priority;
        this.tag = tag;
        this.dueDate = dueDate;
        }
    }

    function displayView(tareas) {

        clearTable();
      
        showLoadingMessage();
      
        if (tareas.length === 0) {
      
          showNotFoundMessage();
      
        } else {
      
          hideMessage();
      
          displayTable(tareas);
        }
      
      }

      function displayTable(tareas){
        const tablaBody = document.getElementById('data-table-body');
      
        tareas.forEach(tarea => {
      
          const row = document.createElement('tr');
      
          row.innerHTML = `
                      <td> ${tarea.id} </td>
                      <td>${tarea.title}</td>
                      <td>${tarea.description}</td>
                      <td>${tarea.completed}</td>
                      <td>${tarea.priority}</td>
                      <td>${tarea.tag}</td>
                      <td>${tarea.dueDate}</td>
                    `;
      
          tablaBody.appendChild(row);
      
        });
      }
      function clearTable() {
        const tableBody = document.getElementById('data-table-body');
      
        tableBody.innerHTML = '';
      }
      
      
      function showLoadingMessage() {
        const messageNotFound = document.getElementById('message-not-found');
      
        messageNotFound.innerHTML = 'Cargando...';
      
        messageNotFound.style.display = 'block';
      }
      
      
      function showNotFoundMessage() {
        const messageNotFound = document.getElementById('message-not-found');
      
        messageNotFound.innerHTML = 'No se encontraron juegos con el filtro proporcionado.';
      
        messageNotFound.style.display = 'block';
      }
      
      
      function hideMessage() {
        const messageNotFound = document.getElementById('message-not-found');
      
        messageNotFound.style.display = 'none';
      }

      function searchData() {

        const OPTIONS = {
          method: 'GET'
        };
    
        fetch(`${apiURL}/tasks`, OPTIONS)
          .then(response => response.json())
          .then(data => {
            todo = data.map(item => {
    
              return new Todolist(
              
                item.id,
                item.title,
                item.description,
                item.completed,
                item.priority,
                item.tag,
                item.dueDate
                
              );
            });
    
            displayView(todo);
    
          })
          .catch(error => console.log(error));
    
      }

initButtonsHandler();

showLoadingMessage();

searchData();