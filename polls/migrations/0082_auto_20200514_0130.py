# Generated by Django 3.0.6 on 2020-05-14 01:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0081_merge_20200303_0509'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='text',
            field=models.TextField(blank=True, default=''),
        ),
    ]
