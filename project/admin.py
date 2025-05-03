from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Product)
admin.site.register(Contact)

class OrderItemInline(admin.TabularInline):
    model = OrderItems
    raw_id_fields = ['product']  # عرض المنتجات باستخدام raw_id_fields لسرعة الوصول
    extra = 0  # لتجنب ظهور حقول إضافية فارغة

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'address']
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]  # ربط الـ Inline للمنتجات داخل الطلب

    def total_amount(self, obj):
        total = sum(item.total for item in obj.items.all())
        return total
    total_amount.admin_order_field = 'total_amount'  # لتتمكن من ترتيب الطلبات حسب المبلغ الإجمالي

