let total_sales_value="";
let total_promotions_value="";
let sales_tax1="";
let sales_tax2="";
let liquor_tax_1="";
let depositListenersAttached = false;
let financialformsubmit = true;

document.addEventListener("DOMContentLoaded", function () {
    // Tab navigation functionality
    init_tabs();
    enable_all_forms_and_hover(false);

    const activityTabs = document.querySelectorAll('#Activity_forms button');
    const formSections = document.querySelectorAll('.form-section');
    const currentDateInput = document.getElementById('activity_date');
    const formbuttons = document.querySelectorAll("#Activity_forms button");
    
    const today = new Date().toISOString().split('T')[0];
    currentDateInput.value = today;

    document.getElementById('sales-form').style.display = 'block';

    document.getElementById('Sales_button').addEventListener('click', function () {
        document.getElementById('sales-form').style.display = 'block';
        document.getElementById('promotions-form').style.display = 'none';
        document.getElementById('financial-form').style.display = 'none';
        document.getElementById('purchases-form').style.display = 'none';
        document.getElementById('paid-out-form').style.display = 'none';
    });

    const {salesInputs, promotionsInputs, depositInputs, financialInputs, paidOutInputs } = extractInputsByCategory();
    attachInputListeners(salesInputs, "sales_total");
    attachInputListeners(promotionsInputs, "promotion_total");
    attachInputListeners(financialInputs, "financial_total"); // Correct totalId
    attachInputListeners(paidOutInputs, "paid_out_total");
    

    document.getElementById('sales-form').addEventListener("submit", function (event) {
        submitForm(event, "sales");
    });

    document.getElementById('promotions-form').addEventListener("submit", function (event) {
        submitForm(event, "Promotion");
    });

    document.getElementById('financial-form').addEventListener("submit", function (event) {
        submitForm(event, "financial");
    });

    document.getElementById('purchases-form').addEventListener("submit", function (event) {
        submitForm(event, "Purchase");
    });

    document.getElementById('paid-out-form').addEventListener("submit", function (event) {
        submitForm(event, "paid-out");
    });

    document.getElementById('Sales_button').addEventListener('click',toggle_form);
    document.getElementById('Promotions_button').addEventListener('click',toggle_form);
    document.getElementById('Financial_button').addEventListener('click', toggle_form);
    document.getElementById('Purchases_button').addEventListener('click', toggle_form);
    document.getElementById('Paid_out_button').addEventListener('click', toggle_form);
});

async function submitForm(event, formName) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("form_name", formName); // Append the form name

    try {
        const submitResponse = await fetch('/site_panel/Insert_new_activity_data/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
            },
            body: formData,
        });

        const result = await submitResponse.json();

        if (result.success) {
            console.log(result); // Inspect the result object
            alert(result.message);
            if (result.form_name == "sales") {
                console.log(result.data.sales_backend_total);
                enable_all_forms_and_hover(true);
                document.getElementById("activity_date").value = result.data.activity_date;
                document.getElementById("food_sales").value = result.data.food_sales;
                document.getElementById("liquor_sales").value = result.data.liquor_sales;
                document.getElementById("beer_sales").value = result.data.beer_sales;
                document.getElementById("wine_sales").value = result.data.wine_sales;
                document.getElementById("beverages_iced_beverages_sales").value = result.data.beverages_iced_beverages_sales;
                document.getElementById("draft_sales").value = result.data.draft_sales;
                document.getElementById("honest_to_goodness_fees_sales").value = result.data.honest_to_goodness_fees_sales;
                document.getElementById("miscellaneous_income_sales").value = result.data.miscellaneous_income_sales;
                document.getElementById("sales_total").value = result.data.sales_backend_total;
                document.getElementById("sales_tax1").value = result.data.sales_tax1;
                document.getElementById("sales_tax2").value = result.data.sales_tax2;
                document.getElementById("liquor_tax_1").value = result.data.liquor_tax_1;
                document.getElementById("customer_count").value = result.data.customer_count;
                document.getElementById("notes").value = result.data.sales_notes;
                total_sales_value = result.data.sales_backend_total;
                sales_tax1 = result.data.sales_tax1;
                sales_tax2 = result.data.sales_tax2;
                liquor_tax_1 = result.data.liquor_tax_1;
                console.log(sales_tax1);
                console.log(sales_tax2);
                console.log(liquor_tax_1);
            }
            if (result.form_name == "Promotion"){
                console.log(result.data.promotion_total);
                document.getElementById("promotions_staff_meals").value = result.data.staff_meals;
                document.getElementById("promotion_manager_meals").value = result.data.manager_meals;
                document.getElementById("promotion_coupons_disc").value = result.data.coupons_disc;
                document.getElementById("promotion_chucks_bucks").value = result.data.chucks_bucks;
                document.getElementById("promotion_manager_prom").value = result.data.manager_prom;
                document.getElementById("promotion_qsa_complaints").value = result.data.qsa_complaints;
                document.getElementById("promotion_lsm_1").value = result.data.lsm_1;
                document.getElementById("promotions_lsm_2").value = result.data.lsm_2;
                document.getElementById("promotion_total").value = result.data.promotion_total;
                total_promotions_value = result.data.promotion_total;
                console.log(total_promotions_value);
            }
            if (result.form_name == "financial"){
                console.log(result.data.promotion_total);
                document.getElementById("financial_gift_card_purchased").value = result.data.gift_card_purchased;
                document.getElementById("financial_gift_card_redeemed").value = result.data.gift_card_redeemed;
                document.getElementById("financial_skip_the_dishes").value = result.data.skip_the_dishes;
                document.getElementById("financial_just_eat").value = result.data.just_eat;
                document.getElementById("financial_amex").value = result.data.amex;
                document.getElementById("financial_din_club").value = result.data.din_club;
                document.getElementById("financial_discover").value = result.data.discover;
                document.getElementById("financial_master_card").value = result.data.master_card;
                document.getElementById("financial_visa").value = result.data.visa;
                document.getElementById("financial_dr_card").value = result.data.dr_card;
                document.getElementById("financial_total").value = result.data.financial_total;
                document.getElementById("actual_deposit_amt").value = result.data.actual_deposit_amt;
                document.getElementById("required_deposit").value = result.data.required_deposit;
                financialformsubmit = false;
            }
            if (result.form_name == "paid-out"){
                document.getElementById("food_paid_out").value = result.data.food_paid_out;
                document.getElementById("liquor_paid_out").value = result.data.liquor_paid_out;
                document.getElementById("supplies_paid_out").value = result.data.supplies_paid_out;
                document.getElementById("repair_maintenance_paid_out").value = result.data.repair_maintenance;
                document.getElementById("advertising_paid_out").value = result.data.advertising;
                document.getElementById("entertainment_paid_out").value = result.data.entertainment;
                document.getElementById("others_paid_out").value = result.data.others;
                document.getElementById("hst_gst_paid_out").value = result.data.hst_gst;
                document.getElementById("paid_out_total").value = result.data.paid_out_total;
            }
        } else if (result.errors) {
            // Display errors below each field
            displayErrors(result.errors);
        } else {
        }
        // Enable all forms and buttons after the submission
    } catch (error) {
        console.error("Error submitting form data:", error);
    }
}

function displayErrors(errors) {
    Object.keys(errors).forEach(field => {
        let inputField = document.getElementById(field);
        if (inputField) {
            const errorElement = document.createElement("div");
            errorElement.className = "error-message";
            errorElement.style.color = "red";
            errorElement.style.fontSize = "12px";
            errorElement.textContent = errors[field];

            // Remove existing error message if present
            let existingError = inputField.parentElement.querySelector(".error-message");
            if (existingError) {
                existingError.remove();
            }

            inputField.parentElement.appendChild(errorElement);

            // Remove error after 20 seconds (changed from 30)
            setTimeout(() => {
                if (errorElement) {
                    errorElement.remove();
                }
            }, 20000); // Changed to 20 seconds (20000 milliseconds)
        } else {
            showGeneralError(errors[field]); // Show general error
        }
    });
}

function showGeneralError(message) {
    const errorElement = document.getElementById("general-error");
    errorElement.innerText = message;
    
    // Also hide general error after 20 seconds
    setTimeout(() => {
        errorElement.innerText = "";
    }, 20000); // 20 seconds
}

function updateTotal(value, totalId) {  // Pass the value directly
    let total = parseFloat(document.getElementById(totalId)?.value) || 0;
    total += value;  // Add the provided value
    document.getElementById(totalId).value = total.toFixed(2);
}

function diffTotal(value, totalId) {  // Pass the value directly
    let total = parseFloat(document.getElementById(totalId)?.value) || 0;
    total -= value;  // Add the provided value
    document.getElementById(totalId).value = total.toFixed(2);
}

function init_tabs() {
    const activityTab = document.getElementById("activity-tab");
    const reportsTab = document.getElementById("reports-tab");
    const activitySubTabs = document.getElementById("activity-sub-tabs");
    const reportsSubTabs = document.getElementById("reports-sub-tabs");

    const dailyReportTab = document.getElementById("Daily-Reports");
    const dailyReportSubTabs = document.getElementById("dailyReport-sub-tabs");
    const weeklyReportTab = document.getElementById("Weekly-Reports");
    const weeklyReportSubTabs = document.getElementById("weeklyReport-sub-tabs");
    const biweeklyReportTab = document.getElementById("Biweekly-Reports");
    const biweeklyReportSubTabs = document.getElementById("BiweeklyReport-sub-tabs");
    const monthlyReportTab = document.getElementById("Monthly-Reports");
    const monthlyReportSubTabs = document.getElementById("Monthly-rollover-sub-tabs");
    const SpecificRangeReportsTab = document.getElementById("Specific-Range-Reports");
    const SummarySubTab = document.getElementById("Summary-sub-tabs");
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            // If already active, remove it
            if (this.classList.contains("active")) {
                this.classList.remove("active");
            } else {
                // Remove active from all and set on current
                navLinks.forEach(l => l.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    activityTab.addEventListener("click", function () {
        reportsSubTabs.style.display = "none";
        activitySubTabs.style.display = activitySubTabs.style.display === "block" ? "none" : "block";
    });

    if (reportsTab) {
        reportsTab.addEventListener("click", function () {
            activitySubTabs.style.display = "none";
            reportsSubTabs.style.display = reportsSubTabs.style.display === "block" ? "none" : "block";
        });
    }

    // Function to handle hover and keep sub-tabs visible
    function handleHover(mainTab, subTab) {
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

    handleHover(dailyReportTab, dailyReportSubTabs);
    handleHover(weeklyReportTab, weeklyReportSubTabs);
    handleHover(biweeklyReportTab, biweeklyReportSubTabs);
    handleHover(monthlyReportTab, monthlyReportSubTabs);
    handleHover(SpecificRangeReportsTab, SummarySubTab);
}

function enable_all_forms_and_hover(enable) {
    const buttonIds = ['Promotions_button', 'Financial_button', 'Purchases_button', 'Paid_out_button'];
    const formIds = ['promotions-form', 'financial-form', 'purchases-form', 'paid-out-form'];
    
    // Enable/Disable hover on buttons
    buttonIds.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (enable) {
            button.classList.remove('disabled'); // Enable hover
        } else {
            button.classList.add('disabled'); // Disable hover
        }
    });

}

function toggle_form(event) {
    const targetFormId = event.target.getAttribute('data-target');

    document.querySelectorAll('.form-section').forEach(form => form.style.display = 'none');

    const targetForm = document.getElementById(targetFormId);
    targetForm.style.display = 'block';

    const { salesInputs, promotionsInputs, depositInputs, financialInputs, paidOutInputs } = extractInputsByCategory();

    if (financialformsubmit){
        if (targetFormId === 'financial-form') {
            const requiredDeposit = total_sales_value - total_promotions_value + sales_tax1 + sales_tax2 + liquor_tax_1;
            console.log(requiredDeposit);
            document.getElementById('required_deposit').value = requiredDeposit;
    
    
            if (!depositListenersAttached) { // Attach listeners only once
                attachdepositListeners(depositInputs, "required_deposit");
                depositListenersAttached = true; // Set the flag
            }
        }
    }
}

function extractInputsByCategory() {
    const inputs = document.querySelectorAll("[id]"); // Get all elements with an ID
    let salesInputs = [], promotionsInputs = [], depositInputs=[], financialInputs = [], paidOutInputs = [];

    const commonFields = [
        'financial_skip_the_dishes', 'financial_just_eat', 'financial_amex', 'financial_din_club', 'financial_discover', 'financial_master_card', 'financial_visa', 'financial_dr_card'// Add other common fields as needed
    ];

    inputs.forEach(input => {
        const id = input.id.toLowerCase();
        if (commonFields.includes(id)) {
            depositInputs.push(input.id);  // Add to deposit category
            financialInputs.push(input.id); // Add to financial category
        } else if (id.includes("sales") && id.match(/food|liquor|beer|wine|beverages|draft|fees|income/)) {
            salesInputs.push(input.id);
        } else if (id.includes("promotion") && id.match(/meals|bucks|coupons|manager_prom|qsa|lsm/)) {
            promotionsInputs.push(input.id);
        }else if (id.includes("financial") && id.match(/gift|dishes|eat|amex|din|visa|discover|dr|master/)) {
            depositInputs.push(input.id); 
        }else if (id.includes("financial") && id.match(/dishes|eat|amex|din|visa|discover|dr|master/)) {
            financialInputs.push(input.id);
        } else if (id.includes("paid_out") && id.match(/food|liquor|supplies|maintenance|advertising|entertainment|others|gst/)) {
            paidOutInputs.push(input.id);
        }
    });

    return { salesInputs, promotionsInputs, depositInputs, financialInputs, paidOutInputs };
}

function showFormAndCalculate(formId, inputArray, totalId) {
    // Attach real-time listeners for input fields
    attachInputListeners(inputArray, totalId);

    // Calculate the total once the form is shown
    calculateTotalForForm(inputArray, totalId);
}

function attachInputListeners(inputArray, totalId) {
    inputArray.forEach(id => {
        const inputElement = document.getElementById(id);
        let originalValue = parseFloat(inputElement.value) || 0; // Store initial value

        
        inputElement.addEventListener("blur", function (event) {
                const currentValue = parseFloat(event.target.value) || 0;
    
                if (currentValue !== originalValue) { // Check if value has changed
                    const difference = currentValue - originalValue; // Calculate the difference
                    updateTotal(difference, totalId); // Update with the difference
                    originalValue = currentValue; // Update original value
                }
            });
    });
}

function attachdepositListeners(inputArray, totalId) {
    inputArray.forEach(id => {
        const inputElement = document.getElementById(id);
        if (!inputElement) return;

        let originalValue = parseFloat(inputElement.value) || 0;

        inputElement.addEventListener("blur", function (event) {
            const currentValue = parseFloat(event.target.value) || 0;

            if (currentValue !== originalValue) {
                const difference = currentValue - originalValue;
                let total = parseFloat(document.getElementById(totalId)?.value) || 0;
                console.log(id);
                if (id === "financial_gift_card_purchased") {
                    console.log("Adding for:", id);
                    total += difference; // Add for gift card purchase
                } else {
                    console.log("Subtracting for:", id);
                    total -= difference; // Subtract for other inputs
                }

                document.getElementById(totalId).value = total.toFixed(2);
                originalValue = currentValue;
            }
        });
    });
} 