# Generated by Django 2.2.1 on 2019-05-28 02:19

from django.db import migrations
import polls.models.response
from django.contrib.postgres.fields import JSONField


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0024_auto_20190528_0107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='response',
            name='rtype',
            field=JSONField(default=dict),
        ),
    ]
