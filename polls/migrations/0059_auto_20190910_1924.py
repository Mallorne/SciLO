# Generated by Django 2.2.1 on 2019-09-10 19:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0058_auto_20190904_2150'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='author',
        ),
        migrations.AddField(
            model_name='quiz',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='polls.Course'),
        ),
    ]
