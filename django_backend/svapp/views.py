from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Sentiment
from .serializers import SentimentSerializer
import tensorflow as tf
import keras
from keras import layers
import pickle

# Create your views here.
class SentimentViewSet(viewsets.ModelViewSet):
    queryset = Sentiment.objects.all()
    serializer_class = SentimentSerializer

    # Overriding create method to include ML prediction.
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["prediction"] = self.make_prediction(data["content"])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    # Overriding update method ot include ML prediction.
    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        data["prediction"] = self.make_prediction(data["content"])
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    
    def make_prediction(self, input_text):
        # Configuring components for machine learning.
        vec_config = pickle.load(open("svapp/tv_config.pkl", "rb"))
        new_vec = layers.TextVectorization.from_config(vec_config["config"])
        new_vec.set_vocabulary(vec_config["vocabulary"])
        input_text = new_vec(tf.constant([input_text]))
        model = keras.models.load_model("svapp/senti_vault_model.h5")

        # Making predictions.
        prediction = model.predict(input_text)

        return "Positive" if prediction[0][0] >= 0.2 else "Negative"
