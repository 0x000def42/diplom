# Generated by Django 5.1.6 on 2025-03-29 16:15

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_template_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='templateversion',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
