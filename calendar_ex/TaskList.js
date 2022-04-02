class TaskList {

    constructor() {
        this.taskList = [];
    }

    addTask(task) {
        this.taskList.push(task);
    }

    removeTaskByDate(dayString) {
        for(let i=0; i<this.taskList.length; i++){
            if(this.taskList[i].date==dayString){
                let item = this.taskList[i];
                this.taskList.splice(i, 1); 
                // console.log(item);
                return item;
            }
        }
    }

    findNumberOfMonth(month = today.getMonth() + 1, year = today.getFullYear()) {
        switch (month) {
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                if (year % 4 == 0 && year % 100 != 0) {
                    return 29;
                } else {
                    return 28;
                }
                break;
            default:
                return 31;
        }
    }

    findTaskByDate(dayString){
        if(this.taskList == null) return undefined;
        for(let i=0; i<this.taskList.length; i++){
            if(this.taskList[i].date==dayString){
                return this.taskList[i];
            }
        }
        return undefined;
    }

    renderList() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const currentDate = new Date();

        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        let dayOfTheFirst = today.getDay() + (7 - (today.getDate() - 1) % 7); //thứ của ngày 1 = thứ hiện tại ở tuần đầu - số ngày đến ngày 1
        if (dayOfTheFirst >= 7) {
            dayOfTheFirst -= 7;
        }
        let startDate = 1;
        let content = `
        <table>
            <tr>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday </th>
                <th>Friday</th>
            </tr>
        `;

        //chạy từ thứ 2 -> thứ cuối cùng của tháng trước.
        content += `<tr>`;
        let count = dayOfTheFirst - 1;
        if (dayOfTheFirst != 6 && dayOfTheFirst != 0) {
            for (let i = 0, numberOfLastMonth = this.findNumberOfMonth(today.getMonth()); i < count; i++) {
                content += `<td style="color:#d0d0fc">${numberOfLastMonth - count + i + 1}</td>`
            }
        }

        count = dayOfTheFirst;
        for (let i = startDate; i <= this.findNumberOfMonth(); count++, i++) {
            if (count == 7) {
                count = 0;
                content += `</tr><tr>`;
            } else if (count == 6 || count == 0) {
                continue;
            } else {
                let dayString = i + "." + (currentMonth+1) + "." + currentYear;
                content += `<td data-date=${dayString} onclick="addTaskCalenderDate(this, this.getAttribute('data-date'));" class="calender__date`;
                if (i == today.getDate() && currentMonth == today.getMonth() && currentYear == today.getFullYear()) {
                    content += ` calender__today `;
                }

                let item = this.findTaskByDate(dayString);
                if(item!=undefined){
                    content+=` calender__task" draggable='true' ondragstart="drag(event)" data-letter='c' data-category="${item.category}">${i}
                             <div class="calender__task__content">${item.title}</div>
                        `;
                }else{
                    content+=`" ondrop="dropEditDate(event, this)" ondragover="allowDrop(event)">${i}`;
                }

                content+=`</td>\n`;
            }
        }

        for (let i = 1; count < 7; i++, count++) {
            if (count == 0 || count == 1 || count == 6 || count == 7) {
                break;
            } else {
                content += `<td style="color:#d0d0fc">${i}</td>`;
            }
        }

        content += `</tr></table>`;
        document.getElementById("calender__display").innerHTML = content;

        document.getElementById("calender__currentMoth__month").innerHTML = months[today.getMonth()];
        document.getElementById("calender__currentMoth__year").innerHTML = today.getFullYear();
    }

}
