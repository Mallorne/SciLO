# Generated by Django 2.2.1 on 2019-07-05 23:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0042_quiz_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='show_solution_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
