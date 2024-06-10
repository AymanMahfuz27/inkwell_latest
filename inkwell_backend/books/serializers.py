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
    genres = serializers.SlugRelatedField(slug_field='name', queryset=Genre.objects.all(), many=True)
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    likes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    dislikes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    comments = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    recommendations = serializers.PrimaryKeyRelatedField(many=True, read_only=True)


    class Meta:
        model = Book
        fields = ['id','title','genres','content','pdf_file',
                  'description','cover_picture','banner_picture','uploaded_by',
                  'upload_date','likes','dislikes','read_count','comments','recommendations']
        read_only_fields = ['uploaded_by']  # Make author read-only
    

    def create(self, validated_data):
        print(validated_data)
        genres_data = validated_data.pop('genres',[])
        request = self.context.get('request')
        user = request.user if request else None
        if user is None:
            raise serializers.ValidationError({"detail": "User must be authenticated to upload a book."})


        try:
            # Create the book instance
            book = Book.objects.create(uploaded_by=user, **validated_data)
            # book = self.Meta.model.objects.create(**validated_data)

            logger.debug(f"Book created: {book}")


            # Fetch or create each genre and add to the book instance
            genres = []
            for genre_name in genres_data:
                genre, created = Genre.objects.get_or_create(name=genre_name)
                genres.append(genre)



            book.genres.set([genre for genre in genres])
            book.save()

            return book
        except Exception as e:
            print(f"Error creating book: {str(e)}")
            raise serializers.ValidationError({"detail": str(e)})
      


