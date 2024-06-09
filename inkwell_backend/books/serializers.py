# books/serializers.py
from rest_framework import serializers
from .models import Genre, Book
import logging

logger = logging.getLogger(__name__)



class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class BookSerializer(serializers.ModelSerializer):
    genres = serializers.ListField(child=serializers.CharField())  # Accept genres as a list of strings
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    likes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    dislikes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    recommendations = serializers.PrimaryKeyRelatedField(many=True, read_only=True)


    class Meta:
        model = Book
        fields = ['id','title','genres','content','pdf_file','description','cover_picture','banner_picture','uploaded_by','upload_date','likes','dislikes','read_count','comments','recommendations']
        read_only_fields = ['uploaded_by']  # Make author read-only
    

    def create(self, validated_data):
        genres_data = validated_data.pop('genres', [])
        request = self.context.get('request', None)
        user = request.user if request else None

        print("Creating book instance")
        print(f"Validated data: {validated_data}")
        print(f"Genres data: {genres_data}")
        print(f"User: {user}")

        try:
            # Create the book instance
            book = Book.objects.create(uploaded_by=user, **validated_data)

            # Fetch or create each genre and add to the book instance
            # genres = []
            # for genre_name in genres_data:
            #     genre, _ = Genre.objects.get_or_create(name=genre_name)
            #     genres.append(genre)
            # book.genres.set(genres)
            for genre_name in genres_data:
                genre, _ = Genre.objects.get_or_create(name=genre_name)
                book.genres.add(genre)


            print(f"Created book: {book}")
            return book
        except Exception as e:
            print(f"Error creating book: {str(e)}")
            raise serializers.ValidationError({"detail": str(e)})


