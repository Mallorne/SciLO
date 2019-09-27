from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response as HttpResponse
from rest_framework import authentication, permissions
from django.shortcuts import get_object_or_404
from django.db.models import Q
from polls.models import Course, User
from polls.serializers import CourseSerializer
from polls.permissions import InCourse, IsInstructorInCourse


def find_user_courses(user):
    groups = user.groups.filter(Q(name__contains='COURSE_'))
    courses = Course.objects.none()
    for g in groups:
        courses = courses.union(g.course_set.all())
    return courses


@api_view(['GET'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAuthenticated])
def get_courses(request):

    if request.user.is_staff:
        courses = Course.objects.all()
    else:
        courses = find_user_courses(request.user)
    serializer = CourseSerializer(
        courses,
        context={
            'groups_context': {
                "fields": ["id", "name", "users"],
                "users_context": {
                    "fields": ['id', 'username', 'first_name', 'last_name', 'email']
                }
            }
        },
        many=True)
    return HttpResponse(serializer.data)


@api_view(['POST'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([permissions.IsAdminUser])
def create_a_course(request):
    fullname = request.data.get('fullname', None)
    shortname = request.data.get('shortname', None)
    if fullname and shortname:
        course = Course.objects.create(fullname=fullname, shortname=shortname)
        serializer = CourseSerializer(
            course,
            context={
                'question_context': {
                    "exclude_fields": ["quizzes", "course"],
                    "author_context": {
                        "fields": ["id", "username"]
                    }
                },
                'groups_context': {
                    "fields": ["id", "name", 'users'],
                    "users_context": {
                        "fields": ['id', 'username', 'first_name', 'last_name', 'email']
                    }
                }
            })
        return HttpResponse(serializer.data)
    else:
        return HttpResponse(status=400, data={"message": 'required fields: fullname and shortname'})


@api_view(['GET', 'DELETE'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([InCourse])
def get_or_delete_course(request, pk):
    user = request.user
    course = get_object_or_404(Course, pk=pk)
    if request.method == 'DELETE':
        if user.is_staff:
            course.delete()
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=403, data={"message": "you dont have permission to delete this course"})
    elif request.method == 'GET':
        serializer = CourseSerializer(
            course,
            context={
                'question_context': {
                    "exclude_fields": ["quizzes", "course"],
                    "author_context": {
                        "fields": ["id", "username"]
                    }
                },
                'groups_context': {
                    "fields": ["id", "name", "users"],
                    "users_context": {
                        "fields": ['id', 'username', 'first_name', 'last_name', 'email']
                    }
                }
            })
        return HttpResponse(serializer.data)


@api_view(['POST', 'DELETE'])
@authentication_classes([authentication.TokenAuthentication])
@permission_classes([IsInstructorInCourse])
def add_or_delete_student_to_course(request, pk):
    uids = request.data.get('users', None)
    if uids is None:
        return HttpResponse(status=400, data={"message": 'required filed: users'})
    course = get_object_or_404(Course, pk=pk)
    users = User.objects.filter(pk__in=uids)  # get all users via uids
    group = course.groups.get(name='COURSE_'+course.shortname+'_student_group')

    if request.method == 'POST':
        group.user_set.add(*users)
    elif request.method == 'DELETE':
        group.user_set.remove(*users)
    group.save()
    serializer = CourseSerializer(
        course,
        context={
            'question_context': {
                "exclude_fields": ["quizzes", "course"],
                "author_context": {
                    "fields": ["id", "username"]
                }
            },
            'groups_context': {
                "fields": ["id", "name", "users"],
                "users_context": {
                    "fields": ['id', 'username', 'first_name', 'last_name', 'email']
                }
            }
        }
    )
    return HttpResponse(status=200, data=serializer.data)
