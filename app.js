// Acá Pega el Cliente ID y el API Key que creaste 
      var CLIENT_ID = '299846102546-07ltpjseent31vto1i1m3i0i8kthqd87.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyC77NK0MdyKJQnJFH6nXpZLBpU16nsqOHg';
      
      // Cargamos el servicio Rest API de Google 
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
 
      // El servicio de Autenticación con una cuenta de Google 
      var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
      
      // Seleccionamos los botones de Iniciar Sesión y Cerrar Sesión 
      var authorizeButton = document.getElementById('autorizar_btn');
      var signoutButton = document.getElementById('desconectar_btn');
 
      
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }
 
     
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
 
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }
 
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listFiles();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }
 
      
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }
 
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }
 
      function appendPre(message) {
        var pre = document.getElementById('root');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }
      
      // Acá listamos los archivos de nuestra cuenta de Google Drive, especificamos que datos de los archivos queremos mostrar 
      function listFiles() {
        gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name, mimeType, createdTime, size)"
        }).then(function(response) {
          
          var files = response.result.files;     
          
          var table = document.getElementById('root');
          listarenTabla(table, ['ID', 'Nombre', 'mimeType', 'Fecha de Creación', 'Tamaño'], 'th');     
 
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {              
 
              var file = files[i];              
 
              listarenTabla(table, [
                file.id,
                file.name,
                file.mimeType,
                file.createdTime,
                file.size + ' Kbs'
              ]);
 
              //appendPre(file.name + ' / ' + file.id + ' / ' + file.mimeType + ' / ' + file.createdTime + ' / ' + file.size + ' Kbs') + "<br>";
 
            }
          } else {
            appendPre('No hay archivos.');
          }
        });
      }
 
      // Función para pintar la tabla HTML (Bootstrap 4)
      function listarenTabla (table, elements, tag) {
        
        var row = document.createElement('tr')
        elements.forEach(function (e) {
 
          var cell = document.createElement(tag || 'td')
 
          if (typeof e === 'string') {
            cell.textContent = e
          } else {
            cell.appendChild(e)
          }
                  
          row.appendChild(cell)
        })
 
        table.appendChild(row)
      }