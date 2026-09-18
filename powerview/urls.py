from django.urls import path
from . import views

urlpatterns = [
    # Homepage
    path('', views.index, name='index'),
    path('home/', views.index, name='home'),
    path('home', views.index),

    # Section redirects for legacy/direct links
    path('about/', views.section_redirect, {'section': 'about'}, name='about'),
    path('about', views.section_redirect, {'section': 'about'}),
    path('about-us/', views.section_redirect, {'section': 'about'}),
    path('about-us', views.section_redirect, {'section': 'about'}),

    path('service/', views.section_redirect, {'section': 'services'}),
    path('service', views.section_redirect, {'section': 'services'}),
    path('services/', views.section_redirect, {'section': 'services'}, name='services'),
    path('services', views.section_redirect, {'section': 'services'}),

    path('contact/', views.section_redirect, {'section': 'contact'}, name='contact'),
    path('contact', views.section_redirect, {'section': 'contact'}),
    path('contact-us/', views.section_redirect, {'section': 'contact'}),
    path('contact-us', views.section_redirect, {'section': 'contact'}),

    # Form submission
    path('enquiry/', views.enquiry, name='enquiry'),
    path('enquiry', views.enquiry),
    path('enquire/', views.enquiry),
    path('enquire', views.enquiry),

    # Search Engine Optimisation (SEO)
    path('robots.txt', views.robots_txt, name='robots_txt'),
    path('sitemap.xml', views.sitemap_xml, name='sitemap_xml'),
]
