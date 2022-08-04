function modify(length, dates) {
    let strTime = toTime(length/dates['between']);
    let unit = "";
    let modifiedTime = "";
    if (strTime.slice(0, 2) == "00") {
        modifiedTime = strTime.slice(3);
        unit = " minutes"
    } else {
        modifiedTime = strTime;
    }

    if (unit === " minutes") {
        modifiedTime = parseInt(modifiedTime, 10);
    }
    return {'time': modifiedTime, 'unit': unit};
}

function submit() {
    document.getElementById("error").style.display = "none";
    var length, lengthInMins, lengthInHrs, deadline, name, dates, includeDay;
    length = document.getElementById("length").value;
    lengthInMins = document.getElementById("lengthInMins").checked;
    lengthInHrs = document.getElementById("lengthInHrs").checked;
    deadline = document.getElementById("deadline").value;
    name = document.getElementById("title").value;
    includeDay = document.getElementById("includeDay").checked;

    var between = Math.round((new Date(deadline)-new Date()) / (1000*60*60*24));

    if (includeDay) {
        between += 1;
    };

    dates = {"now": new Date(), "deadline": new Date(deadline), "between": between};

    if (lengthInMins) {
        length = parseInt(length)/60;
    }
    
    if (check(length, name, dates)) {
        var modifystr = modify(length, dates);
        if (setAssignment(name, modifystr['time'] + modifystr['unit'] + " per day")) {
            location.reload();
        }
    } else {
        return false;
    }
}

function check(length, name, dates) {
    if (length = "" || length <= 0) {
        showError("Invalid estimated length. The number of hours/minutes must be positive.")
        return false
    }
    if (!checkDate(dates['deadline']) || dates['between'] <= 0 || dates['between'] > 90) {
        showError("Invalid date. Please enter a date in the future within 90 days.")
        return false
    }
    if (name.replace(/\s/g, '').length <= 0) {
        showError("Invalid assignment name. The name must contain more than whitespace.")
        return false
    }
    return true
}

function toTime(dec){
    var sign = dec < 0 ? "-" : "";
    var mins = Math.floor(Math.abs(dec));
    var secs = Math.floor((Math.abs(dec) * 60) % 60);
    return sign + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function checkDate(d) {
    return d instanceof Date && !isNaN(d);
  }

function showError(message) {
    document.getElementById("error").innerHTML = message;
    document.getElementById("error").style.display = "block";
}

function setAssignment(name, time) {
    if (localStorage.getItem("assignments") === null) {
        localStorage.setItem("assignments", JSON.stringify([{'name': name, 'time': time}]))
        return true
    } else {
        let assignments = JSON.parse(localStorage.getItem("assignments"));
        assignments.push({'name': name, 'time': time});
        localStorage.setItem('assignments', JSON.stringify(assignments));
    }
    return true
}

function cbClick(obj) {
    var cbs = document.getElementsByClassName("length");
    for (var i = 0; i < cbs.length; i++) {
        cbs[i].checked = false;
    }
    obj.checked = true;
}

function removeAssignment(num) {
    console.log(num)
    let assignments = JSON.parse(localStorage.getItem("assignments"));
    assignments.splice(num, 1);
    localStorage.setItem("assignments", JSON.stringify(assignments));
    location.reload();
} 


function load() {
    if (localStorage.getItem("assignments") !== null) {
        let assignments = JSON.parse(localStorage.getItem("assignments"));
        for (var i = 0; i < assignments.length; i++) {
            let element = document.createElement("p");
            element.classList.add("set-assignment");
            element.setAttribute('onclick', `removeAssignment(${i})`)
            element.textContent = `${assignments[i]['name']} - ${assignments[i]['time']}`;
            document.getElementById("assignments").appendChild(element);
        }
    } 
}