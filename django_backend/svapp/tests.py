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
    

    # def test_create_sentiment(self):
    #     sample_data = {
    #         "title": "New Sentiment",
    #         "content": "Hello There!",
    #         "prediction": ""
    #     }
    #     response = self.client.post('/sentiments/', sample_data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(response.data['title'], 'New Sentiment')
    

    # def test_update_sentiment(self):
    #     sample_data = {
    #         "title": "Updated Sentiment",
    #         "content": "Hello There!",
    #         "prediction": ""
    #     }
    #     response = self.client.put(f'/sentiments/{self.sentiment.id}/', sample_data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['title'], 'Updated Sentiment')


    def test_delete_sentiment(self):
        response = self.client.delete(f'/sentiments/{self.sentiment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Sentiment.objects.count(), 0)