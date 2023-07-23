

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


var apiFields = [{"id":301,"name":"A_F","newName":"STT NO","hide":true},{"id":302,"name":"B_F","newName":"THỜI GIAN GỬI MAIL 通知","hide":false},{"id":303,"name":"C_F","newName":"EMAIL","hide":true},{"id":304,"name":"D_F","newName":"nhà kho đó 庫別","hide":false},{"id":305,"name":"E_F","newName":"NGÀY DỰ KIẾN 預計","hide":false},{"id":306,"name":"F_F","newName":"NGÀY THỰC TẾ VỀ 實際","hide":false},{"id":307,"name":"G_F","newName":"送貨單號 Mã đơn giao hàng","hide":false},{"id":308,"name":"H_F","newName":"SỐ KIỆN CỦA KHO NÀO  件數","hide":false},{"id":309,"name":"I_F","newName":"KHÁCH HÀNG 客戶","hide":true},{"id":310,"name":"J_F","newName":"HÀNG BÙ 補貨","hide":false},{"id":311,"name":"K_F","newName":"chổ nàchổ nào 來源 ","hide":false},{"id":312,"name":"L_F","newName":"Giờ bắt đầu bốc/dỡ hàng 卸貨","hide":false},{"id":313,"name":"M_F","newName":"Tên người","hide":true},{"id":314,"name":"N_F","newName":"SỐ XE 車號","hide":true},{"id":315,"name":"O_F","newName":"Seal/Số công 櫃號","hide":false},{"id":316,"name":"P_F","newName":"xong 完成時間","hide":false},{"id":317,"name":"Q_F","newName":"SL HÀNG VỀ 實收","hide":false},{"id":318,"name":"R_F","newName":"NÉN FILE 正確檔","hide":true},{"id":319,"name":"S_F","newName":"NHÀ CUNG ỨNG 供應商","hide":false}]

const columnsNames = apiFields
    .filter(row => row.hide == false)
    .map(rowField => {
    return {
      data: rowField.newName
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

    

// Managing toogle buttons click
const toggleLinks = document.querySelectorAll('.toggle-vis');

toggleLinks.forEach(link => {
    link.addEventListener('click', function() {
        const columnIndex = parseInt(this.dataset.column);
        console.log(columnIndex + ' is clicked ' + link.text);
    })
})
    
const table = $('#example').DataTable( {
    data: []
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



const userAction = async () => {
    const apiUrl = 'http://localhost:3000/api/getDataList'; // Replace this with the proxy server URL and the desired API endpoint

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Handle the API response data here
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

    // const response = await fetch('http://220.135.145.156:5014/api/getFields');
    // const myJson = await response.json(); //extract JSON from the http response
    // // do something with myJson
    // console.log("helo from useraction")
    // console.log(myJson)
    // return myJson;
  }

  userAction()
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
        reader = new FileReader();
        reader.onload = function(e){

            const workbook = XLSX.read(e.target.result, { type: 'binary' });

            // Assuming you want to read data from the first sheet (Sheet1)
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
          
            // Convert the worksheet data to JSON format
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
            // Now 'jsonData' contains an array of objects representing each row in the XLSX file
            // You can use this 'jsonData' array to work with your data or perform other operations
            console.log(jsonData);
        }
        reader.readAsText(csvFile);
    }
});



