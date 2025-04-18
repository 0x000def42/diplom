# Generated by Django 5.1.6 on 2025-03-24 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExternalUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.CharField(max_length=255, unique=True)),
                ('provider', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'unique_together': {('external_id', 'provider')},
            },
        ),
    ]
