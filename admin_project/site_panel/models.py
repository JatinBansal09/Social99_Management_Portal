from django.db import models
from django.contrib.auth.models import User
from django.contrib.sessions.models import AbstractBaseSession

class UserSession(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="session_info")
    session_key = models.CharField(max_length=40, blank=True, null=True)
    browser_identifier = models.CharField(max_length=255, blank=True, null=True)  # Added

    def __str__(self):
        return f"{self.user.username} - {self.session_key} - {self.browser_identifier}"

class ActivitySales(models.Model):
    sales_id = models.AutoField(primary_key=True)
    site_id = models.IntegerField()  # Foreign key, can be linked later if needed
    activity_date = models.DateField()
    food = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    liquor = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    beer = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    wine = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    beverages_iced_beverages = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    draft = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    honest_to_goodness_fees = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    miscellaneous_income = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    sales_total = models.DecimalField(max_digits=40, decimal_places=2)
    sales_tax1 = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    sales_tax2 = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    liquor_tax_1 = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    customer_count = models.IntegerField()  # Keeping as Integer
    sales_notes = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activity_sales'

class ActivityPromotions(models.Model):
    promotions_id = models.AutoField(primary_key=True)
    activity_date = models.DateField()
    site_id = models.IntegerField()  # Foreign key, can be linked later if needed
    staff_meals = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    manager_meals = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    coupons_disc = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    chucks_bucks = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    manager_prom = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    qsa_complaints = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    lsm_1 = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    lsm_2 = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    promotion_total = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activity_promotions'

class ActivityFinancial(models.Model):
    financial_id = models.AutoField(primary_key=True)
    site_id = models.IntegerField()  # Foreign key, can be linked later if needed
    activity_date = models.DateField()
    gift_card_purchased = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    gift_card_redeemed = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    skip_the_dishes = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    just_eat = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    amex = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    din_club = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    discover = models.DecimalField(max_digits=30, decimal_places=2)
    master_card = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    visa = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    dr_card = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    financial_total = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    actual_deposit_amt = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    required_deposit = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activity_financial'

class ActivityPurchase(models.Model):
    purchase_id = models.AutoField(primary_key=True)
    site_id = models.IntegerField()  # Foreign key, can be linked later if needed
    activity_date = models.DateField()
    purchases_food = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    purchases_paper = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    purchases_liquor = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activity_purchase'

class ActivityPaidOut(models.Model):
    paid_out_id = models.AutoField(primary_key=True)
    activity_date = models.DateField()
    site_id = models.IntegerField()  # Foreign key, can be linked later if needed
    food_paid_out = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    liquor_paid_out = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    supplies_paid_out = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    repair_maintenance = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    advertising = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    entertainment = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    others = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    hst_gst = models.DecimalField(max_digits=30, decimal_places=2, default=0.00)
    paid_out_total = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activity_paid_out'

class employee(models.Model):
    e_id = models.AutoField(primary_key=True)  # Employee ID (Auto-increment)
    s_id = models.IntegerField()  # Foreign key to Site
    location = models.CharField(max_length=255)
    owner = models.CharField(max_length=255, blank=True, null=True)
    employee_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    phone1 = models.CharField(max_length=15, blank=True, null=True)
    phone2 = models.CharField(max_length=15, blank=True, null=True)
    smart_serve = models.BigIntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Set on creation
    updated_at = models.DateTimeField(auto_now=True)  # Update on modification
    active_inactive = models.BooleanField(default=True)

    class Meta:
        db_table = 'employee'
        unique_together = ('employee_name', 'start_date')

class compensation(models.Model):
    c_id = models.AutoField(primary_key=True)  # Compensation ID (Auto-increment)
    s_id = models.IntegerField()  # Foreign key to Site
    e_id = models.IntegerField()  # Foreign key to Employee
    employee_compensation_name = models.CharField(max_length=255, default="Unknown")
    e_position = models.CharField(max_length=255)
    e_position_type = models.CharField(max_length=255)
    e_rate_type = models.CharField(max_length=50)  # Hourly, Monthly, etc.
    e_rate = models.DecimalField(max_digits=10, decimal_places=2)  # Salary/Rate
    e_compensation_ffective_Date = models.DateField()  # Effective start date
    e_comp_end_date = models.DateField(blank=True, null=True)  # Compensation end date
    created_at = models.DateTimeField(auto_now_add=True)  # Auto-set on creation
    updated_at = models.DateTimeField(auto_now=True)  # Auto-update on modification
    active_inactive = models.BooleanField(default=True)

    class Meta:
        db_table = 'compensation'

class Timesheet(models.Model):
    timesheet_id = models.AutoField(primary_key=True)
    e_id = models.ForeignKey('employee', on_delete=models.CASCADE)  # Assuming Employee model exists
    s_id = models.ForeignKey(User, on_delete=models.CASCADE)  # Assuming Site model exist
    week_start_date = models.DateField()
    week_end_date = models.DateField()
    submission_datetime = models.DateTimeField()  # Changed from DateField to DateTimeField
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Timesheet {self.timesheet_id} - {self.week_start_date} to {self.week_end_date}"

class PayDailyEntry(models.Model):
    pay_daily_entry_id = models.AutoField(primary_key=True)
    timesheet_id = models.ForeignKey(Timesheet, on_delete=models.CASCADE)  # Assuming Timesheet model exists
    c_id= models.ForeignKey('compensation', on_delete=models.CASCADE)  # Assuming Client model exists
    day_date = models.DateField()
    regular_hrs_worked = models.IntegerField(default=0)
    overtime_hr = models.IntegerField(default=0)
    daily_hourly_rate = models.IntegerField()
    total_daily_rate = models.IntegerField()
    leave = models.IntegerField(default=0)
    holiday = models.IntegerField(default=0)  # Will be set to 1 if regular_hrs_worked is 0
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.regular_hrs_worked == 0:
            self.holiday = 1
        else:
            self.holiday = 0  # Reset to default if regular_hrs_worked is not 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Entry {self.pay_daily_entry_id} - {self.day_date}"