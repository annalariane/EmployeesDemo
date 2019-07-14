// onload function -- display data on table
function init() {
    const app = document.getElementById('root');

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    app.appendChild(container);

    //Instantiation of request var and assigning a new XMLHttpRequest object to it
    //we can also use Fetch API which for the same purpose, which is simpler but has less browser support.
    var request = new XMLHttpRequest();

    //Open new connection using GET request on API
    request.open('GET', 'http://dummy.restapiexample.com/api/v1/employees', true);

    request.onload = function() {
        //access JSON data here
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            data.forEach(employee => {
                //log results
                console.log('id: ' + employee.id);
                console.log('name: ' + employee.employee_name);

                // Create a div 
                const div1 = document.createElement('div');
                //card.setAttribute('class', 'card');

                var rowCount = document.getElementById("empTable").rows.length;

                make_Row(rowCount, employee.id, employee.employee_name, employee.employee_salary, employee.employee_age);

            });
        } else {
            console.log('Status: ' + request.status);
        }
    }
    request.send();
}

function make_Row(rowCnt, employeeId, employeeName, employeeSalary, employeeAge) {
    // Get a reference to the table
    var tableRef = document.getElementById('empTable').insertRow(rowCnt);
    console.log('tableRef: ' + tableRef);

    // Create the buttons for editing and deleting data per row

    var delButton = document.createElement('input');
    delButton.id = employeeId;
    delButton.type = "button";
    delButton.className = "btn";
    delButton.value = "Delete";
    delButton.onclick = (function() {
        getConfirmation(this.id, this);
    });

    var td1 = tableRef.insertCell(0);
    td1.setAttribute('class', 'data--right_align');

    var td2 = tableRef.insertCell(1);
    td2.setAttribute('contenteditable', 'true');
    td2.setAttribute('id', 'Name' + employeeId);

    var td3 = tableRef.insertCell(2);
    td3.setAttribute('contenteditable', 'true');
    td3.setAttribute('id', 'Sal' + employeeId);

    var td4 = tableRef.insertCell(3);
    td4.setAttribute('contenteditable', 'true');
    td4.setAttribute('id', 'Age' + employeeId);

    var td5 = tableRef.insertCell(4);

    td1.innerHTML = employeeId;
    td2.innerHTML = employeeName;
    td2.onblur = function() { update_rowName(employeeId, td2.innerText); };
    td3.innerHTML = employeeSalary;
    td3.onblur = function() { update_rowSalary(employeeId, td3.innerText); };
    td4.innerHTML = employeeAge;
    td4.onblur = function() { update_rowAge(employeeId, td4.innerText); };
    td5.appendChild(delButton);
}

function insert_Row() {

    var nameInput = document.getElementById('Name').value;
    var salaryInput = document.getElementById('Salary').value;
    var ageInput = document.getElementById('Age').value;

    var input = JSON.stringify({
        "name": nameInput,
        "salary": salaryInput,
        "age": ageInput,
    });
    console.log('input: ' + input);

    var http = new XMLHttpRequest();
    var url = 'http://dummy.restapiexample.com/api/v1/create';
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var resObj = JSON.parse(this.responseText);

            var rowCount = document.getElementById("empTable").rows.length;

            make_Row(rowCount, resObj.id, resObj.name, resObj.salary, resObj.age);
        }
    }
    http.send(input);
}

// Confirm if user wants to permanently delete employee
function getConfirmation(employeeId, thisButton) {
    var retVal = confirm("Are you want to delete?");
    if (retVal == true) {
        delete_Row(employeeId, thisButton);
        return true;
    } else {
        return false;
    }
}

// Delete selected user
function delete_Row(empId, thisBtn) {
    var url = "http://dummy.restapiexample.com/api/v1/delete/";
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url + empId, true);
    xhr.onload = function() {
        var users = JSON.parse(xhr.responseText);
        if (this.status >= 200 && this.status < 400) {
            console.table(users);
        } else {
            console.error(users);
        }
    }
    xhr.send(null);

    var delRow = thisBtn.parentNode.parentNode.rowIndex;
    document.getElementById('empTable').deleteRow(delRow);
}

function update_rowName(empId, thisVal) {
    var salaryInput = document.getElementById('Sal' + empId).innerText;
    var ageInput = document.getElementById('Age' + empId).innerText;

    var input = JSON.stringify({
        "name": thisVal,
        "salary": salaryInput,
        "age": ageInput
    });
    console.log('input: ' + input);

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

function update_rowSalary(empId, thisVal) {
    var nameInput = document.getElementById('Name' + empId).innerText;
    var ageInput = document.getElementById('Age' + empId).innerText;

    var input = JSON.stringify({
        "name": nameInput,
        "salary": thisVal,
        "age": ageInput
    });
    console.log('input: ' + input);

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

function update_rowAge(empId, thisVal) {
    var nameInput = document.getElementById('Name' + empId).innerText;
    var salaryInput = document.getElementById('Sal' + empId).innerText;

    var input = JSON.stringify({
        "name": nameInput,
        "salary": salaryInput,
        "age": thisVal
    });
    console.log('input: ' + input);

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