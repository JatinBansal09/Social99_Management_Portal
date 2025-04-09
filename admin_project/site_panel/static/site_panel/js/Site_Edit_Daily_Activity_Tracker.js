let depositListenersAttached = false;
let salesformModified = false;
let promotionsformModified = false;

document.addEventListener("DOMContentLoaded", function () {
    // Tab navigation functionality
    init_tabs();
    const formbuttons = document.querySelectorAll("#Activity_forms button");

    formbuttons.forEach(function (link) {
        link.addEventListener("click", function () {
            // If this link is already active, toggle it off
            if (this.classList.contains("active")) {
                this.classList.remove("active");
            } else {
                // Remove active class from all other nav links
                formbuttons.forEach(function (nav) {
                    nav.classList.remove("active");
                });
                // Add active class to the clicked link
                this.classList.add("active");
            }
        });
    });

    document.getElementById('sales-form').style.display = 'block';

    const {salesInputs, promotionsInputs, depositInputs, financialInputs, paidOutInputs } = extractInputsByCategory();
    document.getElementById('Sales_button').addEventListener('click',toggle_form);
    attachInputListeners(salesInputs, "sales_total");
    document.getElementById('Promotions_button').addEventListener('click',toggle_form);
    attachInputListeners(promotionsInputs, "promotion_total");
    document.getElementById('Financial_button').addEventListener('click', toggle_form);
    attachInputListeners(financialInputs, "financial_total"); // Correct totalId
    document.getElementById('Purchases_button').addEventListener('click', toggle_form);
    document.getElementById('Paid_out_button').addEventListener('click', toggle_form);
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

});

async function submitForm(event, formName) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("form_name", formName); // Append the form name

    if (formName == 'financial') {
        const sales_backend_total = document.getElementById("sales_total").value || 0;
        const sales_tax1 = document.getElementById("sales_tax1").value || 0;
        const sales_tax2 = document.getElementById("sales_tax2").value || 0;
        const liquor_tax_1 = document.getElementById("liquor_tax_1").value || 0;
        const promotion_total = document.getElementById("promotion_total").value || 0;
    
        // Append values to formData
        formData.append("sales_total", sales_backend_total);
        formData.append("sales_tax1", sales_tax1);
        formData.append("sales_tax2", sales_tax2);
        formData.append("liquor_tax_1", liquor_tax_1);
        formData.append("promotion_total", promotion_total);
    }

    try {
        const submitResponse = await fetch('/site_panel/site_update_activity_data/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,  // CSRF token
            },
            body: formData,
        });

        const result = await submitResponse.json();

        if (result.success) {
            alert(result.message);
            if (result.form_name == "sales") {
                console.log(result.data.sales_backend_total);
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
            alert(result.message);
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

function toggle_form(event) {
    const targetFormId = event.target.getAttribute('data-target');

    // Hide all forms
    document.querySelectorAll('.form-section').forEach(form => form.style.display = 'none');

    // Show the target form
    const targetForm = document.getElementById(targetFormId);
    targetForm.style.display = 'block';

    // Extract inputs by category
    const { salesInputs, promotionsInputs, depositInputs, financialInputs, paidOutInputs } = extractInputsByCategory();

    // If the target form is the financial form, update the required deposit field
    if (targetFormId === 'financial-form') {
        const requiredDepositField = document.getElementById('required_deposit');

        // Get the latest values from the sales and promotions forms
        const totalSalesValue = parseFloat(document.getElementById("sales_total").value) || 0;
        const salesTax1 = parseFloat(document.getElementById("sales_tax1").value) || 0;
        const salesTax2 = parseFloat(document.getElementById("sales_tax2").value) || 0;
        const liquorTax1 = parseFloat(document.getElementById("liquor_tax_1").value) || 0;
        const totalPromotionsValue = parseFloat(document.getElementById("promotion_total").value) || 0;
        let giftCardpurchased = parseFloat(document.getElementById("financial_gift_card_purchased").value) || 0;
        let giftCardRedeemed = parseFloat(document.getElementById("financial_gift_card_redeemed").value) || 0;
        let SkiptheDishes = parseFloat(document.getElementById("financial_skip_the_dishes").value) || 0;
        let JustEat = parseFloat(document.getElementById("financial_just_eat").value) || 0;
        let Amex = parseFloat(document.getElementById("financial_amex").value) || 0;
        let Din_Club = parseFloat(document.getElementById("financial_din_club").value) || 0;
        let Discover = parseFloat(document.getElementById("financial_discover").value) || 0;
        let MasterCard = parseFloat(document.getElementById("financial_master_card").value) || 0;
        let Visa = parseFloat(document.getElementById("financial_visa").value) || 0;
        let DrCard = parseFloat(document.getElementById("financial_dr_card").value) || 0;

        // Calculate the required deposit value
        const requiredDepositValue = totalSalesValue - totalPromotionsValue + salesTax1 + salesTax2 + liquorTax1 + giftCardpurchased - (giftCardRedeemed + SkiptheDishes + JustEat + Amex + Din_Club + Discover + MasterCard + Visa + DrCard);

        // Update the required deposit field
        requiredDepositField.value = requiredDepositValue;

        // Attach deposit listeners if not already attached
        if (!depositListenersAttached) {
            attachdepositListeners(depositInputs, "required_deposit");
            depositListenersAttached = true; // Set the flag
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