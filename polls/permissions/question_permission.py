from rest_framework import permissions
from django.contrib.auth.models import Permission
from polls.models import Course, UserRole, Question


class EditQuestion(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        print('edit question')
        if request.user.is_staff:
            return True
        pk = request.data.get('course', None)
        if pk is not None:
            course = Course.objects.get(pk=pk)
            return UserRole.objects.filter(user=request.user, course=course, role__permissions__codename='change_question').exists()
        else:
            pk = dict(view.kwargs).get('pk', None)
            return Question.objects.filter(pk=int(pk), owner=request.user, course=None).exists()

class ViewQuestion(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        print('view question')
        if request.user.is_staff:
            return True
        pk = request.data.get('course', None)
        if pk is None:
            pk = request.data.get('pk', None)
        if pk is None:
            pk = request.data.get('id', None)
        if pk is None:
            pk = dict(request.query_params).get('courses[]', None)
            if pk is not None:
                pk = int(pk[0])
        if pk is None:
            pk = dict(view.kwargs).get('pk', None)
            if pk is not None:
                return Question.objects.filter(pk=int(pk), owner=request.user, course=None).exists()
        else:
            return UserRole.objects.filter(user=request.user, course__pk=pk, role__permissions__codename='view_question').exists()

class CreateQuestion(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        print('create question')
        if request.user.is_staff:
            return True
        pk = request.data.get('course', None)
        if pk is not None:
            return UserRole.objects.filter(user=request.user, course__pk=pk, role__permissions__codename='add_question').exists()
        return UserRole.objects.filter(user=request.user, role__permissions__codename='add_question').exists()

class DeleteQuestion(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        print('delete question')
        if request.user.is_staff:
            return True
        pk = request.data.get('course', None)
        print(pk)
        if pk is None:
            pk = dict(view.kwargs).get('pk', None)
            if pk is not None:
                return Question.objects.filter(pk=int(pk), owner=request.user, course=None).exists()
        if pk is not None:
            return UserRole.objects.filter(user=request.user, course__pk=pk, role__permissions__codename='delete_question').exists()
        return False
