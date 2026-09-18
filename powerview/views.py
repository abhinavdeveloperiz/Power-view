from datetime import datetime
import os
import logging
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings
from django.core.mail import send_mail
from django.contrib import messages

logger = logging.getLogger(__name__)


def index(request):
    """Renders the main single-page application."""
    context = {
        'current_year': datetime.now().year,
    }
    return render(request, 'index.html', context)


def section_redirect(request, section):
    """Redirects legacy path routes to section hash on home page."""
    return redirect(f'/#{section}')


def enquiry(request):
    """Handles contact / enquiry form submissions."""
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        phone = request.POST.get('phone', '').strip()
        email = request.POST.get('email', '').strip() or 'Not provided'
        service = request.POST.get('service', '').strip() or 'General Enquiry'
        message = request.POST.get('message', '').strip() or 'No message provided'

        if not name or not phone:
            messages.error(request, 'Please provide your name and phone number.')
            return redirect('/#contact')

        subject = f"New Enquiry from {name} — Power View Website"
        body = (
            f"Name: {name}\n"
            f"Phone: {phone}\n"
            f"Email: {email}\n"
            f"Service: {service}\n"
            f"Message: {message}\n"
            f"\n---\nSent from Power View website contact form."
        )

        try:
            recipient = getattr(settings, 'BUSINESS_EMAIL', 'shyamlal9947@gmail.com')
            sender = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@powerviewkollam.com')
            send_mail(
                subject=subject,
                message=body,
                from_email=sender,
                recipient_list=[recipient],
                fail_silently=False,
            )
            messages.success(request, 'Thanks! Your enquiry has been sent — we will contact you shortly.')
        except Exception as e:
            logger.error(f"Failed to send enquiry email: {e}")
            messages.info(request, 'Thank you! For immediate response, feel free to call us at 9947 367 322 or WhatsApp.')

        return redirect('/#contact')

    return redirect('/#contact')


def robots_txt(request):
    """Serves robots.txt from the static directory."""
    robots_path = os.path.join(settings.BASE_DIR, 'static', 'robots.txt')
    try:
        with open(robots_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        content = "User-agent: *\nAllow: /\n"
    return HttpResponse(content, content_type='text/plain')


def sitemap_xml(request):
    """Serves sitemap.xml from the static directory."""
    sitemap_path = os.path.join(settings.BASE_DIR, 'static', 'sitemap.xml')
    try:
        with open(sitemap_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        content = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    return HttpResponse(content, content_type='application/xml')
