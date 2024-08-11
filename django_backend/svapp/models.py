from django.db import models

# Create your models here.
class Sentiment(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    prediction = models.TextField(blank=True)

    def __str__(self):
        return self.title