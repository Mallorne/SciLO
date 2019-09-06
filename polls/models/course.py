
from django.db import models
from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
# from django.contrib.contenttypes.models import ContentType
from django.db.models import Q


class Course(models.Model):
    '''
    each course has two default groups, shortname+_student_group and shortname+_professor_group
    shortname+_student_group has two permissions: scilo_basic_student, course_+id+_student
    shortname+_professor_group has two permissions: scilo_basic_professor, course_+id+_professor
    '''

    groups = models.ManyToManyField(Group)
    fullname = models.CharField(max_length=200, null=False, blank=False, unique=True)
    shortname = models.CharField(max_length=50, null=False, blank=False, unique=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)


    class Meta:
        app_label = 'polls'


@receiver(pre_delete, sender=Course)
def delete_repo(sender, instance, **kwargs):
    gs = Group.objects.filter(
        Q(name=instance.shortname+'_student_group') | Q(name=instance.shortname+'_professor_group'))
    gs.delete()
    # ps = Permission.objects.filter(
    #     Q(codename='course_'+str(instance.pk)+'_student') | Q(codename='course_'+str(instance.pk)+'_professor'))
    # ps.delete()

@receiver(post_save, sender=Course)
def create_course_group(sender, instance, created, **kwargs):
    if created:
        try:
            g1 = Group.objects.create(name='COURSE_'+instance.shortname+'_student_group')
            g1.permissions.set([Permission.objects.get(codename='scilo_basic_student')])
            g2 = Group.objects.create(name='COURSE_'+instance.shortname+'_professor_group')
            g2.permissions.set([Permission.objects.get(codename='scilo_basic_professor')])
            instance.groups.add(g1)
            instance.groups.add(g2)
        except Exception as e:
            instance.delete()
            raise e
