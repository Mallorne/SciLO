from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from polls.models import User, UserProfile, Group
from .utils import FieldMixin


class UserSerializer(FieldMixin, serializers.ModelSerializer):
    institute = serializers.CharField(source='profile.institute', required=False, allow_blank=True)
    email_active = serializers.BooleanField(source='profile.email_active')
    is_instructor = serializers.BooleanField(source='profile.is_instructor', required=False)
    avatar = serializers.ImageField(
        source='profile.avatar',
        allow_empty_file=False,
        required=False)

    class Meta:
        model = User
        fields = (
            'id', 'institute', 'last_login',
            'username', 'first_name', 'last_name',
            'email', 'is_active', 'date_joined',
            'password', 'is_staff', 'avatar', 'email_active', 'is_instructor'
        )
        read_only_fields = ('is_active', 'is_staff', 'email_active', 'is_instructor')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        try:
            if data.get('password', None) is not None:
                validate_password(data.get('password'))
        except ValidationError as error:
            raise serializers.ValidationError({"password": list(error)})
        return data

    def to_representation(self, obj):
        obj_dict = super().to_representation(obj)
        if obj.profile.avatar:
            obj_dict['avatar'] = '/api/userprofile/{}/avatar'.format(obj.id)
        else:
            obj_dict['avatar'] = None

        return obj_dict

    def create(self, validated_data):
        profile_dict = validated_data.pop('profile', {})
        user = User.objects.create_user(**validated_data)
        user.profile.institute = profile_dict.get('institute', None)
        user.profile.avatar = profile_dict.get('avatar', None)
        user.profile.save()
        return user

    def update(self, instance, validated_data):
        profile_dict = validated_data.pop('profile', None)
        validated_data.pop('username', None)
        validated_data.pop('password', None)
        instance = super().update(instance, validated_data)
        if profile_dict is not None:
            instance.profile.institute = profile_dict['institute']
        instance.profile.save()
        return instance


class UserProfileSerializer(FieldMixin, serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = '__all__'


class GroupSerializer(FieldMixin, serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = '__all__'

    def to_representation(self, obj):
        obj_dict = super().to_representation(obj)
        if self.context.get('users_context', None):
            obj_dict['users'] = UserSerializer(
                obj.user_set.all(),
                context=self.context['users_context'],
                many=True).data

        return obj_dict
