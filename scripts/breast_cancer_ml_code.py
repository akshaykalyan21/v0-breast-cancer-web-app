# Install dependencies (if not installed)
# !pip install scikit-learn pandas numpy joblib

import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# 1. Load dataset
breast_cancer_dataset = load_breast_cancer()

# 2. Load data into a pandas dataframe
data_frame = pd.DataFrame(breast_cancer_dataset.data, columns=breast_cancer_dataset.feature_names)

# 3. Add target column
data_frame['Binary'] = breast_cancer_dataset.target

# 4. Separate features and target
X = data_frame.drop(columns='Binary', axis=1)
y = data_frame['Binary']

# 5. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=2)

# 6. Train Logistic Regression model
model = LogisticRegression(max_iter=10000)
model.fit(X_train, y_train)

# 7. Evaluate the model
# Training accuracy
y_train_pred = model.predict(X_train)
training_accuracy = accuracy_score(y_train, y_train_pred)
print("Training Accuracy:", training_accuracy)

# Testing accuracy
y_test_pred = model.predict(X_test)
testing_accuracy = accuracy_score(y_test, y_test_pred)
print("Testing Accuracy:", testing_accuracy)

# 8. Build predictive system for a single input
input_data = (
    13.54,14.36,87.46,566.3,0.09779,0.08129,0.06664,0.04781,0.1885,0.05766,
    0.2699,0.7886,2.058,23.56,0.008462,0.0146,0.02387,0.01315,0.0198,0.0023,
    15.11,19.26,99.7,711.2,0.144,0.1773,0.239,0.1288,0.2977,0.07259
)

input_array = np.asarray(input_data).reshape(1, -1)
prediction = model.predict(input_array)

if prediction[0] == 0:
    print("Prediction: MALIGNANT")
else:
    print("Prediction: BENIGN")

# 9. Save the trained model
joblib.dump(model, 'breast_cancer_model.pkl')
print("Model saved as 'breast_cancer_model.pkl'")
