from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _


from RecipeFinder.models import User, Category, Recipe, Tag


# login
class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    tokens = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'tokens')

    def get_tokens(self, obj):
        user = get_object_or_404(User, username=obj.username)
        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    def validate(self, attrs):
        username = attrs.get('username', '')
        password = attrs.get('password', '')
        try:

            user = authenticate(username=username, password=password)
        except Exception as e:
            print(e)
        if not user:
            raise AuthenticationFailed(_('Invalid credentials, please try again'))

        return {
            'username': user.username,
            'tokens': self.get_tokens(user),
        }

# register
class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username')

    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already registered.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User.objects.create_user(password=password, **validated_data)

        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('id', 'category', 'ingredients', 'image', 'description', 'cook_time', 'created_at')

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'