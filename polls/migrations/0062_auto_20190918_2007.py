# Generated by Django 2.2.1 on 2019-09-18 20:07

from django.db import migrations, models
import polls.models.user


class Migration(migrations.Migration):

    dependencies = [
        ('polls', '0061_userprofile_is_instructor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(blank=True, max_length=254, null=True, upload_to='storage', validators=[polls.models.user.validate_avatar_size], verbose_name='avatar'),
        ),
    ]
