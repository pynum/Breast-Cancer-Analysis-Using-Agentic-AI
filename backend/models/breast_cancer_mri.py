# -*- coding: utf-8 -*-
"""Breast Cancer MRI

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/19YthmQEd4ST46OmjhJV9ZuwMpuqIADyZ
"""

from google.colab import drive
drive.mount('/content/drive')

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import InceptionV3
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout, Flatten, BatchNormalization
from tensorflow.keras.models import Model
import os

dir = "/content/drive/MyDrive/breast cancer MRI"
train_dir = "/content/drive/MyDrive/breast cancer MRI/Breast Cancer Patients MRI's/train"
val_dir = "/content/drive/MyDrive/breast cancer MRI/Breast Cancer Patients MRI's/validation"

# Image data generators with augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

# Load images from directories
train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary'
)

val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary'
)

# Load pre-trained InceptionV3 model
base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze base model layers

# Add custom classification layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.4)(x)
x = Dense(128, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)
x = Dense(64, activation='relu')(x)
x = Dropout(0.3)(x)
x = Dense(1, activation='sigmoid')(x)

# Create final model
model = Model(inputs=base_model.input, outputs=x)

# Compile model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train model
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=20,
    verbose=1
)

# Save the trained model
model.save('/mnt/data/breast_cancer_model.h5')

model.save('/content/breast_cancer_model.h5')

import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import image

# Load the trained model
model_path = "/mnt/data/breast_cancer_model.h5"  # Adjust if needed
model = tf.keras.models.load_model(model_path)

# Class labels
class_labels = {0: "Healthy", 1: "Sick"}

# Function to classify and display an image
def classify_and_show_image(img_path):
    # Load the image
    img = image.load_img(img_path, target_size=(224, 224))  # Resize for model
    img_array = image.img_to_array(img)  # Convert to array
    img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions
    img_array /= 255.0  # Normalize

    # Make prediction
    prediction = model.predict(img_array)[0][0]

    # Determine class and confidence
    predicted_class = "Sick" if prediction > 0.5 else "Healthy"
    confidence = prediction if predicted_class == "Sick" else 1 - prediction

    # Display image
    plt.figure(figsize=(5, 5))
    plt.imshow(image.load_img(img_path))
    plt.axis("off")
    plt.title(f"Predicted: {predicted_class} ({confidence:.2f})", fontsize=14, color="blue")
    plt.show()

    return predicted_class, confidence

# Test with a sample image
image_path = "/content/drive/MyDrive/breast cancer MRI/Breast Cancer Patients MRI's/train/Healthy/H_1.jpg"  # Change to your test image path
classify_and_show_image(image_path)

import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# Load the trained model
model_path = "/mnt/data/breast_cancer_model.h5"  # Adjust this path if necessary
model = tf.keras.models.load_model(model_path)

# Class labels (ensure they match your training data labels)
class_labels = {0: "Healthy", 1: "Sick"}

# Function to preprocess and classify an image
def classify_image(img_path):
    # Load the image
    img = image.load_img(img_path, target_size=(224, 224))  # Resize to match model input size
    img_array = image.img_to_array(img)  # Convert to array
    img_array = np.expand_dims(img_array, axis=0)  # Expand dimensions for model input
    img_array /= 255.0  # Normalize (same as training)

    # Make prediction
    prediction = model.predict(img_array)[0][0]

    # Convert probability to class label
    predicted_class = "Sick" if prediction > 0.5 else "Healthy"
    confidence = prediction if predicted_class == "Sick" else 1 - prediction

    # Print result
    print(f"Predicted: {predicted_class} (Confidence: {confidence:.2f})")
    return predicted_class, confidence

# Test with a sample image
image_path = "/content/drive/MyDrive/archive (1)/Breast Cancer Patients MRI's/train/Healthy/H_1.jpg"  # Change to your image path
classify_image(image_path)