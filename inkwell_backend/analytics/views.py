from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import UserProfile
from books.models import Book

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_analytics = {
            'profile_views': user.profile_views,
            'follower_count_history': user.follower_count_history,
            'total_book_likes': user.total_book_likes,
            'total_book_views': user.total_book_views,
            'total_revenue': float(user.total_revenue),
            'geographic_distribution': user.geographic_distribution,
        }

        books = Book.objects.filter(uploaded_by=user)
        book_analytics = []
        for book in books:
            book_analytics.append({
                'id': book.id,
                'title': book.title,
                'view_count': book.view_count,
                'unique_view_count': book.unique_view_count,
                'completed_reads': book.completed_reads,
                'total_reading_time': str(book.total_reading_time),
                'likes_count': book.likes.count(),
                'geographic_distribution': book.geographic_distribution,
                'revenue': float(book.revenue),
            })

        return Response({
            'user_analytics': user_analytics,
            'book_analytics': book_analytics,
        })