document.addEventListener('DOMContentLoaded', function () {
        const weekEndDateInput = document.getElementById('week-end-date');
        const dayHeaders = document.querySelectorAll('table thead tr th:nth-child(-n+10):not(:first-child):not(:nth-child(2)):not(:nth-child(3))');
        const positionView = document.getElementById('position-view');
        const employeeView = document.getElementById('employee-view');
        let selectedDate;
        init_tabs();

        if (weekEndDateInput) {
            
            weekEndDateInput.setAttribute("readonly", "true");

            const picker = new Pikaday({
                field: weekEndDateInput,
                format: "YYYY-MM-DD",
                disableDayFn: function (date) {
                    return date.getDay() !== 0; // Disable all days except Sunday
                },
                onSelect: function (date) {
                    selectedDate = date; // Store selected date
                    weekEndDateInput.value = moment(date).format("YYYY-MM-DD"); // Format date
                    updateDateHeadersAndData();
                }
            });
    
            // Prevent default browser calendar from opening
            weekEndDateInput.addEventListener("focus", function (event) {
                event.preventDefault();
            });
        }

        function updateView() {
            if(siteLocation === "all"){
                fetchPayrollData()
                .then(() => {
                    const positionView = document.getElementById('position-view');
                    const employeeView = document.getElementById('employee-view');
                    if (employeeView.checked) {
                        swapColumns_Employee();
                    } else if (positionView.checked) {
                        groupByPositionType();
                    }
                })
                .catch(error => console.error("Error fetching payroll data:", error));
            }
            else{
                if (employeeView.checked) {
                    swapColumns_Employee();
                } else if (positionView.checked) {
                    groupByPositionType();
                }
            }  
        }
    
        document.getElementById('save-payroll').addEventListener('click', function(event) {

            event.preventDefault();

            let formData = new FormData();
            // Get the week start date (Monday) and week end date (Sunday)

            let weekEndDate = document.getElementById('week-end-date').value;

            let weekStartDate = new Date(weekEndDate);
            weekStartDate.setDate(weekStartDate.getDate() - 6); // Move back to Monday

            formData.append("week_start_date", weekStartDate.toISOString().split("T")[0]); // YYYY-MM-DD format
            formData.append("week_end_date", weekEndDate);
            // Select all rows inside the payroll table

            document.querySelectorAll("#payroll_table tbody tr").forEach((row, index) => {
                let payrollEmpInput = row.querySelector("#payroll_emp_id");
    
                let payrollCompInput = row.querySelector("#payroll_comp_id");
    
                let notes = row.querySelector("#notes");
    
                if (!payrollEmpInput || !payrollCompInput) {
    
                    console.error(`Missing input fields in row ${index}`);
    
                    return; // Skip this row to avoid errors
    
                }

                let payrollEmpId = payrollEmpInput.value;
                let payrollCompId = payrollCompInput.value;
                let note = notes.value;
    
                formData.append(`payroll[${index}][payroll_emp_id]`, payrollEmpId);
                formData.append(`payroll[${index}][payroll_comp_id]`, payrollCompId);
                formData.append(`payroll[${index}][notes]`, note);
                // Collect work hours for each day
                let days = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];
                let currentDate = new Date(weekStartDate);

                days.forEach((day, dayIndex) => {
    
                    let inputField = row.querySelector(`input[id='${day}']`);
                    let dateKey = `payroll[${index}][daily_hours][${dayIndex}][date]`;
                    let hoursKey = `payroll[${index}][daily_hours][${dayIndex}][hours_worked]`;

                    if (inputField) {
                        formData.append(dateKey, currentDate.toISOString().split("T")[0]);
    
                        formData.append(hoursKey, inputField.value || 0);
                    }
                    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
                });
            });
    // Send data to backend
    
            fetch("/site_panel/save_site_payroll/", {
    
                method: "POST",
    
                headers: { "X-CSRFToken": getCSRFToken() },
    
                body: formData
    
            })
            .then(response => response.text()) // Get raw response
    .then(text => {
        console.log("Raw Response:", text);
        try {
            let data = JSON.parse(text); // Try parsing as JSON

            if (data.status === "error") {
                alert(`Error: ${data.message}`); // Show the error message from Django
                console.error("Server Error:", data.message);
            } else {
                alert("Payroll saved successfully!");
                console.log(data);
            }
        } catch (error) {
            console.error("Parsing Error:", text); // Log full response in case of unexpected errors
            alert("Unexpected server response. Check console for details.");
        }
    })
    .catch(error => {
        console.error("Network Error:", error);
        alert("Network issue. Try again later.");
    });
    
        });

        // Event listeners (modified to use updateView)
        employeeView.addEventListener('click', function() {
            updateView();
        });

        positionView.addEventListener('click', function() {
            updateView();
        });
        
    
    // Function to get CSRF token from cookies
    
        function getCSRFToken() {
    
            let csrfToken = document.cookie.match(/csrftoken=([^ ;]+)/);
    
            return csrfToken ? csrfToken[1] : "";
    
        }
    
        
        const tableBody = document.querySelector('tbody');

        function updateDateHeadersAndData() {
            if (selectedDate) {
                const startDate = new Date(selectedDate);
                startDate.setDate(selectedDate.getDate() - 6);
        
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);
                    const formattedDate = formatDate(currentDate);
                    dayHeaders[i].innerHTML = getDayName(currentDate.getDay()) + ". <br>(" + formattedDate + ")";
                }
                updateHoursData(startDate, selectedDate);
                updateTableData(startDate, selectedDate);
            } else {
                resetTable();
            }
        }

        document.querySelectorAll('.hour-input').forEach(input => {
            input.addEventListener('input', function() {
                if (this.value > 24) {
                    this.value = 24; // Restrict value to 24
                    alert("Value cannot exceed 24 hours.");
                }
            });
        });
        
        function fetchPayrollData() {
            return new Promise((resolve, reject) => {
                let selectedLocation = document.getElementById("location-select").value;
                let encodedLocation = encodeURIComponent(selectedLocation); // Encode special characters
        
                fetch(`/site_panel/get-admin-payroll-data/?location=${encodedLocation}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        let tableBody = document.querySelector("#payroll_table tbody");
                        if (!tableBody) {
                            console.error("Error: Table body not found!");
                            reject("Table body not found");
                            return;
                        }
        
                        tableBody.innerHTML = ""; // Clear old data
        
                        if (data.length === 0) {
                            console.warn("Warning: No payroll data received.");
                            resolve(); // Resolve even if no data
                            return;
                        }
        
                        data.forEach(row => {
                            let tr = document.createElement("tr");
                            tr.innerHTML = `
                                <td>${row.Name}
                                    <input type="hidden" name="payroll_emp_id" value="${row.EmployeeID}">
                                    <input type="hidden" name="payroll_comp_id" value="${row.CompID}">
                                </td>
                                <td>${row.Position_Type}</td>
                                <td>${row.Position}</td>
                                <td><input type="number" class="hour-input" name="Mon" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name="Tues" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name="Weds" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name="Thurs" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name="Fri" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name="Sat" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name="Sun" value="0" min="0" max="24" step="0.01"></td>
                                <td><input type="number" class="hour-input" name='totals' value='0' readonly></td>
                                <td><input id="notes" type="text"></td>
                            `;
                            tableBody.appendChild(tr);
                        });
        
                        resolve();
                    })
                    .catch(error => {
                        console.error("Error fetching payroll data:", error);
                        reject(error);
                    });
            });
        }
        
                
        
        function updateHoursData(startDate, endDate) {
            let employees = [];
            document.querySelectorAll("#payroll_table tbody tr").forEach(row => {
                let empID = row.querySelector("input[name='payroll_emp_id']").value;
                employees.push({ empID, row });
            });
        
            if (employees.length === 0) {
                console.warn("No employees found in table.");
                return;
            }
        
            const requestBody = JSON.stringify({ employees });
            console.log("Sending request with data:", requestBody);
        
            fetch(`/site_panel/get_working_hours/?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken()  // Add CSRF token
                },
                body: JSON.stringify({ employees })
            })
            .then(response => {
                console.log("Response Status:", response.status);
                return response.json();
            })
            .then(data => {
                console.log("Received working hours:", data);
        
                let monday = new Date(endDate);
                monday.setDate(monday.getDate() + 1); // Monday of the selected week

                let today = new Date(); 
                // Reset time for clean date comparison
                monday.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                // Corrected condition
                monday.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                let isEditDisabled = false;

                // If Monday is in the past, disable edit
                if (data.superuser) {
                    isEditDisabled = false;
                } else {
                    // If Monday is in the past, disable edit
                    if (monday < today) {
                        isEditDisabled = true;
                    }
                    // If Monday is today AND it's past 2 PM, disable edit
                    else if (monday.getTime() === today.getTime() && new Date().getHours() >= 14) {
                        isEditDisabled = true;
                    }
                }
                
                const saveButtonId = "save-payroll";
                const tabsContainer = document.querySelector('.tabs-container');
                let existingBtn = document.getElementById(saveButtonId);

                if (!isEditDisabled) {
                    tabsContainer.classList.remove('margin-adjusted');
                    if (!existingBtn) {
                        let saveBtn = document.createElement("button");
                        saveBtn.id = saveButtonId;
                        saveBtn.textContent = "Save Employee Payroll";

                        // Optional: Apply any classes/styles if needed
                        saveBtn.classList.add("save-payroll-btn");

                        document.querySelector(".tabs-container").appendChild(saveBtn);
                    }
                } else {
                    tabsContainer.classList.add('margin-adjusted');
                    if (existingBtn) {
                        existingBtn.remove();
                    }
                }

                console.log("Monday:", monday.toISOString());
                console.log("Today:", today.toISOString());
                console.log("Is Edit Disabled:", isEditDisabled);
        
                employees.forEach(({ empID, row }) => {
                    let empData = data[empID];
                    if (empData && row) {
                        ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"].forEach(day => {
                            let inputField = row.querySelector(`[name='${day}']`);
                            if (inputField) {
                                inputField.value = empData[day] || 0;
        
                                // Disable input if the condition is met
                                inputField.disabled = isEditDisabled;
                            } else {
                                console.warn(`Missing input field for ${day} in row for empID ${empID}`);
                            }
                        });
        
                        let totalField = row.querySelector("[name='totals']");
                        if (totalField) {
                            totalField.value = Object.values(empData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2);
                        }
                    } else {
                        console.warn(`No row found for empID: ${empID}`);
                    }
                });
            })
            .catch(error => console.error("Error fetching working hours:", error));
        }
        
        
        
        function groupByPositionType() {
    
            const rows = Array.from(tableBody.querySelectorAll('tr')); // Get all rows
            let previousCell = null; // Stores the last Position-Type cell
            let rowSpanCount = 1; // Tracks how many rows to merge
            swapColumns();
    
            for (let i = 0; i < rows.length; i++) {
    
                let currentRow = rows[i];
    
                let currentCell = currentRow.children[0]; // Position-Type cell (1st column after swap)
    
                if (previousCell && currentCell.innerText.trim() === previousCell.innerText.trim()) {
    
                    // If current row has same Position-Type as previous row
    
                    rowSpanCount++;
    
                    previousCell.rowSpan = rowSpanCount; // Expand the previous cell
    
                    currentCell.remove(); // Remove the current cell (since it's merged)
    
                } else {
    
                    // If different, reset rowSpanCount and store new previousCell
    
                    rowSpanCount = 1;
    
                    previousCell = currentCell;
    
                }
    
            }
            // Reorder columns if necessary
    
        }
    
        function resetTable() {
    
            location.reload();
    
        }
    
        function swapColumns() {
    
            const table = document.querySelector('table');
    
            const rows = Array.from(table.querySelectorAll('tr'));
    
            const headerRow = table.querySelector('thead tr');
    
            const positionTypeHeader = Array.from(headerRow.children).find(th => th.textContent.trim() === 'Position Type');
    
    
    
            const positionTypeIndex = Array.from(headerRow.children).indexOf(positionTypeHeader);
    
    
    
            if (positionView.checked && positionTypeIndex !== 0) {
    
                rows.forEach(row => {
    
                    const positionTypeCell = row.children[positionTypeIndex];
    
                    row.insertBefore(positionTypeCell, row.children[0]);
    
                });
    
    
    
                headerRow.insertBefore(positionTypeHeader, headerRow.children[0]);
    
            }
    
        }
    
        function swapColumns_Employee() {
                const table = document.querySelector('table');
                const rows = Array.from(table.querySelectorAll('tbody tr')); // Select ONLY tbody rows
                const headerRow = table.querySelector('thead tr');
                let positionTypeHeader, employeeNameHeader;
                Array.from(headerRow.children).forEach(th => {
    
                    const text = th.textContent.trim().toLowerCase();
    
                    if (text === 'position type') {
    
                        positionTypeHeader = th;
    
                    } else if (text === 'name') {
    
                        employeeNameHeader = th;
    
                    }
    
                });
                if (!positionTypeHeader || !employeeNameHeader) {
    
                    console.error('Required headers not found');
    
                    return;
    
                }
                const positionTypeIndex = Array.from(headerRow.children).indexOf(positionTypeHeader);
    
                const employeeNameIndex = Array.from(headerRow.children).indexOf(employeeNameHeader);

                if (employeeNameIndex === -1 || positionTypeIndex === -1) {
    
                    console.error('Column indexes are invalid');
    
                    return;
    
                }
    
           
    
                // 1. Break Rowspan and Add Missing Cells:
    
                rows.forEach(row => {
    
                    const cells = Array.from(row.children);
    
                    let currentPositionTypeCell = null;
    
           
    
                    for (let i = 0; i < cells.length; i++) {
    
                        const cell = cells[i];
    
           
    
                        if (i === positionTypeIndex) {
    
                            currentPositionTypeCell = cell;
    
                            break; // Found the cell, exit the inner loop
                        }
                    }

                    if (currentPositionTypeCell && currentPositionTypeCell.rowSpan > 1) {
    
                        const rowspanValue = currentPositionTypeCell.rowSpan;
    
                        currentPositionTypeCell.rowSpan = 1; // Reset rowspan
    
                        for (let j = 1; j < rowspanValue; j++) {
    
                            const newRow = rows[rows.indexOf(row) + j]; // Get the spanned rows
    
                            if (newRow) { // Check if newRow exists (important!)
    
                                const newCell = document.createElement('td');
    
                                newCell.textContent = currentPositionTypeCell.textContent; // Copy the text content
    
                                newRow.insertBefore(newCell, newRow.children[positionTypeIndex]); // Insert at correct index
    
                            }
    
                        }
    
                    } else if (!currentPositionTypeCell) {
    
                        // If the cell is completely missing, add it
    
                        const newCell = document.createElement('td');
    
                        row.insertBefore(newCell, row.children[positionTypeIndex]);
                    }
    
                });
    
                if (!(employeeView.checked && positionTypeIndex === 1)) {  // Swap ONLY if the condition is NOT met
    
                    // 2. Swap Headers:
    
                headerRow.insertBefore(employeeNameHeader, headerRow.children[0]);
    
                headerRow.insertBefore(positionTypeHeader, headerRow.children[1]);
    
                    rows.forEach(row => {
    
                        const cells = Array.from(row.children);
    
                        const positionTypeCell = cells[1]; // After header swap, PositionType is at index 1
    
                        const employeeNameCell = cells[0]; // After header swap, EmployeeName is at index 0
    
           
    
                        if (employeeNameCell && positionTypeCell) {
    
                            row.insertBefore(positionTypeCell, employeeNameCell);
    
                        }
    
                    });
    
                }
    
            }
    
        function formatDate(date) {
    
            const year = date.getFullYear();
    
            const month = String(date.getMonth() + 1).padStart(2, '0');
    
            const day = String(date.getDate()).padStart(2, '0');
    
            return `${year}-${month}-${day}`;
    
        }
    
        function getDayName(dayIndex) {
    
            const days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    
            return days[dayIndex];
    
        }
    
        function updateTableData(startDate) {
    
            console.log("Updating table data for week:", startDate);
    
        }
    
        function updateTotals(row) {
    
            let sum = 0;
    
            const inputCells = row.querySelectorAll("td input[type='number']");
    
    
    
            // Loop through all input fields except the last column (Totals)
    
            for (let i = 0; i < inputCells.length; i++) {
    
                sum += Number(inputCells[i].value) || 0; // Convert value to number (default to 0 if empty)
    
            }
            // Update the "Totals" column (last column before Notes)
            const totalCell = row.querySelector("td:nth-last-child(2)");
            totalCell.textContent = sum; // Display sum
        }
    
        // Add event listeners to all number input fields 
        tableBody.addEventListener("input", function (event) {
    
            if (event.target.matches("td input[type='number']")) {
    
                const row = event.target.closest("tr"); // Get the parent row

                updateTotals(row); // Recalculate totals
    
            }
    
        });
        // Initialize totals on page load (in case of prefilled data)
        document.querySelectorAll("tbody tr").forEach(updateTotals);
    
    });

    

    function init_tabs() {
        const activityTab = document.getElementById("activity-tab");
        const reportsTab = document.getElementById("reports-tab");
        const activitySubTabs = document.getElementById("activity-sub-tabs");
        const reportsSubTabs = document.getElementById("reports-sub-tabs");
        
        // Only initialize if elements exist
        if (activityTab && activitySubTabs) {
            activityTab.addEventListener("click", function () {
                reportsSubTabs.style.display = "none";
                activitySubTabs.style.display = activitySubTabs.style.display === "block" ? "none" : "block";
            });
        }
    
        if (reportsTab && reportsSubTabs) {
            reportsTab.addEventListener("click", function () {
                if (activitySubTabs) activitySubTabs.style.display = "none";
                reportsSubTabs.style.display = reportsSubTabs.style.display === "block" ? "none" : "block";
            });
        }
    
        // Initialize hover functionality only for elements that exist
        const dailyReportTab = document.getElementById("Daily-Reports");
        const dailyReportSubTabs = document.getElementById("dailyReport-sub-tabs");
        if (dailyReportTab && dailyReportSubTabs) {
            handleHover(dailyReportTab, dailyReportSubTabs);
        }
    
        const weeklyReportTab = document.getElementById("Weekly-Reports");
        const weeklyReportSubTabs = document.getElementById("weeklyReport-sub-tabs");
        if (weeklyReportTab && weeklyReportSubTabs) {
            handleHover(weeklyReportTab, weeklyReportSubTabs);
        }
    
        const biweeklyReportTab = document.getElementById("Biweekly-Reports");
        const biweeklyReportSubTabs = document.getElementById("BiweeklyReport-sub-tabs");
        if (biweeklyReportTab && biweeklyReportSubTabs) {
            handleHover(biweeklyReportTab, biweeklyReportSubTabs);
        }
    
        const monthlyReportTab = document.getElementById("Monthly-Reports");
        const monthlyReportSubTabs = document.getElementById("Monthly-rollover-sub-tabs");
        if (monthlyReportTab && monthlyReportSubTabs) {
            handleHover(monthlyReportTab, monthlyReportSubTabs);
        }
    
        const SpecificRangeReportsTab = document.getElementById("Specific-Range-Reports");
        const SummarySubTab = document.getElementById("Summary-sub-tabs");
        if (SpecificRangeReportsTab && SummarySubTab) {
            handleHover(SpecificRangeReportsTab, SummarySubTab);
        }
    }
    
    function handleHover(mainTab, subTab) {
        if (!mainTab || !subTab) return;
    
        let timeout;
    
        function showSubTab() {
            clearTimeout(timeout);
            subTab.style.display = "block";
        }
    
        function hideSubTab() {
            timeout = setTimeout(() => {
                subTab.style.display = "none";
            }, 0); // Short delay to prevent flickering when moving between elements
        }
    
        mainTab.addEventListener("mouseenter", showSubTab);
        mainTab.addEventListener("mouseleave", hideSubTab);
    
        subTab.addEventListener("mouseenter", showSubTab);
        subTab.addEventListener("mouseleave", hideSubTab);
    }