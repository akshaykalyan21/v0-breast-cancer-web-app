import numpy as np
import pandas as pd
import sklearn.datasets
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib
import json

print("Loading breast cancer dataset...")

# Loading data from sklearn
breast_cancer_dataset = sklearn.datasets.load_breast_cancer()

# Loading the data to a dataframe
data_frame = pd.DataFrame(breast_cancer_dataset.data, columns=breast_cancer_dataset.feature_names)

# Adding the target column to the dataframe
data_frame['Binary'] = breast_cancer_dataset.target

print(f"Dataset shape: {data_frame.shape}")
print(f"Target distribution: {data_frame['Binary'].value_counts().to_dict()}")

# Separating features and target
x = data_frame.drop(columns='Binary', axis=1)
y = data_frame['Binary']

# Splitting the data into training and testing data
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=2)

print(f"Training set size: {x_train.shape[0]}")
print(f"Testing set size: {x_test.shape[0]}")

# Model training - LogisticRegression
model = LogisticRegression(max_iter=1000)

# Training the logistic regression model using training data
model.fit(x_train, y_train)

# Model evaluation
# Accuracy on training data
x_train_prediction = model.predict(x_train)
training_data_accuracy = accuracy_score(y_train, x_train_prediction)
print(f'Accuracy on training data = {training_data_accuracy:.4f}')

# Accuracy on testing data
x_test_prediction = model.predict(x_test)
testing_data_accuracy = accuracy_score(y_test, x_test_prediction)
print(f'Accuracy on testing data = {testing_data_accuracy:.4f}')

# Save the trained model
joblib.dump(model, 'breast_cancer_model.pkl')
print("Model saved as breast_cancer_model.pkl")

# Save feature names and statistics for normalization
feature_stats = {
    'feature_names': breast_cancer_dataset.feature_names.tolist(),
    'mean_values': x.mean().tolist(),
    'std_values': x.std().tolist(),
    'coefficients': model.coef_[0].tolist(),
    'intercept': float(model.intercept_[0])
}

with open('model_stats.json', 'w') as f:
    json.dump(feature_stats, f, indent=2)

print("Feature statistics saved as model_stats.json")

# Test with sample data
input_data = (13.54, 14.36, 87.46, 566.3, 0.09779, 0.08129, 0.06664, 0.04781, 0.1885, 0.05766, 
              0.2699, 0.7886, 2.058, 23.56, 0.008462, 0.0146, 0.02387, 0.01315, 0.0198, 0.0023, 
              15.11, 19.26, 99.7, 711.2, 0.144, 0.1773, 0.239, 0.1288, 0.2977, 0.07259)

input_data_as_numpy_array = np.asarray(input_data)
input_data_reshaped = input_data_as_numpy_array.reshape(1, -1)

prediction = model.predict(input_data_reshaped)
probability = model.predict_proba(input_data_reshaped)[0]

print(f"\nTest prediction: {int(prediction[0])}")
print(f"Probabilities: [Malignant: {probability[0]:.4f}, Benign: {probability[1]:.4f}]")

if prediction[0] == 0:
    print("THE BREAST CANCER IS MALIGNANT")
else:
    print("THE BREAST CANCER IS BENIGN")
