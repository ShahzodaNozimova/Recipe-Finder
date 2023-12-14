from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from RecipeFinder.models import Category, Recipe, Tag
from RecipeFinder.serializers import SignInSerializer, SignUpSerializer, CategorySerializer, RecipeSerializer, \
    TagSerializer, DisplayRecipeSerializer, UserProfileUpdateSerializer

from rest_framework.generics import RetrieveUpdateAPIView
from RecipeFinder.models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    if request.method == 'POST':
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    if request.method == 'POST':
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class RecipeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DisplayRecipeSerializer
        return RecipeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = Recipe.objects.all()
        ingredients = self.request.query_params.get('ingredients', None)
        created_at = self.request.query_params.get('created_at', None)

        if ingredients:
            queryset = queryset.filter(ingredients__name__icontains=ingredients)

        if created_at:
            queryset = queryset.filter(created_at__date=created_at)

        return queryset



class RecipeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        recipe = generics.get_object_or_404(queryset, pk=self.kwargs.get('pk'))
        
        # Check if the recipe belongs to the current user
        if recipe.user != self.request.user:
            raise PermissionError("You don't have permission to perform this action.")

        return recipe

class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

class TagRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]


class UserProfileUpdateView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)