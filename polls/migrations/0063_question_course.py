# Generated by Django 2.2.1 on 2019-09-18 20:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0062_auto_20190918_2007'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='polls.Course'),
        ),
    ]
