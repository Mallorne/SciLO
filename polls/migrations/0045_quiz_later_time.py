# Generated by Django 2.2.1 on 2019-07-08 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0044_auto_20190708_1942'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='later_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
