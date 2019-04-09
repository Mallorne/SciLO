# Generated by Django 2.1.4 on 2019-01-21 19:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0002_auto_20190121_1726'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResponseAttempt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade', models.FloatField(default=0)),
                ('answers_string', models.TextField()),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='polls.User')),
                ('question_attemp', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='response_attempts', to='polls.QuestionAttempt')),
                ('response', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='response_attempts', to='polls.Response')),
            ],
        ),
    ]
