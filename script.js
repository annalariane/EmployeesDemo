// Onload function -- display data on table
function init() {
    const app = document.getElementById('root');

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    app.appendChild(container);

    // Instantiation of request var and assigning a new XMLHttpRequest object to it
    // We can also use Fetch API for the same purpose, which is simpler but has less browser support.
    var request = new XMLHttpRequest();

    // Open new connection using GET request on API
    request.open('GET', 'http://dummy.restapiexample.com/api/v1/employees', true);

    request.onload = function() {
        //access JSON data here -- parse string file to object
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            data.forEach(employee => {
                //log results
                console.log('id: ' + employee.id);
                console.log('name: ' + employee.employee_name);

                // Create a div 
                const div1 = document.createElement('div');

                var rowCount = document.getElementById("empTable").rows.length;

                // Call create_Row function to create the rows for the table
                create_Row(rowCount, employee.id, employee.employee_name, employee.employee_salary, employee.employee_age);
            });
        } else {
            console.log('Status: ' + request.status);
        }
    }
    request.send();
}

// Create rows for the table
function create_Row(rowCnt, employeeId, employeeName, employeeSalary, employeeAge) {
    // Get reference to the table row
    var tableRef = document.getElementById('empTable').insertRow(rowCnt);
    console.log('tableRef: ' + tableRef);

    // Create the button for deleting data per row
    var delButton = document.createElement('input');
    delButton.id = employeeId;
    delButton.type = "button";
    delButton.className = "btn";
    delButton.value = "Delete";
    delButton.onclick = (function() {
        getConfirmation(this.id, this);
    });

    // Insert table data to table
    var td1 = tableRef.insertCell(0);
    td1.setAttribute('class', 'data--right_align');

    var td2 = tableRef.insertCell(1);
    td2.setAttribute('id', 'Name' + employeeId);

    var td3 = tableRef.insertCell(2);
    td3.setAttribute('id', 'Sal' + employeeId);

    var td4 = tableRef.insertCell(3);
    td4.setAttribute('id', 'Age' + employeeId);

    var td5 = tableRef.insertCell(4);

    // modify table data properties
    td1.innerHTML = employeeId;
    td2.innerHTML = employeeName;
    td2.onclick = function() { td2.setAttribute('contenteditable', 'true'); };
    td2.onblur = function() { update_rowName(employeeId, td2.innerText); };
    td3.innerHTML = employeeSalary;
    td3.onclick = function() { td3.setAttribute('contenteditable', 'true'); };
    td3.onblur = function() { update_rowSalary(employeeId, td3.innerText); };
    td4.innerHTML = employeeAge;
    td4.onclick = function() { td4.setAttribute('contenteditable', 'true'); };
    td4.onblur = function() { update_rowAge(employeeId, td4.innerText); };
    td5.appendChild(delButton);
}

// Insert row at the bottom of the table for new data -- after clicking Send button
function insert_Row() {
    // Get values from the input elements
    var nameInput = document.getElementById('Name').value;
    var salaryInput = document.getElementById('Salary').value;
    var ageInput = document.getElementById('Age').value;

    // Assign the above to var -- to be used as the parameter for sending update to API
    var input = JSON.stringify({
        "name": nameInput,
        "salary": salaryInput,
        "age": ageInput,
    });
    console.log('input: ' + input);

    // Make the POST request to API for the update
    var http = new XMLHttpRequest();
    var url = 'http://dummy.restapiexample.com/api/v1/create';
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var resObj = JSON.parse(this.responseText);
            console.table(resObj);

            var rowCount = document.getElementById("empTable").rows.length;
            // Add the new data
            create_Row(rowCount, resObj.id, resObj.name, resObj.salary, resObj.age);
        }
    }
    http.send(input);
}

// Confirm if user wants to permanently delete employee
function getConfirmation(employeeId, thisButton) {
    var retVal = confirm("Are you want to delete?");
    if (retVal == true) {
        // Call function to delete row
        delete_Row(employeeId, thisButton);
        return true;
    } else {
        return false;
    }
}

// Delete selected user
function delete_Row(empId, thisBtn) {
    // Make the DELETE request to API for the update
    var url = "http://dummy.restapiexample.com/api/v1/delete/";
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + empId, true);
    xhr.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Log response
            var apiRes = JSON.parse(xhr.responseText);
            console.table(apiRes);
        } else {
            console.error(apiRes);
        }
    }
    xhr.send(null);

    // Delete row on interface
    var delRow = thisBtn.parentNode.parentNode.rowIndex;
    document.getElementById('empTable').deleteRow(delRow);
}

// Update name row onblur
function update_rowName(empId, thisVal) {
    var salaryInput = document.getElementById('Sal' + empId).innerText;
    var ageInput = document.getElementById('Age' + empId).innerText;

    var input = JSON.stringify({
        "name": thisVal,
        "salary": salaryInput,
        "age": ageInput
    });
    console.log('input: ' + input);

    // Make the PUT request to API for the update
    var http = new XMLHttpRequest();
    var url = "http://dummy.restapiexample.com/api/v1/update/";
    http.open('PUT', url + empId, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (this.status >= 200 && this.status < 400) {
            console.log(this.responseText);
        }
    }
    http.send(input);
}

// Update salary row onblur
function update_rowSalary(empId, thisVal) {
    var nameInput = document.getElementById('Name' + empId).innerText;
    var ageInput = document.getElementById('Age' + empId).innerText;

    var input = JSON.stringify({
        "name": nameInput,
        "salary": thisVal,
        "age": ageInput
    });
    console.log('input: ' + input);

    // Make the PUT request to API for the update
    var http = new XMLHttpRequest();
    var url = "http://dummy.restapiexample.com/api/v1/update/";
    http.open('PUT', url + empId, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function() { //Call a function when the state changes.
        if (this.status >= 200 && this.status < 400) {
            console.log(this.responseText);
        }
    }
    http.send(input);
}

// Update age row onblur
function update_rowAge(empId, thisVal) {
    var nameInput = document.getElementById('Name' + empId).innerText;
    var salaryInput = document.getElementById('Sal' + empId).innerText;

    var input = JSON.stringify({
        "name": nameInput,
        "salary": salaryInput,
        "age": thisVal
    });
    console.log('input: ' + input);

    // Make the PUT request to API for the update
    var http = new XMLHttpRequest();
    var url = "http://dummy.restapiexample.com/api/v1/update/";
    http.open('PUT', url + empId, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function() {
        // Can call future enhancements here when an event occurs
        if (this.status >= 200 && this.status < 400) {
            console.log(this.responseText);
        }
    }
    http.send(input);
}