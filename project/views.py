from django.shortcuts import render, redirect, get_object_or_404
from .forms import *
from .models import *
from django.http import JsonResponse



def index(request):
    if request.method == 'POST':
            contact_form = ContactForm(request.POST)
            if contact_form.is_valid():
                contact_form.save()

    context = {
        'contact_form': ContactForm(),
        
        'products': Product.objects.all(),
    }

    return render(request, 'pages/index.html', context)



def add_to_cart(request, product_id):
    product_id = int(product_id)  # تأكد من أن product_id هو int
    cart = request.session.get('cart', [])

    # شوف لو المنتج موجود بالفعل في السلة
    for item in cart:
        if item['product_id'] == product_id:
            item['quantity'] += 1  # زيادة الكمية
            break
    else:
        # لو مش موجود، ضيفه
        cart.append({'product_id': product_id, 'quantity': 1})

    # حفظ التعديلات في السيشن
    request.session['cart'] = cart
    request.session.modified = True  # تأكيد تعديل السيشن

    return redirect('cart')  # إعادة التوجيه إلى صفحة السلة

def checkout(request):
    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            order = form.save()  # يحفظ بيانات العميل

            cart = request.session.get('cart', [])
            if cart:  # التأكد من أن السلة غير فارغة
                for item in cart:
                    try:
                        product = Product.objects.get(id=item['product_id'])
                        quantity = int(item['quantity'])  # التأكد أن الكمية هي int
                        price = product.new_price if product.new_price else product.price

                        # إضافة المنتجات للطلب
                        OrderItems.objects.create(
                            order=order,
                            product=product,
                            product_name=product.name,
                            quantity=quantity,
                            price=price,
                        )
                    except Product.DoesNotExist:
                        continue  # لو المنتج اتحذف أو مش موجود

                # تفريغ السلة بعد تأكيد الطلب
                request.session['cart'] = []  # إفراغ السلة
                request.session.modified = True  # تأكيد تعديل السيشن

            return redirect('order-confirmation')  # التوجيه إلى صفحة تأكيد الطلب
    else:
        form = CheckoutForm()

    return render(request, 'pages/checkout.html', {'form': form})


def order_confirmation(request):
    return render(request, 'pages/order-confirmation.html')







def search_view(request):
    query = request.GET.get("q")
    products = []
    collections = []

    if query:
        products = Product.objects.filter(name__icontains=query)

    return render(request, "pages/search.html", {
        "products": products,
        "collections": collections,
        "query": query
    })

def cart(request):
    return render(request, 'pages/cart.html')

