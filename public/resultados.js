//Check service worker
let newWorker;
function showUpdateBar() {
  let snackbar = document.getElementById('snackbar');
  snackbar.className = 'show';
}

// The click event on the notification
var el = document.getElementById('reload');
if (el) {
  console.log('Boton encontrado');
  el.addEventListener('click', function () {
    newWorker.postMessage({ action: 'skipWaiting' });
    window.location.reload();
  });
} else {
  console.log('No encuentra el boton');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      // A wild service worker has appeared in reg.installing!
      newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        // Has network.state changed?
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // new update available
              showUpdateBar();
            }
            // No update available
            break;
        }
      });
    });
  });
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}
//--------------------------------//
//Document ready
document.addEventListener('DOMContentLoaded', function () {
  //Loading
  var loading = document.getElementById('loading');
  loading.classList.add('hide');
  //Tabla generada
  var tabla = '';
  //Version actual a mostrar en menu
  document.getElementById('version').innerText = 'v1.1.3';

  //Click en recargar version
  var el = document.getElementById('reload');

  //Revisar si el boton de recargar version es encontrado
  if (el) {
    console.log('Boton encontrado');
    el.addEventListener('click', function () {
      newWorker.postMessage({ action: 'skipWaiting' });
      window.location.reload();
    });
  } else {
    console.log('No encuentra el boton');
  }

  //Activar select de materialize
  var materialize_select = document.querySelectorAll('select');
  M.FormSelect.init(materialize_select);

  //Activar FAB
  var materialize_fab = document.querySelectorAll('.fixed-action-btn');
  M.FloatingActionButton.init(materialize_fab);

  //Cargar probabilidades en base a la cantidad de partidos
  var select_partidos = document.getElementById('partidos');
  select_partidos.addEventListener("change", function () {
    //Mostrar filtro de partidos
    var select_filtro_div = document.getElementById('select-filtro-div');
    select_filtro_div.classList.remove('hide');

    //Partidos a calcular
    var cantidad = this.value;

    //Obtener combinaciones
    generarTabla(cantidad);
  });

  //Elegir el tipo de filtro L,E,V
  var select_filtro = document.getElementById('select-filtro');
  select_filtro.addEventListener("change", function () {
    this.setAttribute("disabled", true);
    document.getElementById('select-partido-div').classList.remove('hide');
  });

  //Elegir en que partido se agrega el filtro
  var select_partido = document.getElementById('select-partido');
  select_partido.addEventListener("change", function () {
    loading.classList.remove('hide');
    //Registrar cambios
    filtrosPartidos();
  });

}, false);

//Funcion para limpiar la tabla
function cleanTableData(value){
  //Limpiar tabla en base al valor elegido, L/E/V
  var clean_l = document.getElementById('clean_l');
  var clean_e = document.getElementById('clean_e');
  var clean_v = document.getElementById('clean_v');

  switch(value){
    case 'L':
      if (clean_l.value <= 9) {
        clearTable(value, clean_l.value);
      } else {
        removeConsecutives(clean_l.value, value);
      }
      if (clean_l.options[clean_l.selectedIndex].value === clean_l.value){
        var option = clean_l.querySelector('option[value="' + clean_l.value + '"]');
        //option.setAttribute("selected", true);
        clean_l.removeChild(option);
      }
      break;
    case 'E':
      if (clean_e.value <= 9) {
        clearTable(value, clean_e.value);
      } else {
        removeConsecutives(clean_e.value, value);
      }
      if (clean_e.options[clean_e.selectedIndex].value === clean_e.value) {
        var option = clean_e.querySelector('option[value="' + clean_e.value + '"]');
        option.setAttribute("selected", true);
        clean_e.removeChild(option);
      }
      break;
    case 'V':
      if (clean_v.value <= 9) {
        clearTable(value, clean_v.value);
      } else {
        removeConsecutives(clean_v.value, value);
      }
      if (clean_v.options[clean_v.selectedIndex].value === clean_v.value) {
        var option = clean_v.querySelector('option[value="' + clean_v.value + '"]');
        option.setAttribute("selected", true);
        clean_v.removeChild(option);
      }
      break;
  }

  reloadTds();
  delete_array = []; //Limpiar el arreglo al terminar la operacion

  //Reiniciar selects
  var materialize_select = document.querySelectorAll('select');
  M.FormSelect.init(materialize_select);

}

//Funcion para cargar la tabla inicial
function generarTabla(n) {
  loading.classList.remove('hide');
  switch (n) {
    case '1': tabla = 'tabla1.html'; break;
    case '2': tabla = 'tabla2.html'; break;
    case '3': tabla = 'tabla3.html'; break;
    case '4': tabla = 'tabla4.html'; break;
    case '5': tabla = 'tabla5.html'; break;
    case '6': tabla = 'tabla6.html'; break;
    case '7': tabla = 'tabla7.html'; break;
    case '8': tabla = 'tabla8.html'; break;
    case '9': tabla = 'tabla9.html'; break;
  }
  //Cargar la tabla elegida usando fetch
  fetch(tabla)
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      document.getElementById("tabla_div").innerHTML = data;
      loading.classList.add('hide');
    });
}

//Funcion para mostrar los resultados en los filtros de partido
function filtrosPartidos(){
  //Activar el filtro por letra
  var filtro = document.getElementById('select-filtro').value;
  var columna = document.getElementById('select-partido').value;
  var columna_elegida = document.getElementsByClassName('col_' + columna);
  var nuevo_texto = '';
  switch (filtro) {
    case '1': nuevo_texto = 'L'; break;
    case '2': nuevo_texto = 'E'; break;
    case '3': nuevo_texto = 'V'; break;
  }
  for (var i = 0; i < columna_elegida.length; i++) {
    columna_elegida.item(i).innerHTML = nuevo_texto;
  }

  //Mostrar elementos
  document.getElementById('refresh').classList.remove('hide');
  document.getElementById('print_btn').classList.remove('hide');
  document.getElementById('search_btns').classList.remove('hide');
  document.getElementById('shuffle_btn').classList.remove('hide');
  document.getElementById('fil_btn').classList.remove('hide');
  document.getElementById('work-place').classList.add('hide');
  loading.classList.add('hide');
}

//function para limpiar input de busqueda
function limpiarInput(){
  var els = document.querySelectorAll('.active');
  els.forEach(function (el, ind) {
    el.style.backgroundColor = '#FFF';
  });
  document.getElementById('search_value').value = '';
  var results_list = document.getElementById('results_list');
  results_list.innerHTML = '';
}

//Funcion para buscar en la lista
function findRows(value) {

  if (document.getElementById('search_value').value){
    //Limpiar la lista de resultados
    var results_list = document.getElementById('results_list');
    results_list.innerHTML = '';
    results_list.classList.remove('hide');

    var rows = document.getElementsByTagName('TR');
    var list = ''; //Lista de resultados

    //Buscar filas con el resultado
    for (var i = 0; i < rows.length; i++) {
      var texto = rows[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm, "");
      if (texto.includes(value)) {
        list += '<li style="text-align: center;background-color: yellow;">' + texto + '</li>';
        rows[i].style.backgroundColor = 'green';
      }
    }
    results_list.innerHTML = list;
  }
  
}
  
  function imprimir(){
  
    $('#btns_row').hide();
    $('#refresh').hide();
    $('#print_btn').hide();
    $('#search_btns').hide();
    $('#shuffle_btn').hide();
    $('.sidenav').hide();
    $('#tabla').css('margin-left', '-240px');
    $('#menu').hide();
    $('tr').css('font-size','10px');
    
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
            console.log('before print dialog open');
        } else {
            console.log('after print dialog closed');
            $('#btns_row').show();
            $('#refresh').show();
            $('#print_btn').show();
            $('#search_btns').show();
            $('#shuffle_btn').show();
            $('.sidenav').show();
            $('#tabla').css('margin-left','0px');
            $('tr').css('font-size', '15px');
            $('#menu').show();
        }
    });
    }

//Paint repet rows
function distinguir(){
  console.log('Entro al filtro')
  //Check cant of matches
  var cant = $('#partidos').val();
  var filtro_letra = $('#select-filtro').val();
  var filtro_numero = $('#select-partido').val();
  var count = 0;
  if(cant === '9'){
    switch (filtro_numero){
      case '1': //Filtro en el primer partido L-E-V
        $('#tabla').find('tr').each(function(index, row){
            if((index % 3) === 0){
              console.log(index)
            }else{
              console.log(index)
              this.style.backgroundColor = 'green';
              this.classList.add("borrar");
            }
        });
      break;
      case '2': //Filtro en el segundo partido L-E-V
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 3){
            console.log(index + 'borrado');
           this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 9){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '3':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 9){
            console.log(index + 'borrado');
            this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 27){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '4':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 27){
            console.log(index + 'borrado');
            this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 81){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '5':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 81){
            console.log(index + 'borrado');
            this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 243){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '6':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 243){
            console.log(index + 'borrado');
            this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 729){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '7':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 729){
            console.log(index + 'borrado');
           this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 2187){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '8':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 2187){
            console.log(index + 'borrado');
            this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 6561){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '9':
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 6561){
            console.log(index + 'borrado');
           this.style.backgroundColor = 'green';
            this.classList.add("borrar");
          }
          if(count < 19683){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      }
  }else{

   // removeDuplicateRows($('#tabla'));
  }
  

//reloadTds();
$('#print_btn').show();
$('#search_btns').show();
$('#shuffle_btn').show();
  if ($('#search_value').val() !== ''){
  findRows($('#search_value').val());
}
    
}

function filtrar(){
  console.log('Entra al nuevo borrar');
  $('.borrar').remove();
}

//Delete repet rows
function filtrarx(){
  console.log('Entro al filtro')
  //Check cant of matches
  var cant = $('#partidos').val();
  var filtro_letra = $('#select-filtro').val();
  var filtro_numero = $('#select-partido').val();
  if(cant === '9'){
    switch (filtro_numero){
      case '1': //Filtro en el primer partido L-E-V
        $('#tabla').find('tr').each(function(index, row){
            if((index % 3) == 0){
              console.log(index)
            }else{
              console.log(index)
              $('.row_'+index).remove();
            }
        });
      break;
      case '2': //Filtro en el segundo partido L-E-V
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 3){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 9){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '3':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 9){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 27){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '4':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 27){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 81){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '5':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 81){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 243){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '6':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 243){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 729){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '7':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 729){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 2187){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '8':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 2187){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 6561){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      case '9':
        var count = 0;
        $('#tabla').find('tr').each(function(index, row){
          console.log(index);
          if(count > 6561){
            console.log(index + 'borrado');
               $('.row_'+index).remove();
          }
          if(count < 19683){
              count++;
            }else{
              count = 1;
            }
        });
      break;
      }
  }else{

    removeDuplicateRows($('#tabla'));
  }
  

//reloadTds();
$('#print_btn').show();
$('#search_btns').show();
$('#shuffle_btn').show();
  if ($('#search_value').val() !== ''){
  findRows($('#search_value').val());
}
    
}

function removeDuplicateRows($table){
    function getVisibleRowText($row){
        return $row.find('td.td-vals').text();
    }
    
      $table.find('tr').each(function(index, row){
          var $row = $(row);
      
          $row.nextAll('tr').each(function(index, next){
              var $next = $(next);
              if(getVisibleRowText($next) == getVisibleRowText($row))
                  $next.remove();
          });
      });
  }

function borrar(){
  //$('.progress').show();
   var count = 0;
  $('#tabla').find('tr').each(function(index, row){
    console.log(index);
    if(count > 9){
      console.log(index + 'borrado');
         $('.row_'+index).remove();
    }
    if(count < 27){
        count++;
      }else{
        count = 1;
      }
  });
  //reloadTds();
  //$('.progress').hide();
}

//Funcion para eliminar columnas en base al filtro
function clearTable(res,cant){
    cant = parseInt(cant);
  var numero_partidos = parseInt(document.getElementById('partidos').value);
  console.log('Cantidad: ' + cant);
  var tabla = document.getElementById('tabla');
  console.log('Lenght: ' + tabla.rows.length);
  var delete_array = [];
  for(var i = 0; i < tabla.rows.length; i++){
    if(cant === 0){
      console.log('Entra a cero');
      var texto_fila = tabla.rows[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm, "");
      var longitud_texto = parseInt(texto_fila.length);
      var final_long = longitud_texto - numero_partidos;
      console.log('Final: ' + final_long);
      console.log('Texto fila ' + i + ' ' + texto_fila);
      var row_index = parseInt(texto_fila.substring(0, final_long));
      if (texto_fila.includes(res) === false && !isNaN(row_index)) {
        console.log('No tiene ' + res + ' ' + texto_fila + ' // numero: ' + row_index);
        delete_array.push(row_index);
      }else{
          console.log('Ignorado: ' + texto_fila);
      }
    }else{
      var array = [];
      console.log('Valor mayor a cero en la ' + i);
      //var cells = tabla.rows[i].getElementsByTagName('TD');
      array[i] = [];
      var tabla = document.getElementById('tabla');
      for (var ic = 0; ic <= numero_partidos; ic++) {
        var value = tabla.rows[i].cells[ic].innerHTML;
        array[i].push(value);
      }

      count = {};

      array[i].forEach(function (a) {
        count[a] = (count[a] || 0) + 1;
      });

      //console.log(count);

      if (count[res]) {
        if (count[res] == cant) {
          //var deleteRow = document.getElementsByClassName('row_' + i);
          //deleteRow[0].parentNode.removeChild(deleteRow[0]);
          delete_array.push(i);
          //$('.row_' + i).hide();
          //$('.row_' + i).attr('class', 'hidded');
        }
        console.log(res + ' existe ' + count[res] + ' veces en la fila ' + i);
      } else {
        //console.log('12 does not exist.');
      }
    }
  }
  
  //Eliminar elementos del array
  console.log('Array a eliminar: ' + delete_array);
  for(var j = 0; j < delete_array.length; j++){
      console.log('A eliminar: ' + delete_array[j]);
    var counter = parseInt($('#hide_counter').val());
    console.log('Contador: ' + counter)
      if(counter === 0){
        var deleteRow = document.getElementsByClassName('row_' + delete_array[j])[0];
        deleteRow.parentNode.removeChild(deleteRow);
      }else{
        var deleteRow = document.getElementsByClassName('row_count_' + delete_array[j])[0];
        console.log('Delete row: ' + deleteRow)
        deleteRow.parentNode.removeChild(deleteRow);
        console.log('Se elimino: ' + 'row_count' + delete_array[j])
      }
  }
  
  $('#hide_counter').val(1)
  
}

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//Set count on tds
function reloadTds(){
  var counts = 0;
  var counter = 0;
  var last_repeat = 1;
  var random_name_position = getRandomInteger(5, 15);
  var random_counts = 0;
  var name_to_repeat = '';
  
  $('tr.active').each(function() {
    //var name = names[Math.floor(Math.random() * names.length)];
    var name = '';
    var text = $(this).attr('class');
    var val = text.slice(11);
    var randomSalesman = salesman[Math.floor(Math.random() * salesman.length)];
    $('.row_'+val).attr('class', "active row_"+val+ " row_count_"+counts);

    console.log('Contador: ' + counts);
    if(last_repeat < 6){ //Nombres repetidos entre 5-15, 5 veces.
      if (counts === random_name_position) {
        random_counts = getRandomInteger(5, 15);
        name_to_repeat = name;
        $('.td_' + val).text(val + '' + name_to_repeat);
        console.log('Se repite ' + name_to_repeat + ' ' + random_counts + ' veces.');
        
      } else if (counts > random_name_position && counts <= (random_name_position + random_counts)){
        $('.td_' + val).text(val + name_to_repeat);
        counter = counter + 1;
        if(random_counts === counter){
          var countsx = (random_name_position + random_counts) + random_counts;
          random_name_position = countsx;
          last_repeat = last_repeat + 1;
          counter = 0;
        }
      } else {
        $('.td_' + val).text(val + name);
      }
      } else { //Nombres repetidos entre 15-25, 1 vez.
      if (counts === random_name_position) {
        random_counts = getRandomInteger(5, 15);
        name_to_repeat = name;
        $('.td_' + val).text(val + '' + name_to_repeat);
        console.log('Se repite ' + name_to_repeat + ' ' + random_counts + ' veces.');
        
      } else if (counts > random_name_position && counts <= (random_name_position + random_counts)){
        $('.td_' + val).text(val + name_to_repeat);
        counter = counter + 1;
        if(random_counts === counter){
          var countsx = (random_name_position + random_counts) + random_counts;
          random_name_position = countsx;
          last_repeat = 1;
          counter = 0;
        }
      } else {
        $('.td_' + val).text(val + '' + name);
      }
      }
    
    
    $('.td_'+val).attr('class', "td_"+val+ " td_count_"+counts + " numeric");
    $('#total_columns').text('Total: ' + counts);
    counts++;
  });

  randomSalesman();

}

//Funcion para mostrar numeros consecutivos en el resultado...................................................................................
function reloadNumbers(){

  var counts = 0;

  $('tr.active').each(function () {
    if(counts === 0){
      this.cells[0].innerHTML = '>';
    }else{
      this.cells[0].innerHTML = counts;
    }
    $('#total_columns').text('Total: ' + counts);

    counts++;
  });

}

//Funcion para mostrar nombres y vendedores aleatorios...........................................................................................
function reloadNames(){
  var counts = 0;
  var random_name_position = getRandomInteger(5, 15);
  
  var valor_celda = '';
  var name_to_repeat = '';
  var countsx = 0;
  var random_counts = 0;
  var last_repeat = 1;
  var counter = 0;

  $('tr.active').each(function () {
    var name = names[Math.floor(Math.random() * names.length)];
    
    if(counts === 0){
      
      this.cells[0].innerHTML = '>';
      
    }else{
      
      if (last_repeat < 6) { //Nombres repetidos entre 5-15, 5 veces.
        
      if (counts === random_name_position) {
        random_counts = getRandomInteger(5, 15);
        name_to_repeat = name;
        valor_celda = counts + name_to_repeat;
        console.log('Se repite ' + name_to_repeat + ' ' + random_counts + ' veces.');

      } else if (counts > random_name_position && counts <= (random_name_position + random_counts)) {
        valor_celda = counts + name_to_repeat;
        counter = counter + 1;
        if (random_counts === counter) {
          countsx = (random_name_position + random_counts) + random_counts;
          random_name_position = countsx;
          last_repeat = last_repeat + 1;
          counter = 0;
        }
      } else {
       valor_celda = counts + name;
      }
        
    } else { //Nombres repetidos entre 15-25, 1 vez.
      
      if (counts === random_name_position) {
        random_counts = getRandomInteger(5, 15);
        name_to_repeat = name;
        valor_celda = counts + name_to_repeat;
        console.log('Se repite ' + name_to_repeat + random_counts + ' veces.');

      } else if (counts > random_name_position && counts <= (random_name_position + random_counts)) {
        valor_celda = counts + name_to_repeat;
        counter = counter + 1;
        if (random_counts === counter) {
          countsx = (random_name_position + random_counts) + random_counts;
          random_name_position = countsx;
          last_repeat = 1;
          counter = 0;
        }
      } else {
        valor_celda = counts + name;
      }
    }
     console.log('X::' + valor_celda)
      this.cells[0].innerHTML = valor_celda;
      this.classList.add('td_counter_'+counts);
    }
    
    $('#total_columns').text('Total: ' + counts);

    counts++;
  });
  
  randomSalesman();
  
}

//Funcion para obtener vendedores aleatorios........................................................................................................
function randomSalesman() {
  //Random salesmans counters
  var randomSales = 1;
  var sale_row = 0;
  var text_original = '';
  var nuevo_texto = '';
  var valor_celda_original = '';
  var valor_celda = '';
  var i = 0;
  
  $('tr.active').each(function () {
    if (i === sale_row) {
        if(i === 0){
          this.cells[0].innerHTML = '>';
        }else{
          if (randomSales < 6) {
          randomSales = randomSales + 1;
          sale_row = sale_row + getRandomInteger(10, 75);
          //text_original = $('.td_counter_' + sale_row).text();
          valor_celda_original = this.cells[0].innerText;
          nuevo_texto = valor_celda_original + ' (' + salesman[Math.floor(Math.random() * salesman.length)] + ')';
          this.cells[0].innerHTML = nuevo_texto;
          //$('.td_counter_' + sale_row).text(nuevo_texto);

        } else {
          randomSales = 1;
          sale_row = sale_row + getRandomInteger(75, 150);
          valor_celda_original = this.cells[0].innerText;
          nuevo_texto = valor_celda_original + ' (' + salesman[Math.floor(Math.random() * salesman.length)] + ')';
          this.cells[0].innerHTML = nuevo_texto;
          //$('.td_counter_' + sale_row).text(nuevo_texto);
        }
      }
      
    }
    i++;
  });
  
}

//Check if value exist consecutive
function removeConsecutives(val,letter){
  //console.log(val)
  //Remove 5 consecutives
  if(val >= 10){
    getTableArrays($('#tabla'),letter,val);
  }
}

function getTableArrays($table,letter,val){
  function getVisibleRowText($row){
        return $row.find('td.td-vals').text();
      }
      var count = 0;
  $table.find('tr.active').each(function(index, row){
          var $row = $(row);
          
          $row.each(function(index, next){
              var $next = $(next);
              var arr_chars = getVisibleRowText($next).split('');
              var chars = getVisibleRowText($next)
               //console.log(count + ' : ' + arr_chars);
               var consecutive = streak(arr_chars);
              //console.log(consecutive);
              if(consecutive[0] == 5 && consecutive[1] == letter && val == 10){ //Borrar 5 consecutivas
                 $next.remove();
              }else if(consecutive[0] == 4 && consecutive[1] == letter && val == 13){ //Borrar 4 consecutivas
                 $next.remove();
              }else if(consecutive[0] == 3 && consecutive[1] == letter && val == 14){ //Borrar 3 consecutivas
                 $next.remove();
              }else if(letter == 'L' && val == 11 && chars.includes('LLL') && chars.includes('EEE')){ //Borrar 3L - 3E
                $next.remove();
              }else if(letter == 'L' && val == 12 && chars.includes('LLL') && chars.includes('VVV')){ //Borrar 3L - 3V
                $next.remove();
              }else if(letter == 'E' && val == 11 && chars.includes('EEE') && chars.includes('LLL')){ //Borrar 3E - 3L
                $next.remove();
              }else if(letter == 'E' && val == 12 && chars.includes('EEE') && chars.includes('VVV')){ //Borrar 3E - 3V
                $next.remove();
              }else if(letter == 'V' && val == 11 && chars.includes('VVV') && chars.includes('LLL')){ //Borrar 3V - 3L
                $next.remove();
              }else if(letter == 'V' && val == 12 && chars.includes('VVV') && chars.includes('EEE')){ //Borrar 3V - 3E
                $next.remove();
              } else if (val == 15) { //4 pares
                var contador = 0;
                var string = chars.toString();
                console.log(string)
                if (string !== false && string !== null && string !== '') {
                //console.log(string.match(/LL/gi).length)
                if(string.match(/LL/gi)){
                  var ls = parseInt(string.match(/LL/gi).length) || 0;
                  contador = contador + ls;
                }
                if(string.match(/EE/gi)){
                  var es = parseInt(string.match(/EE/gi).length) || 0;
                  contador = contador + es;
                }
                if(string.match(/VV/gi)){
                  var vs = parseInt(string.match(/VV/gi).length) || 0;
                  contador = contador + vs;
                }
                if(contador === 4){
                  $next.remove();
                }
                }
              }
          });
          count++;
      });
  reloadTds();
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function streak(arr) {
    var i,
        temp,
        streak,
        length = arr.length,
        highestStreak = 0,
        highestStreakLetter;

    for(i = 0; i < length; i++) {
        // check the value of the current entry against the last
        if(temp != '' && temp == arr[i]) {
            // it's a match
            streak++;
        } else {
            // it's not a match, start streak from 1
            streak = 1;
        }
        
        // set current letter for next time
        temp = arr[i];
        
        // set the master streak var
        if(streak > highestStreak) {
            highestStreakLetter = temp;
            highestStreak = streak;
        }
    }
    
    return [highestStreak, highestStreakLetter];
}


//Shuffle rows
(function ($) {

  $.fn.shuffle = function () {
    return this.each(function () {
      var items = $(this).children().clone(true);
      return (items.length) ? $(this).html($.shuffle(items)) : this;
    });
  }

  $.shuffle = function (arr) {
    for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
  }

})(jQuery);

//var array = [2,5,3,1,1,'L','L','L','E','E','E',4,7,2,3,1,1,4,3];
//var inc = 'L','L','L','E','E','E';
//console.log(array.includes('L','L','L','E','E','E'))
//console.log(streak(array));
var x = 'EVLLLEEEL';
console.log(x.includes('LLLVVV'))

var salesman = Array('Carmen Serdan',
  'Lalo Reyes',
  'Comandante',
  'Elizondo',
  'PepeBoy',
  'Juan Hernandez',
  'El Ganador',
  'Tigre Mayor',
  'Elton Rios',
  'Riccardo',
  'Herrera Paz',
  'Wanaco',
  'Merlo',
  'RadioHead',
  'Carpinterito',
  'Hno Lelo',
  'Mandarino',
  'Tigre Gignac',
  'PablitoGas',
  'Tienda Mary',
  'Doña Cuca',
  'Zabdi Harumi',
  'Pegasso',
  'Rigo Tovar',
  'ToñoCasas',
  'Pepe El Toro',
  'Vamos Con Todo',
  'El Rayas',
  'Rayado Vencedor',
  'Pandillero',
  'Tacos Primo',
  'Calle Morelos',
  'Soledad',
  'Hugo Ramirez',
  'El Jaibo',
  'Jairo Mares',
  'Emiliano Zapata',
  'Pancho Villa',
  'El Villano',
  'Puras Ganas',
  'Pingüino',
  'Rosa Tamales',
  'Rosy Méndez',
  'Doña Cuquita',
  'ValleVerde',
  'Apodaca',
  'La Estanzuela',
  'Santa',
  'López Mateos',
  'TigreToño',
  'El Puma',
  'Chava Cano',
  'El Piratita',
  'Letty Ramos',
  'Don Matute',
  'Madrugador',
  'Estrella Dorada',
  'Cuauhtémoc',
  'El Sirenito',
  'Buscador',
  'Nacho Luchas',
  'El Luchador',
  'Matamoros',
  'Charcas',
  'Veracruzano',
  'Neto Luna',
  'Beto Rangel',
  'Ángel Guillén',
  'El Bolis',
  'La Bolita',
  'Coca Cola',
  'Facpya',
  'FIME',
  'Medicina',
  'Avellaneda',
  'Contry Sol',
  'Lupe Herrera',
  'Patty Nava',
  'Marinerito',
  'Maromero',
  'Linares',
  'La Michoacana',
  'Alameda',
  'Chiva Hermano',
  'Clavillazo',
  'Mil Máscaras',
  'Chocoroles',
  'Canelo',
  'Don Maty',
  'Matías Loera',
  'JC Chávez',
  'Macario',
  'Milusos',
  'Ronaldhiño',
  'Cabezón',
  'Los Rodríguez',
  'Cubanito',
  'Michelín',
  'Pilares',
  'Centrika',
  'Costeño',
  'Vizcaíno',
  'Chicharito',
  'El Mexicano',
  'Aristóteles',
  'Amy Guerra',
  'Regiomontano',
  'Soldadores',
  'IngeBaños',
  'DocRamones',
  'ArquiToño',
  'Romualdo',
  'Nandin',
  'Mando Valdés',
  'Castillejos',
  'Santillana',
  'Villaseñor',
  'Villamelon',
  'Independencia',
  'Valenciano',
  'Portero',
  'Libres y Locos',
  'Mocorito',
  'Chagos Bar',
  'Molinero',
  'FEMSA',
  'OXXO',
  'Bellavista',
  'Lindavista',
  'Super 7',
  'Obispado',
  'Juan Balderas',
  'Rebolledo',
  'Valladares',
  'Renato V.',
  'Carlos G.',
  'Valles',
  'Loco Páez',
  'Cruz Azulino',
  'Necaxista',
  'Taxistas',
  'Leo Messi',
  'Maradona',
  'Costa Azul',
  'Calaveras',
  'Rosalinda',
  'Aeropuerto',
  'Fundidora',
  'Calvin Harris',
  'Barrio Antiguo',
  'Macroplaza',
  'Condominios',
  'Eloy Cavazos',
  'Bosque Mágico',
  'First Cash',
  'Monte Piedad',
  'Ruleteros',
  'Fleteros',
  'HEB',
  'Motociclistas',
  'José Gallegos',
  'Paco Cantú',
  'Colmenares',
  'Pomares',
  'Villalón',
  'Torre Mayor',
  'Torre Top',
  'Bancomer',
  'Basílica',
  'Josephinos',
  'Plateros',
  'Chilango',
  'Cinemex',
  'Peñoles',
  'Banco Afirme',
  'Raúl Capablanca',
  'Satélite',
  'Abastos Gpe.',
  'Alamey',
  'Kia',
  'Las Torres',
  'Barrio Negro',
  'Felipe Cruz',
  'Cristiano',
  'Bodegueros',
  'El Borrego',
  'Latín Lover',
  'Schumacher',
  'Schuster',
  'Gringo',
  'Americanista',
  'Ruvirosa',
  'Tommy Sainz',
  'Cadeteyta',
  'CEMEX',
  'Tampiquito',
  'Bar San Pedro',
  'Tlaquepaque',
  'Goyito Blanco',
  'FAMSA',
  'Central',
  'Abastecimientos',
  'Contadores',
  'Taller Cedillo',
  'Talleres',
  'Y Griega',
  'La Purísima',
  'Loma Larga',
  'Pato Ledezma',
  'Riquelme',
  'El TRI',
  'Romeritos',
  'Torres Moradas',
  'Pabellón',
  'Lucy Montes',
  'El Cabrito',
  'Arramberri',
  '5 de Mayo',
  'La Treviño',
  'Miramontes',
  'Miraflores',
  'Tito Fuentes',
  'Dentistas',
  'Las Puentes',
  'Mesoneros',
  'UDEM',
  'TecMilenio',
  'TecMTY',
  'PrepaTEC',
  'Chayito Torres',
  'Alijadores',
  'Metrorey',
  'Estadio',
  'Vidales',
  'Vitro',
  'Ford',
  'Cerámica',
  'Hylsa',
  'Altos Hornos',
  'Villacero',
  'Prolec',
  'Martincillo',
  '3 de Marzo',
  'Escobedo',
  'Ciénaga',
  'Panaderos');

var names = Array('2 AMIGOS',
  'ABARROTES',
  'ABRAHAM',
  'ABRIL',
  'ADAL',
  'ADATA',
  'ADRIAN',
  'ADRIAN',
  'ADRIAN',
  'ADRIANA',
  'ADRIANNN',
  'ADUARDO',
  'AGM',
  'AGMS',
  'AGUSTIN',
  'AGUSTINES',
  'ALAN',
  'ALBERTILLO',
  'ALBERTO',
  'ALBERTO',
  'ALBERTO',
  'ALBERTON',
  'ALBERTOSO',
  'ALCALI',
  'ALDFONSO',
  'ALDO',
  'ALEJANDRA',
  'ALEJANDREZ',
  'ALEJANDRIN',
  'ALEJANDRINA',
  'ALEJANDRO',
  'ALEJANDRO',
  'ALEJANDRO',
  'ALEJANDROIII',
  'ALEJANDROM',
  'ALEJO',
  'ALEJOS',
  'ALEX',
  'ALEX',
  'ALEX',
  'ALEX',
  'ALEX',
  'ALEXANDER',
  'ALEXANDER',
  'ALEXANDER',
  'ALEXDAY',
  'ALEXII',
  'ALEXIS',
  'ALEXIS',
  'ALEXV',
  'ALFONSO',
  'ALFREDO',
  'ALFREDO',
  'ALFREDO',
  'ALFREDO',
  'ALICIA',
  'ALICIAB',
  'ALMA',
  'ALÑEJO',
  'ALONDRA',
  'ALONSO',
  'ALONSO',
  'ALONSOS',
  'AMADA',
  'AMERICA',
  'AMERICA',
  'AMERICANISTA',
  'AMIGASO',
  'AMIGO',
  'ANA',
  'ANAISA',
  'ANAY',
  'ANDRES',
  'ANDRES',
  'ANDRESES',
  'ANDY',
  'ANGEL',
  'ANGEL',
  'ANGEL',
  'ANGEL',
  'ANGEL',
  'ANGELA',
  'ANGELIN',
  'ANGELV',
  'ANGIE',
  'ANTENAS',
  'ANTONIO',
  'ANTONIO',
  'ANTONIOG',
  'ANTONIOS',
  'APMS',
  'ARATH',
  'ARELLANO',
  'ARMANDO',
  'ARMANDO',
  'ARON',
  'ARTURO',
  'ARTURO',
  'ARTURO',
  'ARTURO',
  'ARTURO',
  'ARTURO',
  'ARZOLA',
  'AURORA',
  'AURORA',
  'AVALOS',
  'AXEL',
  'AXEL',
  'BALATZAR',
  'BALTAZAR',
  'BARBADILLO',
  'BARBAS',
  'BARBER',
  'BARBOZA',
  'BARBOZA',
  'BARDO',
  'BB',
  'BEBA',
  'BEBE',
  'BEBE',
  'BEBES',
  'BECERRO',
  'BECERROII',
  'BENITO',
  'BENITO',
  'BENITO',
  'BENITO2',
  'BENITOII',
  'BENITOV',
  'BENNY',
  'BENOTO',
  'BENY',
  'BERNA',
  'BERTA',
  'BETARRO',
  'BETO',
  'BETO',
  'BETO',
  'BETO',
  'BETO',
  'BETO',
  'BETOIII',
  'BETON',
  'BETOSO',
  'BETURRO',
  'BIGO',
  'BISTEK',
  'BOCHO',
  'BODIES',
  'BODY',
  'BODYA',
  'BODYSCAN',
  'BOGAR',
  'BOLU',
  'BOMBOM',
  'BOMBON',
  'BOMBONES',
  'BRANDON',
  'BRANDONIN',
  'BRISA',
  'BRITO',
  'BRUK',
  'BRUKS',
  'BRUKY',
  'BSM',
  'CABHIÑO',
  'CACDEREYTA',
  'CADEREYTA',
  'CADEREYTIN',
  'CALEB',
  'CAMARONES',
  'CAMILA',
  'CANO',
  'CANO',
  'CAPI',
  'CAR',
  'CARIES',
  'CARLILLOS',
  'CARLOS',
  'CARLOS',
  'CARLOS',
  'CARLOSD',
  'CARLOSE',
  'CARLOSG',
  'CARLOSG',
  'CARLOSH',
  'CARLOSI',
  'CARLOSJ',
  'CARLOSV',
  'CARMELO',
  'CARMEN',
  'CARMEN',
  'CARONA',
  'CARTAJENA',
  'CASTILLO',
  'CATA',
  'CATAN',
  'CECY',
  'CELIA',
  'CELSO',
  'CELY',
  'CESAR',
  'CESAR',
  'CESAR A',
  'CESAR O',
  'CESAR R',
  'CESAREO',
  'CESARG',
  'CESARILLO',
  'CESARIN',
  'CESARITO',
  'CESARL',
  'CESARN',
  'CESARP',
  'CESARR',
  'CESARRO',
  'CESARS',
  'CESARU',
  'CHAMULA',
  'CHARLES',
  'CHARLESG',
  'CHARLESIANO',
  'CHARLESITO',
  'CHARLESTON',
  'CHARLY',
  'CHARLY',
  'CHARLY',
  'CHAVITA',
  'CHECAS',
  'CHECO',
  'CHECO',
  'CHELA',
  'CHELA',
  'CHELA',
  'CHELELO',
  'CHEMO',
  'CHENCHO',
  'CHENCHO',
  'CHENITA',
  'CHEPE',
  'CHESPI',
  'CHICHARRIN',
  'CHINO',
  'CHINO',
  'CHITA',
  'CHITO',
  'CHIVO',
  'CHRISATIAN',
  'CHRISTIAN',
  'CHUY',
  'CHUY',
  'CHUY',
  'CHUY',
  'CHUY',
  'CHUYITO',
  'CINDY',
  'CINTHIA',
  'CINTHYA',
  'CLIMAS',
  'COCHO',
  'COMPAÑERO',
  'CONCHELLO',
  'CPM',
  'CRABS',
  'CRISTIAN',
  'CRISTIAN',
  'CRUZITO',
  'CUATE',
  'CUATHEMOC',
  'CUCO',
  'CZAR',
  'DAGO',
  'DAMINO',
  'DANIEL',
  'DANIEL',
  'DANIEL J',
  'DANIELA',
  'DANIELB',
  'DANIELES',
  'DANIELG',
  'DANIELITO',
  'DANIELUCO',
  'DANTE',
  'DANY',
  'DAVID',
  'DAVID',
  'DAVID',
  'DAVID',
  'DAVIDCOPA',
  'DAVIDERO',
  'DAVIDES',
  'DAVIDS',
  'DENOVA',
  'DENOVAC',
  'DEVANI',
  'DGO',
  'DIANA',
  'DIEGO',
  'DIEGUIN',
  'DILAN',
  'DIMAS',
  'DIONICIO',
  'DIONISIO',
  'DIVA',
  'DIVA',
  'DJ',
  'DOBERMAN',
  'DOLORES',
  'DOMINO',
  'DON ANDY',
  'DON CHUY',
  'DON PEPE',
  'DONY',
  'DOÑA',
  'DOÑA BETY',
  'DOÑA PERA',
  'DOÑA PERAS',
  'DORIS',
  'DORISMAR',
  'EABI',
  'EDER',
  'EDGAR',
  'EDGAR',
  'EDGAR',
  'EDNA',
  'EDUARDE',
  'EDUARDO',
  'EDUARDO',
  'EDUARDOG',
  'EFRAI',
  'EL 25',
  'EL AGUILA',
  'EL CHISPAS',
  'EL CHISPAZO',
  'EL FAZ',
  'EL FAZITO',
  'EL GOLLITO',
  'EL GOLLO',
  'EL GOLLON',
  'EL GORDO',
  'EL KEY',
  'EL KEYS',
  'EL MAGO',
  'EL MANGO',
  'EL MUS',
  'EL PADRINO',
  'EL PAJARO',
  'EL PAYO',
  'EL PIODO',
  'EL POLLO',
  'EL PRIMO',
  'EL PRIMO',
  'EL TOÑA',
  'EL TOÑO',
  'EL TURU',
  'EL TUZO',
  'ELABUELO',
  'ELADIO',
  'ELCARTERO',
  'ELEAZAR',
  'ELES',
  'ELITO',
  'ELITO',
  'EMILIO',
  'EMILIO',
  'EMILIO A',
  'ENRIQUE',
  'ENRIQUE',
  'ENRIQUE',
  'ENRIQUE',
  'ENRIQUE A',
  'ENRIQUEL',
  'ERICK',
  'ERICKA',
  'ERIKA',
  'ERIKA',
  'ERNESTO',
  'ERNESTO',
  'ERNESTO',
  'ERNESTO',
  'ERNESTOS',
  'ESCOBAR',
  'ESCOBARES',
  'ESPINOSA',
  'ESTRADA',
  'EULOGIO',
  'EVARISTO',
  'FABIAN',
  'FACTOR',
  'FARO',
  'FAUSTINILLO',
  'FAUSTINO',
  'FCO',
  'FCO',
  'FCOSS',
  'FEDERICO',
  'FELIPE',
  'FELIPE',
  'FELIPE',
  'FER',
  'FERMIN',
  'FERMIN',
  'FERMINA',
  'FERMINCO',
  'FERMINES',
  'FERMINILLO',
  'FERMINO',
  'FERNANDO',
  'FERNANDO',
  'FERNANDOII',
  'FIDEL',
  'FIDELIN',
  'FIDENCIO',
  'FIERRO',
  'FIGUEROA',
  'FILI',
  'FINE',
  'FLIPY',
  'FLOR',
  'FLORECIO',
  'FLORES',
  'FLORESES',
  'FLORESG',
  'FOCA',
  'FRANCISCO',
  'FRANCISCO',
  'FRANK',
  'FREDDY',
  'FROG',
  'FROGI',
  'GABY',
  'GALLO',
  'GALVAN',
  'GALVAN',
  'GALVANIZ',
  'GANSO',
  'GARAY',
  'GAROZ',
  'GAS',
  'GBENARO',
  'GCP',
  'GCPS',
  'GELA',
  'GEMA',
  'GERA',
  'GERA',
  'GERANIO',
  'GERARDA',
  'GERARDEÑO',
  'GERARDO',
  'GERMAN',
  'GERMANI',
  'GERMANY',
  'GIGNAC',
  'GIGNAC',
  'GIL',
  'GILBERTIN',
  'GILBERTO',
  'GIOVANY',
  'GONZALES',
  'GORDIN',
  'GORDOLOBO',
  'GRAKA',
  'GREKA',
  'GRIS',
  'GSCII',
  'GUARDIA',
  'GUICHO',
  'GUILLE',
  'GUILLECIT',
  'GUILLEN',
  'GUILLERMO',
  'GUSTAVO',
  'GUSTAVO',
  'HACTOR',
  'HECTOR',
  'HECTOR',
  'HECTOR',
  'HECTOR',
  'HECTOR',
  'HECTOR',
  'HECTORA',
  'HECTORA',
  'HECTORA',
  'HECTOREN',
  'HECTORI',
  'HECTORIN',
  'HECYOR',
  'HELEN',
  'HERNAN',
  'HERNAN',
  'HERNANDEZ',
  'HIPOLITO',
  'HOMERO',
  'HOMERO',
  'HUEVO',
  'HUEVOS',
  'HUGO',
  'HUGO',
  'HURVO',
  'IAN',
  'ILOGICO',
  'ING',
  'INGENIO',
  'INGES',
  'IRIS',
  'IRMA',
  'IRMAS',
  'ISAMAR',
  'ISMAEL',
  'ISRAEL',
  'ITZEL',
  'IVAN',
  'IVAN',
  'IVAN',
  'IVAN',
  'IVAN',
  'IVANES',
  'IVETTE',
  'JAHDIEL',
  'JAIME',
  'JAIME',
  'JAIR',
  'JAIRO',
  'JANETH',
  'JASET',
  'JASSO',
  'JAVIER',
  'JAVIER',
  'JAVIER',
  'JAVIER',
  'JAVIER',
  'JAVIER',
  'JAVIERIN',
  'JAVY',
  'JERRYII',
  'JERRYMY',
  'JERRYS',
  'JESPINOZA',
  'JESSU',
  'JESSU',
  'JESUS',
  'JESUS',
  'JESUS',
  'JESUS',
  'JESUS',
  'JESUS',
  'JESUSA',
  'JESUSII',
  'JESUSIII',
  'JESUSITA',
  'JESUSITO',
  'JESUSLOPES',
  'JESUSLOPEZ',
  'JESUSV',
  'JHONY',
  'JJLOPEZ',
  'JOAN',
  'JOAQUIN',
  'JOHAN',
  'JOHUSY',
  'JOMA',
  'JONQUIN',
  'JORDAN',
  'JORGE',
  'JORGE',
  'JORGE',
  'JORGE',
  'JORGE H',
  'JORGEII',
  'JOSE',
  'JOSE',
  'JOSE',
  'JOSE',
  'JOSE',
  'JOSE',
  'JOSE',
  'JOSEFINA',
  'JOSELOPES',
  'JOSEM',
  'JOSEM',
  'JOSEPE',
  'JOSEPIN',
  'JOSERRA',
  'JOSES',
  'JOSESION',
  'JR',
  'JRS',
  'JSTS',
  'JUAN',
  'JUAN',
  'JUAN',
  'JUAN',
  'JUAN',
  'JUAN A',
  'JUAN B',
  'JUAN C',
  'JUAN H',
  'JUAN P',
  'JUANA',
  'JUANB',
  'JUANC',
  'JUANCHO',
  'JUANELLO',
  'JUANELO',
  'JUANES',
  'JUANGA',
  'JUANITO',
  'JUANITO',
  'JUANO',
  'JUANSO',
  'JULIAN II',
  'JULIETA',
  'JULIO',
  'JULIO',
  'JULIO',
  'JULIO A',
  'JULIOROCA',
  'JULIOS',
  'JULIOS',
  'JUVENTINO',
  'KABASH',
  'KALET',
  'KARINA',
  'KARINAS',
  'KARLA',
  'KARYN',
  'KATY',
  'KENY',
  'KEVIN',
  'KIKA',
  'KIKAYO',
  'KIKE',
  'KIKES',
  'KIMANDER',
  'KINO',
  'KLEBER',
  'KLEVER',
  'KOKITO',
  'KONAN',
  'KONEJO',
  'KRISTIAN',
  'KUKIS',
  'LA MADRINA',
  'LALO',
  'LALO',
  'LALO G',
  'LALOG',
  'LAS PRINCESAS',
  'LAS PRINCESITAS',
  'LAURA',
  'LAURO',
  'LEDBA',
  'LEDBIS',
  'LEDEAMA',
  'LEDEZMA',
  'LEO',
  'LEO',
  'LEOBARDO',
  'LEON',
  'LEONARDO',
  'LEONICIO',
  'LETY',
  'LETY',
  'LIC',
  'LICEO',
  'LILIANA',
  'LIOBAS',
  'LIZZ',
  'LIZZES',
  'LLIMI',
  'LOBITO',
  'LOBO',
  'LOBO',
  'LOBOILLO',
  'LOBOTON',
  'LUCIA',
  'LUCIANO',
  'LUCIO',
  'LUCIO',
  'LUCIOS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS',
  'LUIS D',
  'LUISEÑO',
  'LUISON',
  'LUNA',
  'LUPISS',
  'LUPITA',
  'MACHINE',
  'MACHINES',
  'MACHINESA',
  'MACIAS',
  'MAGALY',
  'MAGO',
  'MALENY',
  'MANIKI',
  'MANUEL',
  'MANUEL',
  'MARA',
  'MARCELINO',
  'MARCELINOS',
  'MARCELO',
  'MARCO',
  'MARCOS',
  'MARIANA',
  'MARIANO',
  'MARIANOS',
  'MARIN',
  'MARINELA',
  'MARIO',
  'MARIO',
  'MARIO',
  'MARIO',
  'MARIOCA',
  'MARION',
  'MARIOSO',
  'MARLENE',
  'MARRAS',
  'MARRY',
  'MARTIM',
  'MARTIMUS',
  'MARTIN',
  'MARTIN',
  'MARTIN',
  'MARTIN',
  'MARTINEZ',
  'MARTINII',
  'MARTINIUS',
  'MAS',
  'MATEO',
  'MATER',
  'MATERS',
  'MATIAS',
  'MATUTE',
  'MAU',
  'MAURICIO',
  'MAURICIOS',
  'MAURIN',
  'MAURITO',
  'MAURY',
  'MAX',
  'MAXEZ',
  'MAXI',
  'MAXII',
  'MAXIM',
  'MAXIMINO',
  'MAXITO',
  'MAXRO',
  'MAY',
  'MAYELA',
  'MAYRA',
  'MDEINA',
  'MEDINA',
  'MEDINA',
  'MEJIA',
  'MEL',
  'MELI',
  'MELINA',
  'MELISA',
  'MELISA',
  'MELODA',
  'MEMO',
  'MENIE',
  'MGM',
  'MGUEL',
  'MI BB',
  'MICHEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL',
  'MIGUEL H',
  'MIGUELACIO',
  'MIGUELES',
  'MIGUELILLO',
  'MIGUELINA',
  'MIISES',
  'MIKE',
  'MIKE',
  'MIKE',
  'MIKERO',
  'MIKES',
  'MILE',
  'MILINA',
  'MILTON',
  'MILTON',
  'MINYS',
  'MODESTO',
  'MOLE',
  'MOLEMAN',
  'MOLES',
  'MOLO',
  'MOLOC',
  'MONE',
  'MONO',
  'MONSE',
  'MORALES',
  'MORE',
  'MORO',
  'MR LENO',
  'MUIRRILLO',
  'MUÑECO',
  'MXIMILIANO',
  'N1',
  'NAN',
  'NANCY',
  'NANYS',
  'NANYS1',
  'NANYS2',
  'NATALIO',
  'NATO',
  'NENO',
  'NICACIO',
  'NICOLAS',
  'NICOLASA',
  'NIETO',
  'NIETOSO',
  'NINJA',
  'NOE',
  'NORA',
  'NORRIS',
  'NUZA',
  'OBREGON',
  'OCTAVIO',
  'OLEGARIO',
  'OLGA',
  'OLIVA',
  'OLIVAS',
  'OLIVER',
  'OMAR',
  'OMAR',
  'OMAR',
  'OMAR',
  'ONTIVEROS',
  'ONTIVEROS A',
  'ORLANCO',
  'ORLANDEZ',
  'ORLANDIN',
  'ORLANDO',
  'ORLANDOII',
  'ORLANDON',
  'OROZCO',
  'OSCAR',
  'OSCAR',
  'OSCAR',
  'OSCRA',
  'OSIEL',
  'OSIELA',
  'OSIELIN',
  'OSIELON',
  'OSKKKAR',
  'OSVALDO',
  'OXXITO',
  'OXXITON',
  'OXXITOS',
  'OXXO',
  'OXXY',
  'OZIEL',
  'PABLO',
  'PACHECO',
  'PACO',
  'PACO',
  'PADILLA',
  'PAJARO',
  'PALOMEQUE',
  'PAM PER',
  'PAN',
  'PANCHITO',
  'PANCHO',
  'PANCHO',
  'PANINI',
  'PAOLA',
  'PAOLA',
  'PAOLA',
  'PAPA',
  'PAPAYA',
  'PAPAYON',
  'PAQUIADO',
  'PAQUIADOS',
  'PAQUITO',
  'PATRONA',
  'PATY',
  'PATYLLA',
  'PATYN',
  'PATYZA',
  'PAULA',
  'PAYO',
  'PEDRAZA',
  'PEDRO',
  'PEDRO',
  'PEDRO',
  'PEKE',
  'PELON',
  'PEMPER',
  'PENA',
  'PEPE',
  'PEPE',
  'PEQUE',
  'PEREICO',
  'PERICO',
  'PEYCO',
  'PEYCO',
  'PICHUS',
  'PILAR',
  'PILO',
  'PIÑA',
  'PIPIOLO',
  'PMX',
  'POLLITO',
  'POLO',
  'POLO',
  'POLO',
  'POLOII',
  'POLOII',
  'POLOPES',
  'PONCHO',
  'PONCHOS',
  'PONY',
  'PPCP',
  'PRINCESA',
  'PROLEX',
  'PUEBLO',
  'PYESAN',
  'QLA',
  'QUILA',
  'QUIQUE',
  'RAAM',
  'RADAMES',
  'RAFA',
  'RAFAEL',
  'RAFAEL',
  'RAFAEL',
  'RAFAEL',
  'RAFAEL',
  'RAFAS',
  'RAIS',
  'RAMALE',
  'RAMIREZ',
  'RAMIRO',
  'RAMON',
  'RAMON',
  'RAMOS',
  'RAMOS',
  'RAMOS',
  'RAMOS',
  'RAMZA',
  'RAUL',
  'RAULA',
  'RAULIN',
  'RAY',
  'RAYADO',
  'RAYAS',
  'RAYIN',
  'RAYITO',
  'RAYON',
  'RAYOVAC',
  'RCAM',
  'RCI',
  'REGINA',
  'REGINAS',
  'REGINO',
  'RENATA',
  'RENE',
  'REYNALDO',
  'RGM',
  'RGS',
  'RIBERTO',
  'RICARDEÑO',
  'RICARDO',
  'RICARDO',
  'RICARDO A',
  'RICARDO B',
  'RICARDOS',
  'RICARDOSO',
  'RICKY',
  'RICKY',
  'RIGO',
  'RIGOR',
  'RIK',
  'RINCON',
  'RIVAL',
  'RK',
  'ROBERTA',
  'ROBERTO',
  'ROBERTO',
  'ROBERTO',
  'ROBERTON',
  'ROBERTUCO',
  'RODOLFITO',
  'RODOLFO',
  'RODRIGO',
  'RODRIGUES',
  'RODRIGUEZ',
  'RODRIGUEZ',
  'RODRIGUEZ',
  'RODRIGUEZ G',
  'ROGELI',
  'ROLA',
  'ROLANDOH',
  'ROLLY',
  'ROMA',
  'ROMAN',
  'ROMAN',
  'ROMANILLO',
  'ROMANITO',
  'ROMANO',
  'ROMANZO',
  'ROME',
  'ROMELIA',
  'RONY',
  'ROSA',
  'ROSA',
  'ROSALES',
  'ROSALES',
  'ROSALIN',
  'ROSARIO',
  'ROYER',
  'RUBEN',
  'RUBEN',
  'RUBENIII',
  'RUEN',
  'RUMA',
  'SABIO',
  'SALVADOR',
  'SALVADOR',
  'SAMUELITOS',
  'SAMUELITROS',
  'SAMY',
  'SANCHEZ',
  'SANDRA',
  'SANDY',
  'SANT',
  'SANTOS',
  'SANTOS',
  'SANTOYO',
  'SANTOYOS',
  'SARAHI',
  'SAUL',
  'SAUL',
  'SAUL',
  'SAULA',
  'SAULCANELO',
  'SAULES',
  'SAULIN',
  'SCHUSTER',
  'SDAUL',
  'SEBAS',
  'SEBAS II',
  'SECO',
  'SECOS',
  'SENDERO',
  'SENTRA',
  'SENTRA',
  'SENTRA',
  'SENTRAS',
  'SERGIO',
  'SERGIO',
  'SERGIO',
  'SERGIOA',
  'SERGIOG',
  'SERGIOR',
  'SERGIOR',
  'SERNA',
  'SERNAS',
  'SERVANDO',
  'SERVANTO',
  'SHOP',
  'SILVA',
  'SILVESTRE',
  'SILVESTRY',
  'SIMON',
  'SIRIACO',
  'SIXTO',
  'SIXTON',
  'SIXTOS',
  'SNC',
  'SODIA',
  'SOFIA',
  'SOFIA',
  'SONIA',
  'SONIAS',
  'SONRICCS',
  'SONRIS',
  'SORDO',
  'SORDON',
  'SR CHENCHO',
  'SUMAJESTAD',
  'TACOS',
  'TACOZA',
  'TALLY',
  'TAQUIZA',
  'TARANTULA',
  'TAVARES',
  'TECATE',
  'TECATES',
  'TEGRE',
  'TEJADA',
  'TEMO',
  'TEOFILO',
  'TERE',
  'TEXANO',
  'TEXANOS',
  'TEXAS',
  'TEXAS B',
  'TEXASS',
  'TEXIS',
  'THE WORLD',
  'TIGRE',
  'TIGRE C',
  'TIGRES',
  'TIGRILLO',
  'TILLITO',
  'TIN',
  'TINO',
  'TINO',
  'TINOS',
  'TIÑO',
  'TIO',
  'TIOS',
  'TIOTO',
  'TITIS',
  'TOLLY',
  'TOMALA',
  'TOMAS',
  'TOMS',
  'TOMY',
  'TONY',
  'TONYA',
  'TONYLLO',
  'TONYTO',
  'TOÑO',
  'TOÑO',
  'TOÑO',
  'TOÑO',
  'TOÑO',
  'TOÑO',
  'TOÑO',
  'TOÑOL',
  'TOÑOV',
  'TORITO',
  'TORITOS',
  'TORNILLOS',
  'TORNO',
  'TORRES',
  'TOWERS',
  'TRASPORTE',
  'TREJO',
  'TRIKO',
  'TULLY',
  'TURBO',
  'TYSOJN',
  'UGALDE',
  'VALENTINA',
  'VALLE',
  'VALLECILLO',
  'VALLECITO',
  'VALLEFELIZ',
  'VALLEHERMOSO',
  'VALLEJO',
  'VALLES',
  'VALLESIN',
  'VALLETE',
  'VALLEVENTE',
  'VALLEVERDE',
  'VAQUERO',
  'VENADILLO',
  'VENADITO',
  'VENADITO',
  'VENADO',
  'VERACRUZ',
  'VERONIO',
  'VICHO',
  'VICK',
  'VICTOR',
  'VICTOR',
  'VICTORA',
  'VICTORB',
  'VICTORC',
  'VICTORD',
  'VICTORIN',
  'VICTORINO',
  'VICTORM',
  'VICTORO',
  'VICTORON',
  'VILLA',
  'VILLA',
  'VILLAMAR',
  'WALTE',
  'WALTER',
  'WENDY',
  'WERO',
  'WICHION',
  'WICHO',
  'WICHO',
  'WICHO',
  'WICHON',
  'WILLIAMS',
  'WILLIAMSES',
  'WYNY',
  'XIMENA',
  'XITO',
  'YAMILE',
  'YARE',
  'YATELAS',
  'YEISON',
  'YEROM',
  'YOBANI',
  'YORK',
  'YORKA',
  'YORKII',
  'YORKV',
  'YORKY',
  'YOSEL',
  'YULI',
  'ZABROSA',
  'ZAMA',
  'ZAPATA',
  'ZAPATA',
  'ZAPATAL');