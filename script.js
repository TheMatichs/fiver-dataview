
const URL = 'http://localhost:3000'

var apiData = [
    [
        23,
        "1",
        "20220420T135149",
        "[FILE]##BU BC QC FW  HÀNG LỖI -  MX-VN-22-04-015 - BC2022040026 - ĐÃ BÙ 4 20 - MAVN.msg",
        "PL",
        "",
        "20220420T135149",
        "0420 1K",
        "1",
        "KUIU",
        "",
        "TM",
        "",
        "",
        "",
        "",
        "",
        "",
        "[FILE]",
        "ADVN",
        "2022-04-20 05:52:15"
    ],
    [
        24,
        "2",
        "20220420T135149",
        "[FILE]##LO 1K TEM DAN THE BAI YVJP LÔ 1K - 4 20.msg",
        "PL",
        "",
        "20220420T135149",
        "0420 1K",
        "1",
        "KUIU",
        "",
        "TM",
        "",
        "",
        "",
        "",
        "",
        "",
        "[FILE]",
        "YVJP",
        "2022-04-20 05:52:15"
    ],
    [
        25,
        "3",
        "20220420T142716",
        "[FILE]##7K THE BAI THÔNG BÁO HÀNG VỀ.msg",
        "PL",
        "",
        "20220420T142716",
        "0420 7K",
        "7",
        "KUIU",
        "",
        "TD",
        "",
        "",
        "",
        "",
        "",
        "",
        "[FILE]",
        "BRHK",
        "2022-04-20 06:28:27"
    ]
]

// fetchPostEndPoint('/api/getDataList', {
//     "type":"A",
//     "fields": [ {"i_f":["kuiu", "puma"]}]
// })

var apiFields = [];
var apiData = [];
var rendredViewData = []; // this is used to render each row just for the table, removing the id and date 

// This functions fetches fields from backend and put them in the ApiFields variable 
await fetchGetEndPoint('/api/getFields').then((getFieldsResult) => {
    console.log('GET FIELDS :')
    console.log(getFieldsResult)
    apiFields = getFieldsResult;
})

await fetchPostEndPoint('/api/getDataList', {
    "type":"A",
    "fields": []
}).then((getDataListResult) => {
    console.log(getDataListResult)
    apiData = getDataListResult;
    rendredViewData = apiData.map(row => row.slice(1, row.length - 1));
    console.log(rendredViewData)
})

const columnsNames = apiFields
.filter(row => row.hide == false)
.map(rowField => {
return {
  title: rowField.newName
};
});

console.log(columnsNames)

// Populate html with fields name for columns and toogle buttons
const toogleContainerElement = document.getElementById('toogle-container'); 
const theadRow = document.querySelector('#example thead tr');

    apiFields
        .filter(field => field.hide == false)
        .forEach((field, index) => {
            const link = document.createElement('a');
            link.className = 'toggle-vis';
            link.dataset.column = index;
            link.text = field.newName;
            toogleContainerElement.appendChild(link);   
    });

    apiFields
        .filter(field => field.hide == false)
        .forEach(field => {
        // column fields
        const thElement = document.createElement('th');
        thElement.textContent = field.newName;
        theadRow.appendChild(thElement); 
    });

    

// Managing toogle buttons click for fields
const toggleLinks = document.querySelectorAll('.toggle-vis');

toggleLinks.forEach(link => {
    link.addEventListener('click', function() {
        const columnIndex = parseInt(this.dataset.column);
        console.log(columnIndex + ' is clicked ' + link.text);
    })
})

const table = $('#example').DataTable( {
    // columnDefs: [{
    //     "defaultContent": "unknown",
    //     "targets": "_all"
    //   }],
    columns: columnsNames,
    data: rendredViewData
} );

document.querySelectorAll('a.toggle-vis').forEach((el) => {
    el.addEventListener('click', function (e) {
        e.preventDefault();
 
        let columnIdx = e.target.getAttribute('data-column');
        let column = table.column(columnIdx);
 
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
            console.log(data);
        })
        }
        reader.readAsText(csvFile);
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

