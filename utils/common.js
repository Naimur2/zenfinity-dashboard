export let validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export let validatePassword = function (password) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return re.test(password);
}

export let validateName = function (name) {
    var re = /^[a-zA-Z ]{2,30}$/;
    return re.test(name);
}

export let isEmptyField = function (field){
    if(field.length !==  0) return true 
    else false;
}


export function download(content, filename, contentType) {
    if (!contentType) contentType = 'application/octet-stream';
    var a = document.createElement('a');
    var blob = new Blob([content], { 'type': contentType });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}

export function getDate(date) {
    date = new Date(date);
    if(!isNaN(date.getTime())){
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return day +'-'+ monthNames[monthIndex] +'-'+ year +' '+ date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else return '---';
}

export function getDatewithoutTime(date) {
    date = new Date(date);
    if(!isNaN(date.getTime())){
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return day +'-'+ monthNames[monthIndex] +'-'+ year;
    } else return '---';
}

export function timeInAgoFormat(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    seconds = Math.abs(seconds);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
