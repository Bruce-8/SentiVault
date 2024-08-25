from rest_framework.test import APITestCase
from rest_framework import status
from .models import Sentiment

class SentimentTests(APITestCase):

    def setUp(self):
        self.sentiment = Sentiment.objects.create(title="Test Sentiment", content="My first sentiment.", prediction="")


    def test_get_sentiments(self):
        response = self.client.get('/sentiments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['title'], 'Test Sentiment')
    