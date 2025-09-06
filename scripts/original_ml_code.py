Import dependencies

!pip install scikit-learn
import numpy as np
import pandas as pd
import sklearn.datasets
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn import svm

#numpy            - Used to make numpy arrays
#pandas           - Used to create panda frames ( csv file to dataframes) to analyze and process the data in more structured way
#sklear           - to extract datasets of the paitent details about cells-tumors
#train_test_split - Split into training data and testing data
#acccuracy_score  - Used to determine correct predictions

Data collection and processing

#Loading data from sklearn      -     to a variable named breast_cancer_dataset

breast_cancer_dataset = sklearn.datasets.load_breast_cancer()

print(breast_cancer_dataset)

#output contains dataset of - " data " , " target " , " features " - stored in dictionary(python)

#Loading the data to a dataframe
data_frame = pd.DataFrame( breast_cancer_dataset.data , columns = breast_cancer_dataset.feature_names )

#loading data to panda dataframe
#breast_cancer_dataset.data - Represent data array
#column                     - names of features ( eg - radius , area , perimeter of cell)

#Printing the first 5 rows of the dataframe

data_frame.head()

#Adding the target column to the dataframe    - to a Binary array

data_frame['Binary']=breast_cancer_dataset.target

#Printing the last 5 rows of the dataframe

data_frame.tail()

#diff between the above head() and this tail() is we have the dataset with another column name( 'Binary' - at last) containing 0 or 1

#number of rows and columns in the dataset

data_frame.shape

#we should not use shape() bcz it become tuple in python programming language
#output 569 - data of 569 diff people        ||    31 - columns of the dataset

#getting information about the data

data_frame.info()

#checking for missing values

data_frame.isnull().sum()

#statistical measues about the data

data_frame.describe()

#describe - Used to give imporant statistical of data
# In Output
#count - values in each coloumn
#mean - mean value for each column
#std - standard deviation value
#% - percentile
# 25% - 25 % of  values are less than 11.7 in mean radius column

#checking the target variable

data_frame['Binary'].value_counts

#output - 357 are benign cases
#           0 are malignant cases

#group datasets based on Binary we have

data_frame.groupby('Binary').mean()

#output-
# mean radius of all malignant cases are 17.46
# mean radius of all benign cases are 12.14

#seperating features and target

x = data_frame.drop(columns='Binary' , axis=1)
y = data_frame['Binary']
#input features 30 columns are taken as x
#target column('Binary') is taken as y
#fitting data to ml model -  we have to fit it in terms of x and y

print(x)

print(y)

Splitting the data into training and testing data

x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.2,random_state=2)

#x_train - training data
#x_test  - testing data
#y_train - corresponding values of x_train is stored here
#y_test  - corresponding binary of y_train is stored here
#train_test_split() - split x and y
#test_size=0.2      - 80% of data to be training data and 20%(0.2) of data to be testing data
#random state       - used to reproduce the code

print(x.shape,x_train.shape,x_test.shape)

#x - original dataset
#output - 455 are training data and 114 are testing data

Model training - LogisticRegression

#logisticregression is used for binary classification model ( in this for 2 classes - benign , malignant)

model = LogisticRegression()

#trainng the logisticregression model using training data

model.fit(x_train,y_train)

#figure out the relation between x_train and y_train

Model evaluation

Accuracy score

#accuracy on training data

x_train_prediction=model.predict(x_train)
# an array x_train_prediction - used to store all the binary values

training_data_accuracy=accuracy_score(y_train,x_train_prediction)
#comparing both y_train and x_train_prediction - y_train is our true value and x_train_prediction is our new predicted value


print('Accuracy on training data = ',training_data_accuracy)

#output - 94% correct predictions - out of 100 we have 94 correct predicted cases

#accuracy on testing data

x_test_prediction=model.predict(x_test)
# an array x_test_prediction - used to store all the binary values

testing_data_accuracy=accuracy_score(y_test,x_test_prediction)
#comparing both y_test and x_test_prediction - y_train is our true value and x_train_prediction is our new predicted value


print('Accuracy on testing data = ',testing_data_accuracy)

#output - 93% correct predictions - out of 100 we have 93 correct predicted cases

#reason for finding accuracy score for both training data and testing data is - sometimes our model trains to overfit (try to learn more from the training data)
#Overfited model will do is it only makes the correct predictions for the training data , but cant make correct predictions for test data

Building a predictive system

Entering the data to the model

input_data=(13.54,14.36,87.46,566.3,0.09779,0.08129,0.06664,0.04781,0.1885,0.05766,0.2699,0.7886,2.058,23.56,0.008462,0.0146,0.02387,0.01315,0.0198,0.0023,15.11,19.26,99.7,711.2,0.144,0.1773,0.239,0.1288,0.2977,0.07259)

#change the input data to a numpy array
input_data_as_numpy_array = np.asarray(input_data)

#reshape the numpy array as we are predicting for one datapoint - so that the model knows to predict the binary for only 1 value
input_data_reshaped =  input_data_as_numpy_array.reshape(1,-1)

prediction = model.predict(input_data_reshaped)
print(int(prediction))

if(prediction[0]==0):
  print("THE BREAST CANCER IS MALIGNANT\n\n\n\n")
else:
  print("THE BREAST CANCER IS BENIGN\n\n\n\n")


import joblib
joblib.dump(model, 'breast_cancer_model.pkl')


from google.colab import files
files.download('breast_cancer_model.pkl').....extract the ml code from this
