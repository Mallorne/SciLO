# Generated by Django 2.2.5 on 2020-03-02 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0076_auto_20200302_2113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='text',
            field=models.TextField(blank=True, default='', null=True),
        ),
    ]
