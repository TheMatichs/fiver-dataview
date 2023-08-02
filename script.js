
const URL = 'http://localhost:3000'


var apiFields = [];
var apiData = [];
var dataExtractedFromFile = [];
var columnsExtractedFromFile = [];
var actionColumns = [{ // This is going to be unshifted to renderViewData for the datatable view
            data: null,
            className: 'dt-center editor-edit',
            defaultContent: '<i class="fa fa-pencil"/>',
            orderable: false,
        },
        {
            data: null,
            className: 'dt-center editor-delete',
            defaultContent: '<i class="fa fa-trash"/>',
            orderable: false
        }]

const titleMapping = {};


// This functions fetches fields from backend and put them in the ApiFields variable 
await fetchGetEndPoint('/api/getFields').then((getFieldsResult) => {
    console.log('GET FIELDS :')
    console.log(getFieldsResult)
    apiFields = getFieldsResult;

    /* THIS IS TO GET EACH FIELD IN AN INDEX TO MAP TO THE ARRAY OF DATA */
    apiFields.forEach((field, index) => {
      const id = parseInt(index+1);
      const newName = field.newName;
      titleMapping[id] = newName;
    })
})

await fetchPostEndPoint('/api/getDataList', {
    "type":"A",
    "fields": [ ]
}).then((getDataListResult) => {
    apiData = getDataListResult.map((row) => {
      const obj = {};
      obj["id"] = parseInt(row[0]);
      
      // last index and the first for ID / DATE
      for (let i = 1; i <= apiFields.length; i++) {
        obj[titleMapping[i]] = row[i];
      }
      return obj;
    });
    console.warn(apiData)

})

const columnsNames = apiFields
.filter(row => row.hide == '')
.map((rowField) => {
return {
  data: rowField.newName
};
});

 columnsNames.push(actionColumns[0], actionColumns[1])
 console.log(columnsNames)


// Populate html with fields name for columns and toogle buttons
const toogleContainerElement = document.getElementById('toogle-container'); 
const theadRow = document.querySelector('#example thead tr');
let apiFieldsLength = apiFields.filter(field => field.hide == '').length;

/* USED TO POPULATE TOGGLE COLUMNS ON THE TOP */
    apiFields
        .forEach((field, index) => {
            const link = document.createElement('a');
            link.className = 'toggle-vis';
            link.dataset.column = index;
            link.text = field.newName;
            toogleContainerElement.appendChild(link);   
    });

/* USED TO POPULATE TOGGLE COLUMNS ON THE DATA TABLE */
    apiFields
        .filter(field => field.hide == '')
        .forEach((field, index) => {
        // column fields
        const thElement = document.createElement('th');
        thElement.textContent = field.newName;
        theadRow.appendChild(thElement); 
          
        // When populating columns in html is done, add two column for edit and delete button
        if (index == apiFieldsLength - 1) {
          for(let i = 0; i < 2; i++) {
            const thElement = document.createElement('th');
            theadRow.appendChild(thElement); 
          }
        }
    });

    

// Managing toogle buttons click for fields
const toggleLinks = document.querySelectorAll('.toggle-vis');

toggleLinks.forEach(link => {
    link.addEventListener('click', function() {
        const columnIndex = parseInt(this.dataset.column);
       
    })
})

const editor = new DataTable.Editor({
  idSrc: '',
  table: '#example',
  fields: 
    apiFields.map((field) => {
      return {
        label: field.newName,
        name: field.newName
      }
    }),
    idSrc: 'id'
});

const table = $('#example').DataTable( {
    columns: columnsNames,
    data: apiData,
    dom: 'Bfrtip',
} );

// Edit record
table.on('click', 'td.editor-edit', function (e) {
  e.preventDefault();

  editor.edit(e.target.closest('tr'), {
      title: 'Edit record',
      buttons: 'Update'
  });
});

// Delete a record
table.on('click', 'td.editor-delete', function (e) {
  e.preventDefault();

  editor.remove(e.target.closest('tr'), {
      title: 'Delete record',
      message: 'Are you sure you wish to remove this record?',
      buttons: 'Delete'
  });
});

document.querySelectorAll('a.toggle-vis').forEach((el) => {
    el.addEventListener('click', function (e) {
        e.preventDefault();
      
        let columnIdx = e.target.getAttribute('data-column');
        let column = table.column(columnIdx);
        console.warn(column);
        // Toggle the visibility
        column.visible(!column.visible());
    });
});


  /*
   Uploading csv file
  */

   $('#upload').click(function(){

    var csv = $('#filename');
    var csvFile = csv[0].files[0];
    var extension = csv.val().split(".").pop().toLowerCase();
    
    if($.inArray(extension, ["csv","xlsx"]) === -1){
        alert('upload csv');
        return false;
    }
    if(csvFile != undefined){
        readXlsxFile(csvFile).then(function(data){
            columnsExtractedFromFile = data[0];
            dataExtractedFromFile = data.slice(1, data.length)
            dataExtractedFromFile.map(row => {
                table.row.add(row).draw();
            });
        })
        }
    }
);


/*
    FETCHING API
*/

async function fetchPostEndPoint (endPoint ,requestBody) { {
    const url = URL + endPoint;
    console.log(endPoint)
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    };
    
    return fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        return error;
      });
    }
}

async function fetchGetEndPoint(endPoint) { {
        const url = URL + endPoint;
      
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        };
        
        return fetch(url, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            return data;
          })
          .catch(error => {
            return error;
          });
        }
    }

